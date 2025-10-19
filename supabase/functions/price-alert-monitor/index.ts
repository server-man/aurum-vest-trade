import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all active price alerts
    const { data: alerts, error: alertsError } = await supabase
      .from('price_alerts')
      .select('*')
      .eq('is_active', true)
      .is('triggered_at', null);

    if (alertsError) throw alertsError;

    if (!alerts || alerts.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No active alerts to check' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get unique symbols to fetch prices for
    const cryptoSymbols = [...new Set(
      alerts
        .filter(a => a.asset_type === 'crypto')
        .map(a => a.symbol)
    )];

    let triggeredAlerts = 0;

    // Check crypto prices
    if (cryptoSymbols.length > 0) {
      // Fetch current prices from Binance
      for (const symbol of cryptoSymbols) {
        try {
          const response = await fetch(
            `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
          );
          
          if (!response.ok) continue;
          
          const priceData = await response.json();
          const currentPrice = parseFloat(priceData.price);

          // Check alerts for this symbol
          const symbolAlerts = alerts.filter(
            a => a.symbol === symbol && a.asset_type === 'crypto'
          );

          for (const alert of symbolAlerts) {
            let shouldTrigger = false;

            if (alert.condition === 'above' && currentPrice >= alert.target_price) {
              shouldTrigger = true;
            } else if (alert.condition === 'below' && currentPrice <= alert.target_price) {
              shouldTrigger = true;
            }

            if (shouldTrigger) {
              // Update alert as triggered
              await supabase
                .from('price_alerts')
                .update({
                  triggered_at: new Date().toISOString(),
                  is_active: false,
                })
                .eq('id', alert.id);

              // Send notification
              await supabase.functions.invoke('send-notification', {
                body: {
                  userId: alert.user_id,
                  title: 'Price Alert Triggered',
                  message: `${alert.symbol} is now ${alert.condition} $${alert.target_price}. Current price: $${currentPrice.toFixed(2)}`,
                  type: 'alert',
                },
              });

              triggeredAlerts++;
            }
          }
        } catch (error) {
          console.error(`Error checking price for ${symbol}:`, error);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Checked ${alerts.length} alerts, triggered ${triggeredAlerts}`,
        triggeredAlerts,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in price-alert-monitor:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
