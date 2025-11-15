import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.79.0';
import { setCookie } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://aurumvest.xyz',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Credentials': 'true',
};

interface VerificationRequest {
  verificationType: 'password';
  password: string;
}

// Generate secure random token
async function generateToken(): Promise<string> {
  const buffer = new Uint8Array(32);
  crypto.getRandomValues(buffer);
  return Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user has admin role
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || !roleData || roleData.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Access denied. Admin role required.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const requestBody = await req.json() as VerificationRequest;
    const { verificationType, password } = requestBody;

    // Validate input
    if (verificationType !== 'password' || !password) {
      return new Response(
        JSON.stringify({ error: 'Password is required for verification.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Re-authenticate user with password
    const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email: user.email!,
      password: password,
    });

    if (authError || !authData.user || authData.user.id !== user.id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid password or authentication failed.' 
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate secure verification token
    const verificationToken = await generateToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store verification token in database
    const { error: tokenError } = await supabaseClient
      .from('admin_verification_tokens')
      .insert({
        user_id: user.id,
        token: verificationToken,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      return new Response(
        JSON.stringify({ error: 'Failed to create verification session.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Set HTTP-only cookie
    const headers = new Headers(corsHeaders);
    headers.set('Content-Type', 'application/json');
    
    setCookie(headers, {
      name: 'admin_verification',
      value: verificationToken,
      expires: expiresAt,
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/',
      domain: 'aurumvest.xyz',
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Admin verification successful. You can now access the admin panel.',
      }),
      { status: 200, headers }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
