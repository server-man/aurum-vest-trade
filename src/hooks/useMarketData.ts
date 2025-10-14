import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWebSocket } from './useWebSocket';
import { useIsMounted, useSafeInterval } from '@/lib/memoryLeakPrevention';
import { debounce } from '@/lib/performanceOptimization';
import { PriceUpdate } from '@/lib/websocket';

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
  const isMounted = useIsMounted();

  // Debounced price update to prevent excessive re-renders
  const debouncedPriceUpdate = useCallback(
    debounce((update: PriceUpdate) => {
      if (!isMounted.current) return;
      
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
    }, 100),
    [isMounted]
  );

  const { isConnected, connectToBinance, disconnect } = useWebSocket({
    onPriceUpdate: debouncedPriceUpdate
  });

  const fetchInitialPrices = useCallback(async () => {
    try {
      setLoading(true);
      const priceMap = new Map<string, CryptoPrice>();

      // Fetch all prices in parallel for better performance
      const fetchPromises = symbols.map(async (symbol) => {
        try {
          const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
          const data = await response.json();

          return {
            symbol: data.symbol,
            data: {
              symbol: data.symbol,
              price: parseFloat(data.lastPrice),
              change24h: parseFloat(data.priceChangePercent),
              volume24h: parseFloat(data.volume),
              high24h: parseFloat(data.highPrice),
              low24h: parseFloat(data.lowPrice),
              lastUpdate: new Date().toISOString(),
            }
          };
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          return null;
        }
      });

      const results = await Promise.all(fetchPromises);
      
      if (!isMounted.current) return;

      results.forEach(result => {
        if (result) {
          priceMap.set(result.symbol, result.data);
        }
      });

      setPrices(priceMap);
    } catch (error) {
      console.error('Error fetching initial prices:', error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [symbols, isMounted]);

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

    return () => {
      disconnect();
    };
  }, [symbols, connectToBinance, disconnect, fetchInitialPrices]);

  // Use safe interval for database sync
  useSafeInterval(syncToDatabase, 5 * 60 * 1000);

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
