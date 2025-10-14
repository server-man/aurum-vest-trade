import { useEffect, useState, useCallback } from 'react';
import { websocketManager, WebSocketMessage, PriceUpdate, TradingSignal } from '@/lib/websocket';

export interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onPriceUpdate?: (update: PriceUpdate) => void;
  onSignal?: (signal: TradingSignal) => void;
  onBotTrade?: (trade: any) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');

  // Handle incoming WebSocket messages
  const handleMessage = useCallback((event: CustomEvent<WebSocketMessage>) => {
    const message = event.detail;
    setLastMessage(message);

    // Call general message handler
    options.onMessage?.(message);

    // Call specific handlers based on message type
    switch (message.type) {
      case 'price_update':
        options.onPriceUpdate?.(message.payload);
        break;
      case 'signal':
        options.onSignal?.(message.payload);
        break;
      case 'bot_trade':
        options.onBotTrade?.(message.payload);
        break;
    }
  }, [options]);

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('websocket-message', handleMessage as EventListener);
    
    return () => {
      window.removeEventListener('websocket-message', handleMessage as EventListener);
    };
  }, [handleMessage]);

  // Connect to Binance WebSocket
  const connectToBinance = useCallback(async (symbols: string[]) => {
    try {
      setConnectionStatus('connecting');
      await websocketManager.connectToBinance(symbols);
      setIsConnected(true);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Failed to connect to Binance WebSocket:', error);
      setConnectionStatus('error');
    }
  }, []);

  // Connect to external WebSocket
  const connectToSocket = useCallback(async (url: string, id: string, onMessage?: (data: any) => void) => {
    try {
      setConnectionStatus('connecting');
      await websocketManager.connectToExternalSocket(url, id, onMessage);
      setIsConnected(true);
      setConnectionStatus('connected');
    } catch (error) {
      console.error(`Failed to connect to WebSocket ${id}:`, error);
      setConnectionStatus('error');
    }
  }, []);

  // Subscribe to symbol
  const subscribeToSymbol = useCallback((socketId: string, symbol: string) => {
    websocketManager.subscribeToSymbol(socketId, symbol);
  }, []);

  // Unsubscribe from symbol
  const unsubscribeFromSymbol = useCallback((socketId: string, symbol: string) => {
    websocketManager.unsubscribeFromSymbol(socketId, symbol);
  }, []);

  // Send message
  const sendMessage = useCallback((socketId: string, message: any) => {
    websocketManager.sendMessage(socketId, message);
  }, []);

  // Disconnect
  const disconnect = useCallback((socketId?: string) => {
    if (socketId) {
      websocketManager.disconnect(socketId);
    } else {
      websocketManager.disconnectAll();
      setIsConnected(false);
      setConnectionStatus('disconnected');
    }
  }, []);

  // Get connection status
  const getStatus = useCallback((socketId: string) => {
    return websocketManager.getConnectionStatus(socketId);
  }, []);

  // Get active connections
  const getActiveConnections = useCallback(() => {
    return websocketManager.getActiveConnections();
  }, []);

  return {
    isConnected,
    connectionStatus,
    lastMessage,
    connectToBinance,
    connectToSocket,
    subscribeToSymbol,
    unsubscribeFromSymbol,
    sendMessage,
    disconnect,
    getStatus,
    getActiveConnections
  };
};