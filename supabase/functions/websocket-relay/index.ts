import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400, 
      headers: corsHeaders 
    });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let binanceSocket: WebSocket | null = null;
  let userId: string | null = null;

  socket.onopen = () => {
    console.log('Client WebSocket opened');
    socket.send(JSON.stringify({ 
      type: 'connection', 
      status: 'connected',
      timestamp: Date.now()
    }));
  };

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);

      switch (message.type) {
        case 'authenticate':
          // Authenticate user
          userId = message.userId;
          socket.send(JSON.stringify({ 
            type: 'authenticated', 
            userId,
            timestamp: Date.now()
          }));
          break;

        case 'subscribe_binance':
          // Connect to Binance WebSocket
          const symbols = message.symbols || ['btcusdt', 'ethusdt'];
          const streams = symbols.map((s: string) => `${s.toLowerCase()}@ticker`).join('/');
          const binanceUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;
          
          binanceSocket = new WebSocket(binanceUrl);
          
          binanceSocket.onopen = () => {
            console.log('Binance WebSocket connected');
            socket.send(JSON.stringify({ 
              type: 'binance_connected',
              symbols,
              timestamp: Date.now()
            }));
          };

          binanceSocket.onmessage = async (binanceEvent) => {
            const binanceData = JSON.parse(binanceEvent.data);
            
            if (binanceData.data && binanceData.data.e === '24hrTicker') {
              const ticker = binanceData.data;
              const priceUpdate = {
                symbol: ticker.s,
                price: parseFloat(ticker.c),
                change_24h: parseFloat(ticker.P),
                volume_24h: parseFloat(ticker.v),
                high_24h: parseFloat(ticker.h),
                low_24h: parseFloat(ticker.l),
                timestamp: new Date(ticker.E).toISOString()
              };

              // Store in database
              try {
                await supabase.from('price_history').insert({
                  asset_symbol: priceUpdate.symbol,
                  price: priceUpdate.price,
                  change_24h: priceUpdate.change_24h,
                  volume_24h: priceUpdate.volume_24h,
                  market_cap: null
                });
              } catch (dbError) {
                console.error('Error storing price:', dbError);
              }

              // Forward to client
              socket.send(JSON.stringify({
                type: 'price_update',
                payload: priceUpdate,
                timestamp: Date.now()
              }));
            }
          };

          binanceSocket.onerror = (error) => {
            console.error('Binance WebSocket error:', error);
            socket.send(JSON.stringify({ 
              type: 'error',
              message: 'Binance connection error',
              timestamp: Date.now()
            }));
          };

          binanceSocket.onclose = () => {
            console.log('Binance WebSocket closed');
            socket.send(JSON.stringify({ 
              type: 'binance_disconnected',
              timestamp: Date.now()
            }));
          };
          break;

        case 'unsubscribe_binance':
          if (binanceSocket) {
            binanceSocket.close();
            binanceSocket = null;
          }
          break;

        default:
          socket.send(JSON.stringify({ 
            type: 'error',
            message: 'Unknown message type',
            timestamp: Date.now()
          }));
      }
    } catch (error) {
      console.error('Error processing message:', error);
      socket.send(JSON.stringify({ 
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      }));
    }
  };

  socket.onclose = () => {
    console.log('Client WebSocket closed');
    if (binanceSocket) {
      binanceSocket.close();
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return response;
});
