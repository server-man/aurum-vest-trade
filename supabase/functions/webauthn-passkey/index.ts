import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { action, credentialId, publicKey } = await req.json();

    if (action === 'register') {
      // Store the passkey credential
      const { error } = await supabaseClient
        .from('security_settings')
        .update({
          passkey_credential_id: credentialId,
          passkey_public_key: publicKey,
          passkey_enabled: true
        })
        .eq('user_id', user.id);

      if (error) throw error;

      console.log(`Passkey registered successfully for user ${user.id}`);
      
      return new Response(
        JSON.stringify({ success: true, message: 'Passkey registered successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'verify') {
      // Verify the passkey credential exists
      const { data: settings } = await supabaseClient
        .from('security_settings')
        .select('passkey_credential_id, passkey_public_key')
        .eq('user_id', user.id)
        .single();

      if (!settings?.passkey_credential_id) {
        return new Response(
          JSON.stringify({ success: false, message: 'No passkey registered' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // In a real implementation, you would verify the signature here
      // For now, we just check if the credential ID matches
      const isValid = settings.passkey_credential_id === credentialId;

      return new Response(
        JSON.stringify({ 
          success: isValid, 
          message: isValid ? 'Passkey verified' : 'Invalid passkey',
          publicKey: settings.passkey_public_key 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'remove') {
      // Remove the passkey
      const { error } = await supabaseClient
        .from('security_settings')
        .update({
          passkey_credential_id: null,
          passkey_public_key: null,
          passkey_enabled: false
        })
        .eq('user_id', user.id);

      if (error) throw error;

      console.log(`Passkey removed for user ${user.id}`);
      
      return new Response(
        JSON.stringify({ success: true, message: 'Passkey removed successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in webauthn-passkey function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
