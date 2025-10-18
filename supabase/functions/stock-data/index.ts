import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StockDataRequest {
  symbol: string;
  interval?: '1min' | '5min' | '15min' | '30min' | '60min' | 'daily';
  outputsize?: 'compact' | 'full';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    
    if (!ALPHA_VANTAGE_API_KEY) {
      throw new Error('ALPHA_VANTAGE_API_KEY not configured');
    }

    const { symbol, interval = '5min', outputsize = 'compact' }: StockDataRequest = await req.json();

    // Fetch intraday data from Alpha Vantage
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status}`);
    }

    const data = await response.json();

    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    if (data['Note']) {
      // API call frequency exceeded
      return new Response(
        JSON.stringify({
          success: false,
          error: 'API rate limit exceeded. Please try again later.'
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const timeSeriesKey = Object.keys(data).find(key => key.includes('Time Series'));
    
    if (!timeSeriesKey) {
      throw new Error('Invalid stock data response');
    }
    
    const timeSeries = data[timeSeriesKey];
    const metadata = data['Meta Data'];

    // Convert to chart data format
    const chartData = Object.entries(timeSeries || {}).map(([time, values]: [string, any]) => ({
      time: new Date(time).getTime() / 1000,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume'])
    })).reverse();

    return new Response(
      JSON.stringify({
        success: true,
        symbol: metadata?.['2. Symbol'] || symbol,
        interval: metadata?.['4. Interval'] || interval,
        data: chartData,
        lastRefreshed: metadata?.['3. Last Refreshed']
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in stock-data function:', error);
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
