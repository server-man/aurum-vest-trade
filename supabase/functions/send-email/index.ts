import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  template_id?: string;
  variables?: Record<string, any>;
  subject?: string;
  html_content?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { to, template_id, variables, subject, html_content }: EmailRequest = await req.json();

    if (!to) {
      throw new Error('Recipient email is required');
    }

    let finalSubject = subject || 'Message from Aurum Vest';
    let finalHtml = html_content || '';

    // If template_id is provided, fetch the template
    if (template_id) {
      const { data: template, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', template_id)
        .eq('is_active', true)
        .single();

      if (error || !template) {
        throw new Error('Email template not found or inactive');
      }

      finalSubject = template.subject;
      finalHtml = template.html_content;

      // Replace variables in the template
      if (variables) {
        Object.keys(variables).forEach((key) => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          finalSubject = finalSubject.replace(regex, variables[key]);
          finalHtml = finalHtml.replace(regex, variables[key]);
        });
      }
    }

    // Send email using Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Aurum Vest <noreply@aurumvest.xyz>',
        to: [to],
        subject: finalSubject,
        html: finalHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await response.json();

    console.log('Email sent successfully:', data);

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error in send-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
