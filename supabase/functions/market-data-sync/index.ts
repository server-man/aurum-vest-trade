import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const symbolsToFetch = symbols || [
      'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOGEUSDT',
      'SOLUSDT', 'XRPUSDT', 'DOTUSDT', 'MATICUSDT', 'LINKUSDT'
    ];

    const priceData = [];

    for (const symbol of symbolsToFetch) {
      try {
        // Fetch from Binance API
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
        
        if (!response.ok) {
          console.error(`Failed to fetch ${symbol}: ${response.status}`);
          continue;
        }

        const data = await response.json();
        
        const priceEntry = {
          asset_symbol: symbol,
          price: parseFloat(data.lastPrice),
          change_24h: parseFloat(data.priceChangePercent),
          volume_24h: parseFloat(data.volume),
          market_cap: null, // Would need CoinGecko API for this
          recorded_at: new Date().toISOString(),
        };

        // Insert into database
        const { error } = await supabase
          .from('price_history')
          .insert(priceEntry);

        if (error) {
          console.error(`Error inserting ${symbol}:`, error);
        } else {
          priceData.push(priceEntry);
        }

      } catch (error) {
        console.error(`Error processing ${symbol}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: priceData.length,
        data: priceData 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in market-data-sync:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
