import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarketData {
  symbol: string;
  price: number;
  volume24h: number;
  change24h: number;
  high24h: number;
  low24h: number;
}

interface TradingContext {
  marketData: MarketData[];
  activeBots: any[];
  userBalance: number;
  recentSignals: any[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, symbol, botId, userId } = await req.json();
    
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    const HUGGINGFACE_API_KEY = Deno.env.get('HUGGINGFACE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch real-time market data from Binance
    const marketData = await fetchMarketData([symbol || 'BTCUSDT', 'ETHUSDT', 'BNBUSDT']);
    
    // Get trading context
    const context = await getTradingContext(supabase, userId, marketData);

    let response;
    switch (action) {
      case 'analyze_market':
        response = await analyzeMarket(OPENROUTER_API_KEY!, context, symbol);
        break;
      case 'generate_signal':
        response = await generateTradingSignal(OPENROUTER_API_KEY!, context, symbol);
        break;
      case 'sentiment_analysis':
        response = await analyzeSentiment(HUGGINGFACE_API_KEY!, symbol, marketData);
        break;
      case 'risk_assessment':
        response = await assessRisk(OPENROUTER_API_KEY!, context, botId);
        break;
      case 'trade_recommendation':
        response = await getTradeRecommendation(OPENROUTER_API_KEY!, context, symbol);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({ success: true, data: response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in crypto-ai-agent:', error);
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

async function fetchMarketData(symbols: string[]): Promise<MarketData[]> {
  const marketData: MarketData[] = [];
  
  for (const symbol of symbols) {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
      const data = await response.json();
      
      marketData.push({
        symbol: data.symbol,
        price: parseFloat(data.lastPrice),
        volume24h: parseFloat(data.volume),
        change24h: parseFloat(data.priceChangePercent),
        high24h: parseFloat(data.highPrice),
        low24h: parseFloat(data.lowPrice),
      });
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
    }
  }
  
  return marketData;
}

async function getTradingContext(supabase: any, userId: string, marketData: MarketData[]): Promise<TradingContext> {
  const { data: bots } = await supabase
    .from('trading_bots')
    .select('*')
    .eq('user_id', userId)
    .eq('is_activated', true);

  const { data: signals } = await supabase
    .from('signals')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: wallet } = await supabase
    .from('user_wallets')
    .select('balance')
    .eq('user_id', userId)
    .single();

  return {
    marketData,
    activeBots: bots || [],
    userBalance: wallet?.balance || 0,
    recentSignals: signals || [],
  };
}

async function analyzeMarket(apiKey: string, context: TradingContext, symbol: string) {
  const marketInfo = context.marketData.find(m => m.symbol === symbol) || context.marketData[0];
  
  const prompt = `You are an expert cryptocurrency trading analyst. Analyze the current market conditions for ${marketInfo.symbol}:

Current Price: $${marketInfo.price}
24h Change: ${marketInfo.change24h}%
24h High: $${marketInfo.high24h}
24h Low: $${marketInfo.low24h}
24h Volume: ${marketInfo.volume24h}

Recent Signals: ${JSON.stringify(context.recentSignals.slice(0, 3))}

Provide a comprehensive market analysis including:
1. Current market sentiment (bullish/bearish/neutral)
2. Key support and resistance levels
3. Volume analysis
4. Short-term price prediction (next 1-4 hours)
5. Risk factors to consider

Be concise and actionable.`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://aurumvest.app',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: 'You are a professional cryptocurrency trading analyst with expertise in technical analysis and market trends.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  return {
    analysis: data.choices[0].message.content,
    marketData: marketInfo,
    timestamp: new Date().toISOString(),
  };
}

async function generateTradingSignal(apiKey: string, context: TradingContext, symbol: string) {
  const marketInfo = context.marketData.find(m => m.symbol === symbol) || context.marketData[0];
  
  const prompt = `As an AI trading system, analyze ${marketInfo.symbol} and generate a trading signal:

Current Market Data:
- Price: $${marketInfo.price}
- 24h Change: ${marketInfo.change24h}%
- 24h Volume: ${marketInfo.volume24h}
- High: $${marketInfo.high24h}
- Low: $${marketInfo.low24h}

Based on technical indicators and market conditions, provide:
1. Signal Type (BUY/SELL/HOLD)
2. Confidence Level (0-100)
3. Entry Price
4. Take Profit Level (%)
5. Stop Loss Level (%)
6. Reasoning (2-3 sentences)

Format as JSON: {"signal":"BUY/SELL/HOLD","confidence":85,"entry":price,"takeProfit":percentage,"stopLoss":percentage,"reasoning":"..."}`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://aurumvest.app',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: 'You are an AI trading signal generator. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 500,
    }),
  });

  const data = await response.json();
  const signalText = data.choices[0].message.content;
  
  // Parse JSON response
  const jsonMatch = signalText.match(/\{[\s\S]*\}/);
  const signalData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  
  return {
    ...signalData,
    symbol: marketInfo.symbol,
    currentPrice: marketInfo.price,
    timestamp: new Date().toISOString(),
  };
}

async function analyzeSentiment(apiKey: string, symbol: string, marketData: MarketData[]) {
  const market = marketData.find(m => m.symbol === symbol) || marketData[0];
  
  try {
    // Use HuggingFace for sentiment analysis
    const response = await fetch(
      'https://api-inference.huggingface.co/models/ProsusAI/finbert',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `${market.symbol} price is $${market.price} with ${market.change24h}% change in 24 hours. Volume is ${market.volume24h}.`
        }),
      }
    );

    const sentimentData = await response.json();
    
    return {
      symbol: market.symbol,
      sentiment: sentimentData[0],
      marketData: market,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    // Fallback to rule-based sentiment
    const sentiment = market.change24h > 5 ? 'positive' : market.change24h < -5 ? 'negative' : 'neutral';
    return {
      symbol: market.symbol,
      sentiment: { label: sentiment, score: Math.abs(market.change24h) / 10 },
      marketData: market,
      timestamp: new Date().toISOString(),
    };
  }
}

async function assessRisk(apiKey: string, context: TradingContext, botId: string) {
  const bot = context.activeBots.find(b => b.id === botId);
  
  if (!bot) {
    throw new Error('Bot not found');
  }

  const prompt = `Assess the risk level for this trading bot configuration:

Bot Details:
- Trading Pair: ${bot.trading_pair}
- Current Balance: $${bot.current_balance}
- Initial Balance: $${bot.initial_balance}
- P&L: $${bot.profit_loss} (${bot.profit_loss_percentage}%)
- Max Active Deals: ${bot.max_active_deals}
- Take Profit: ${bot.take_profit_percentage}%
- Stop Loss: ${bot.stop_loss_percentage}%
- Risk Level: ${bot.risk_level}

Market Conditions:
${JSON.stringify(context.marketData.find(m => m.symbol === bot.trading_pair))}

Provide:
1. Overall risk score (1-10)
2. Risk factors
3. Recommendations to reduce risk
4. Whether to continue trading or pause

Format as JSON: {"riskScore":7,"factors":["..."],"recommendations":["..."],"shouldContinue":true}`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://aurumvest.app',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: 'You are a risk management expert for cryptocurrency trading. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.6,
    }),
  });

  const data = await response.json();
  const riskText = data.choices[0].message.content;
  const jsonMatch = riskText.match(/\{[\s\S]*\}/);
  const riskData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  
  return {
    botId,
    ...riskData,
    timestamp: new Date().toISOString(),
  };
}

async function getTradeRecommendation(apiKey: string, context: TradingContext, symbol: string) {
  const market = context.marketData.find(m => m.symbol === symbol) || context.marketData[0];
  
  const prompt = `As an AI trading advisor, provide a trade recommendation for ${market.symbol}:

Current Situation:
- Price: $${market.price}
- 24h Change: ${market.change24h}%
- Volume: ${market.volume24h}
- User Balance: $${context.userBalance}
- Active Bots: ${context.activeBots.length}

Provide actionable trade recommendation including:
1. Action (BUY/SELL/HOLD/WAIT)
2. Suggested position size (% of balance)
3. Entry strategy
4. Exit strategy
5. Risk management tips

Be specific and practical.`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://aurumvest.app',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: 'You are an experienced cryptocurrency trading advisor focused on risk-adjusted returns.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  const data = await response.json();
  
  return {
    recommendation: data.choices[0].message.content,
    marketData: market,
    timestamp: new Date().toISOString(),
  };
}
