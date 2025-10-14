import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { encode as base32Encode, decode as base32Decode } from "https://deno.land/std@0.177.0/encoding/base32.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting for 2FA attempts
const rateLimitMap = new Map<string, { attempts: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(userId: string): { allowed: boolean; remainingAttempts?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(userId);

  if (record) {
    if (now - record.lastAttempt < LOCKOUT_DURATION) {
      if (record.attempts >= MAX_ATTEMPTS) {
        return { allowed: false };
      }
    } else {
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

// Generate TOTP secret
function generateSecret(): string {
  const buffer = new Uint8Array(20);
  crypto.getRandomValues(buffer);
  return base32Encode(buffer).replace(/=/g, '');
}

// Verify TOTP token
async function verifyTOTP(secret: string, token: string): Promise<boolean> {
  const window = 1; // Allow 1 time window before/after
  const timeStep = 30;
  const currentTime = Math.floor(Date.now() / 1000 / timeStep);

  for (let i = -window; i <= window; i++) {
    const time = currentTime + i;
    const hmac = await generateHOTP(secret, time);
    
    if (hmac === token) {
      return true;
    }
  }
  
  return false;
}

async function generateHOTP(secret: string, counter: number): Promise<string> {
  // Decode base32 secret
  const key = base32Decode(secret);
  
  // Convert counter to buffer
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setBigUint64(0, BigInt(counter), false);
  
  // HMAC-SHA1
  const algorithm = { name: "HMAC", hash: "SHA-1" };
  
  // Convert Uint8Array to proper ArrayBuffer by creating a new one
  const keyBuffer = new Uint8Array(key).buffer as ArrayBuffer;
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    algorithm,
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, new Uint8Array(buffer));
  const hmac = new Uint8Array(signature);
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = (
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)
  ) % 1000000;
  
  return code.toString().padStart(6, '0');
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

    // Check rate limit for verify and validate actions
    const { action, token } = await req.json();
    
    if (action === 'verify' || action === 'validate') {
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
    }

    if (action === 'setup') {
      // Generate new secret
      const secret = generateSecret();
      
      // Store secret temporarily (not enabled yet)
      const { error } = await supabaseClient
        .from('security_settings')
        .update({
          two_factor_secret: secret,
          two_factor_enabled: false
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Generate QR code URL for authenticator apps
      const otpauthUrl = `otpauth://totp/TradingApp:${user.email}?secret=${secret}&issuer=TradingApp`;

      console.log(`2FA setup initiated for user ${user.id}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          secret,
          qrCodeUrl: otpauthUrl
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'verify') {
      // Verify the token and enable 2FA
      const { data: settings } = await supabaseClient
        .from('security_settings')
        .select('two_factor_secret')
        .eq('user_id', user.id)
        .single();

      if (!settings?.two_factor_secret) {
        return new Response(
          JSON.stringify({ success: false, message: 'No 2FA secret found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const isValid = await verifyTOTP(settings.two_factor_secret, token);

      if (isValid) {
        // Enable 2FA
        const { error } = await supabaseClient
          .from('security_settings')
          .update({
            two_factor_enabled: true,
            two_factor_method: 'authenticator'
          })
          .eq('user_id', user.id);

        if (error) throw error;

        resetAttempts(user.id);
        console.log(`2FA enabled successfully for user ${user.id}`);
      } else {
        recordFailedAttempt(user.id);
      }

      return new Response(
        JSON.stringify({ 
          success: isValid, 
          message: isValid ? '2FA enabled successfully' : 'Invalid verification code' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'validate') {
      // Validate a 2FA token during login
      const { data: settings } = await supabaseClient
        .from('security_settings')
        .select('two_factor_secret, two_factor_enabled')
        .eq('user_id', user.id)
        .single();

      if (!settings?.two_factor_enabled || !settings?.two_factor_secret) {
        return new Response(
          JSON.stringify({ success: false, message: '2FA not enabled' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const isValid = await verifyTOTP(settings.two_factor_secret, token);

      if (isValid) {
        resetAttempts(user.id);
      } else {
        recordFailedAttempt(user.id);
      }

      return new Response(
        JSON.stringify({ 
          success: isValid, 
          message: isValid ? 'Valid code' : 'Invalid code' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in two-factor-auth function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
