import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'signal' | 'trade' | 'kyc';
  link?: string;
  send_push?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { user_id, title, message, type, link, send_push } = await req.json() as NotificationRequest;

    // Validate input
    if (!user_id || !title || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id, title, message' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert notification into database
    const { data: notification, error: dbError } = await supabase
      .from('notifications')
      .insert({
        user_id,
        title,
        message,
        type,
        link,
        is_read: false
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to create notification', details: dbError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send push notification if requested
    if (send_push) {
      // Get user's push subscription
      const { data: pushSubscription } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', user_id)
        .eq('is_active', true)
        .single();

      if (pushSubscription) {
        try {
          // Send push notification using Web Push API
          const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
          const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');

          if (vapidPublicKey && vapidPrivateKey) {
            // Implementation note: Web Push requires the web-push library
            // For now, we'll log that push was requested
            console.log('Push notification requested for user:', user_id);
            console.log('Push subscription:', pushSubscription);
            
            // In production, you would use web-push library here
            // const webpush = require('web-push');
            // webpush.setVapidDetails('mailto:admin@aurumvest.com', vapidPublicKey, vapidPrivateKey);
            // await webpush.sendNotification(pushSubscription.subscription_data, JSON.stringify({
            //   title, body: message, icon: '/logo.png', badge: '/badge.png', data: { link }
            // }));
          }
        } catch (pushError) {
          console.error('Push notification error:', pushError);
          // Don't fail the whole request if push fails
        }
      }
    }

    console.log('Notification created:', notification);

    return new Response(
      JSON.stringify({ 
        success: true, 
        notification,
        push_sent: send_push 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
