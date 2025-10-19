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
    const { symbol, assetType = 'crypto' } = await req.json();
    
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch historical price data
    const { data: priceHistory, error: priceError } = await supabase
      .from('price_history')
      .select('*')
      .eq('asset_symbol', symbol)
      .order('recorded_at', { ascending: false })
      .limit(100);

    if (priceError) throw priceError;

    // If no historical data, fetch from Binance for crypto
    let currentPrice = 0;
    let historicalData = priceHistory || [];

    if (assetType === 'crypto' && historicalData.length === 0) {
      try {
        const binanceResponse = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
        );
        const binanceData = await binanceResponse.json();
        currentPrice = parseFloat(binanceData.lastPrice);
      } catch (error) {
        console.error('Error fetching from Binance:', error);
      }
    } else if (historicalData.length > 0) {
      currentPrice = parseFloat(historicalData[0].price);
    }

    // Prepare data summary for AI
    const priceDataSummary = historicalData.slice(0, 30).map(p => ({
      price: parseFloat(p.price),
      volume: p.volume_24h ? parseFloat(p.volume_24h) : 0,
      change: p.change_24h ? parseFloat(p.change_24h) : 0,
      time: p.recorded_at
    }));

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Use AI to generate predictions
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a financial analyst AI specializing in price predictions. Analyze historical price data and provide realistic short-term and long-term predictions. Return predictions in JSON format only with this structure:
{
  "predictions": {
    "1hour": { "price": number, "confidence": number, "trend": "up"|"down"|"stable" },
    "24hours": { "price": number, "confidence": number, "trend": "up"|"down"|"stable" },
    "7days": { "price": number, "confidence": number, "trend": "up"|"down"|"stable" },
    "30days": { "price": number, "confidence": number, "trend": "up"|"down"|"stable" }
  },
  "analysis": "Brief analysis of factors affecting the prediction",
  "riskLevel": "low"|"medium"|"high",
  "keyFactors": ["factor1", "factor2", "factor3"]
}

Confidence should be 0-100. Be realistic and conservative with predictions.`
          },
          {
            role: 'user',
            content: `Analyze ${symbol} (${assetType}) and provide price predictions.
            
Current price: $${currentPrice}
Recent price data (last 30 records):
${JSON.stringify(priceDataSummary, null, 2)}

Provide detailed predictions for 1 hour, 24 hours, 7 days, and 30 days.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Rate limit exceeded. Please try again later.' 
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'AI credits exhausted. Please add credits to continue.' 
          }),
          {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const prediction = aiData.choices[0].message.content;

    // Try to parse JSON from AI response
    let parsedPrediction;
    try {
      // Extract JSON if wrapped in markdown code blocks
      const jsonMatch = prediction.match(/```json\s*([\s\S]*?)\s*```/) || 
                       prediction.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : prediction;
      parsedPrediction = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Return a safe fallback structure
      parsedPrediction = {
        predictions: {
          "1hour": { price: currentPrice * 1.001, confidence: 50, trend: "stable" },
          "24hours": { price: currentPrice * 1.01, confidence: 45, trend: "up" },
          "7days": { price: currentPrice * 1.05, confidence: 40, trend: "up" },
          "30days": { price: currentPrice * 1.1, confidence: 30, trend: "up" }
        },
        analysis: "Unable to generate detailed analysis at this time.",
        riskLevel: "medium",
        keyFactors: ["Market volatility", "Trading volume", "Historical trends"]
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        symbol,
        currentPrice,
        assetType,
        ...parsedPrediction,
        generatedAt: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in price-predictions function:', error);
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
