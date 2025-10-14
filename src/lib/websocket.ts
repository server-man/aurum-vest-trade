import { supabase } from '@/integrations/supabase/client';

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
}

export interface TradingSignal {
  symbol: string;
  price: number;
  signal_type: 'buy' | 'sell' | 'hold';
  confidence_level: number;
  timestamp: string;
}

export interface PriceUpdate {
  symbol: string;
  price: number;
  change_24h: number;
  volume_24h: number;
  timestamp: string;
}

export class WebSocketManager {
  private connections: Map<string, WebSocket> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  constructor() {
    this.setupRealtimeSubscriptions();
  }

  private setupRealtimeSubscriptions() {
    // Listen for trading signals
    supabase
      .channel('signals-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'signals'
        },
        (payload) => {
          this.broadcastMessage('signal', payload.new);
        }
      )
      .subscribe();

    // Listen for price updates
    supabase
      .channel('price-updates-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'price_history'
        },
        (payload) => {
          this.broadcastMessage('price_update', payload.new);
        }
      )
      .subscribe();

    // Listen for bot trade updates
    supabase
      .channel('bot-trades-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bot_trades'
        },
        (payload) => {
          this.broadcastMessage('bot_trade', {
            event: payload.eventType,
            data: payload.new || payload.old
          });
        }
      )
      .subscribe();
  }

  /**
   * Connect to external WebSocket (e.g., Binance, CoinGecko)
   */
  connectToExternalSocket(url: string, id: string, onMessage?: (data: any) => void): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      try {
        const ws = new WebSocket(url);
        
        ws.onopen = () => {
          console.log(`WebSocket connected: ${id}`);
          this.connections.set(id, ws);
          this.reconnectAttempts.set(id, 0);
          resolve(ws);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (onMessage) {
              onMessage(data);
            }
            this.handleExternalMessage(id, data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onerror = (error) => {
          console.error(`WebSocket error for ${id}:`, error);
          reject(error);
        };

        ws.onclose = (event) => {
          console.log(`WebSocket closed: ${id}`, event.code, event.reason);
          this.connections.delete(id);
          
          if (event.code !== 1000) { // Not a normal closure
            this.handleReconnect(url, id, onMessage);
          }
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Handle reconnection logic with exponential backoff
   */
  private handleReconnect(url: string, id: string, onMessage?: (data: any) => void) {
    const attempts = this.reconnectAttempts.get(id) || 0;
    
    if (attempts < this.maxReconnectAttempts) {
      const delay = this.reconnectDelay * Math.pow(2, attempts);
      
      setTimeout(() => {
        console.log(`Attempting to reconnect ${id} (attempt ${attempts + 1}/${this.maxReconnectAttempts})`);
        this.reconnectAttempts.set(id, attempts + 1);
        this.connectToExternalSocket(url, id, onMessage);
      }, delay);
    } else {
      console.error(`Max reconnection attempts reached for ${id}`);
      this.reconnectAttempts.delete(id);
    }
  }

  /**
   * Handle messages from external WebSockets
   */
  private handleExternalMessage(socketId: string, data: any) {
    // Process different types of external messages
    switch (socketId) {
      case 'binance-prices':
        this.handleBinancePriceUpdate(data);
        break;
      case 'trading-signals':
        this.handleTradingSignal(data);
        break;
      default:
        console.log(`Unhandled message from ${socketId}:`, data);
    }
  }

  /**
   * Handle Binance price updates
   */
  private handleBinancePriceUpdate(data: any) {
    if (data.e === '24hrTicker') {
      const priceUpdate: PriceUpdate = {
        symbol: data.s,
        price: parseFloat(data.c),
        change_24h: parseFloat(data.P),
        volume_24h: parseFloat(data.v),
        timestamp: new Date(data.E).toISOString()
      };

      // Optionally store in database
      this.storePriceUpdate(priceUpdate);
      
      // Broadcast to subscribers
      this.broadcastMessage('price_update', priceUpdate);
    }
  }

  /**
   * Handle trading signals
   */
  private handleTradingSignal(data: any) {
    const signal: TradingSignal = {
      symbol: data.symbol,
      price: data.price,
      signal_type: data.type,
      confidence_level: data.confidence,
      timestamp: new Date().toISOString()
    };

    // Store signal in database
    this.storeSignal(signal);
    
    // Broadcast to subscribers
    this.broadcastMessage('signal', signal);
  }

  /**
   * Store price update in database
   */
  private async storePriceUpdate(priceUpdate: PriceUpdate) {
    try {
      await supabase
        .from('price_history')
        .insert({
          asset_symbol: priceUpdate.symbol,
          price: priceUpdate.price,
          change_24h: priceUpdate.change_24h,
          volume_24h: priceUpdate.volume_24h,
          recorded_at: priceUpdate.timestamp
        });
    } catch (error) {
      console.error('Error storing price update:', error);
    }
  }

  /**
   * Store trading signal in database
   */
  private async storeSignal(signal: TradingSignal) {
    try {
      await supabase
        .from('signals')
        .insert({
          symbol: signal.symbol,
          price: signal.price,
          signal_type: signal.signal_type,
          confidence_level: signal.confidence_level,
          source: 'external_websocket',
          is_active: true
        });
    } catch (error) {
      console.error('Error storing signal:', error);
    }
  }

  /**
   * Broadcast message to all listeners
   */
  private broadcastMessage(type: string, payload: any) {
    const message: WebSocketMessage = {
      type,
      payload,
      timestamp: Date.now()
    };

    // Emit custom event for React components to listen to
    window.dispatchEvent(new CustomEvent('websocket-message', { detail: message }));
  }

  /**
   * Connect to Binance WebSocket for real-time price data
   */
  async connectToBinance(symbols: string[]) {
    const streams = symbols.map(symbol => `${symbol.toLowerCase()}@ticker`).join('/');
    const url = `wss://stream.binance.com:9443/ws/${streams}`;
    
    return this.connectToExternalSocket(url, 'binance-prices', (data) => {
      console.log('Binance price update:', data);
    });
  }

  /**
   * Send message to specific WebSocket connection
   */
  sendMessage(socketId: string, message: any) {
    const ws = this.connections.get(socketId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.warn(`WebSocket ${socketId} is not connected`);
    }
  }

  /**
   * Subscribe to specific symbol updates
   */
  subscribeToSymbol(socketId: string, symbol: string) {
    this.sendMessage(socketId, {
      method: 'SUBSCRIBE',
      params: [`${symbol.toLowerCase()}@ticker`],
      id: Date.now()
    });
  }

  /**
   * Unsubscribe from symbol updates
   */
  unsubscribeFromSymbol(socketId: string, symbol: string) {
    this.sendMessage(socketId, {
      method: 'UNSUBSCRIBE',
      params: [`${symbol.toLowerCase()}@ticker`],
      id: Date.now()
    });
  }

  /**
   * Get connection status
   */
  getConnectionStatus(socketId: string): string {
    const ws = this.connections.get(socketId);
    if (!ws) return 'disconnected';
    
    switch (ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'connected';
      case WebSocket.CLOSING: return 'closing';
      case WebSocket.CLOSED: return 'closed';
      default: return 'unknown';
    }
  }

  /**
   * Close specific connection
   */
  disconnect(socketId: string) {
    const ws = this.connections.get(socketId);
    if (ws) {
      ws.close(1000, 'Manual disconnect');
      this.connections.delete(socketId);
    }
  }

  /**
   * Close all connections
   */
  disconnectAll() {
    this.connections.forEach((ws, id) => {
      ws.close(1000, 'Shutdown');
    });
    this.connections.clear();
    this.reconnectAttempts.clear();
  }

  /**
   * Get all active connections
   */
  getActiveConnections(): string[] {
    return Array.from(this.connections.keys());
  }
}

// Singleton instance
export const websocketManager = new WebSocketManager();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  websocketManager.disconnectAll();
});