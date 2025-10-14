import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWebSocket } from './useWebSocket';

export interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h?: number;
  low24h?: number;
  lastUpdate: string;
}

export const useMarketData = (symbols: string[] = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT']) => {
  const [prices, setPrices] = useState<Map<string, CryptoPrice>>(new Map());
  const [loading, setLoading] = useState(true);

  const { isConnected, connectToBinance, disconnect } = useWebSocket({
    onPriceUpdate: (update) => {
      setPrices(prev => {
        const newPrices = new Map(prev);
        newPrices.set(update.symbol, {
          symbol: update.symbol,
          price: update.price,
          change24h: update.change_24h,
          volume24h: update.volume_24h,
          lastUpdate: update.timestamp,
        });
        return newPrices;
      });
    }
  });

  const fetchInitialPrices = useCallback(async () => {
    try {
      setLoading(true);
      const priceMap = new Map<string, CryptoPrice>();

      for (const symbol of symbols) {
        try {
          const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
          const data = await response.json();

          priceMap.set(symbol, {
            symbol: data.symbol,
            price: parseFloat(data.lastPrice),
            change24h: parseFloat(data.priceChangePercent),
            volume24h: parseFloat(data.volume),
            high24h: parseFloat(data.highPrice),
            low24h: parseFloat(data.lowPrice),
            lastUpdate: new Date().toISOString(),
          });
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
        }
      }

      setPrices(priceMap);
    } catch (error) {
      console.error('Error fetching initial prices:', error);
    } finally {
      setLoading(false);
    }
  }, [symbols]);

  const syncToDatabase = useCallback(async () => {
    try {
      await supabase.functions.invoke('market-data-sync', {
        body: { symbols }
      });
    } catch (error) {
      console.error('Error syncing to database:', error);
    }
  }, [symbols]);

  useEffect(() => {
    fetchInitialPrices();
    
    // Connect to WebSocket for real-time updates
    connectToBinance(symbols);

    // Sync to database every 5 minutes
    const syncInterval = setInterval(syncToDatabase, 5 * 60 * 1000);

    return () => {
      disconnect();
      clearInterval(syncInterval);
    };
  }, [symbols, connectToBinance, disconnect, fetchInitialPrices, syncToDatabase]);

  const getPrice = useCallback((symbol: string) => {
    return prices.get(symbol);
  }, [prices]);

  const getAllPrices = useCallback(() => {
    return Array.from(prices.values());
  }, [prices]);

  const refreshPrices = useCallback(async () => {
    await fetchInitialPrices();
  }, [fetchInitialPrices]);

  return {
    prices,
    loading,
    isConnected,
    getPrice,
    getAllPrices,
    refreshPrices,
  };
};
