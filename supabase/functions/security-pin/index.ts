import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting: Track failed attempts
const rateLimitMap = new Map<string, { attempts: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(userId: string): { allowed: boolean; remainingAttempts?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(userId);

  if (record) {
    // Check if lockout period has passed
    if (now - record.lastAttempt < LOCKOUT_DURATION) {
      if (record.attempts >= MAX_ATTEMPTS) {
        return { allowed: false };
      }
    } else {
      // Reset after lockout period
      rateLimitMap.delete(userId);
    }
  }

  return { allowed: true, remainingAttempts: MAX_ATTEMPTS - (record?.attempts || 0) };
}

function recordFailedAttempt(userId: string) {
  const now = Date.now();
  const record = rateLimitMap.get(userId);

  if (record) {
    record.attempts += 1;
    record.lastAttempt = now;
  } else {
    rateLimitMap.set(userId, { attempts: 1, lastAttempt: now });
  }
}

function resetAttempts(userId: string) {
  rateLimitMap.delete(userId);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check rate limit
    const rateLimit = checkRateLimit(user.id);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Too many failed attempts. Please try again in 15 minutes.',
          locked: true 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, pin } = await req.json();

    if (action === 'set') {
      // Hash the PIN with bcrypt
      const salt = await bcrypt.genSalt(10);
      const pinHash = await bcrypt.hash(pin, salt);

      // Store the hashed PIN
      const { error } = await supabaseClient
        .from('security_settings')
        .update({
          pin_hash: pinHash,
          pin_enabled: true,
          last_pin_change: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Reset rate limit on successful PIN set
      resetAttempts(user.id);

      console.log(`PIN set successfully for user ${user.id}`);
      
      return new Response(
        JSON.stringify({ success: true, message: 'PIN set successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'verify') {
      // Verify the PIN
      const { data: settings } = await supabaseClient
        .from('security_settings')
        .select('pin_hash')
        .eq('user_id', user.id)
        .single();

      if (!settings?.pin_hash) {
        return new Response(
          JSON.stringify({ success: false, message: 'No PIN set' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const isValid = await bcrypt.compare(pin, settings.pin_hash);

      if (isValid) {
        resetAttempts(user.id);
      } else {
        recordFailedAttempt(user.id);
      }

      return new Response(
        JSON.stringify({ 
          success: isValid, 
          message: isValid ? 'PIN verified' : 'Invalid PIN',
          remainingAttempts: rateLimit.remainingAttempts 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in security-pin function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
