import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExchangeRateRequest {
  base_currency?: string;
  target_currencies?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const EXCHANGE_RATE_API_KEY = Deno.env.get('EXCHANGE_RATE_API_KEY');
    
    if (!EXCHANGE_RATE_API_KEY) {
      throw new Error('EXCHANGE_RATE_API_KEY not configured');
    }

    const { base_currency = 'USD', target_currencies = ['EUR', 'GBP', 'JPY', 'BTC', 'ETH'] }: ExchangeRateRequest = await req.json();

    // Fetch exchange rates from ExchangeRate API
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/${base_currency}`
    );

    if (!response.ok) {
      throw new Error(`Exchange Rate API error: ${response.status}`);
    }

    const data = await response.json();

    // Filter for requested currencies
    const rates: Record<string, number> = {};
    target_currencies.forEach(currency => {
      if (data.conversion_rates[currency]) {
        rates[currency] = data.conversion_rates[currency];
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        base_currency,
        rates,
        timestamp: data.time_last_update_unix,
        next_update: data.time_next_update_unix
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in exchange-rates function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
