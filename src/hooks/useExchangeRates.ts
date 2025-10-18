import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ExchangeRate {
  currency: string;
  rate: number;
  symbol: string;
}

export const useExchangeRates = (baseCurrency: string = 'USD', targetCurrencies: string[] = ['EUR', 'GBP', 'JPY', 'BTC', 'ETH']) => {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    BTC: '₿',
    ETH: 'Ξ',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF',
    CNY: '¥',
  };

  const fetchExchangeRates = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('exchange-rates', {
        body: { base_currency: baseCurrency, target_currencies: targetCurrencies }
      });

      if (error) throw error;

      if (data?.success && data?.rates) {
        const ratesArray: ExchangeRate[] = Object.entries(data.rates).map(([currency, rate]) => ({
          currency,
          rate: rate as number,
          symbol: currencySymbols[currency] || currency
        }));

        setRates(ratesArray);
        setLastUpdate(data.timestamp || Date.now() / 1000);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    } finally {
      setLoading(false);
    }
  }, [baseCurrency, targetCurrencies]);

  useEffect(() => {
    fetchExchangeRates();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchExchangeRates, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchExchangeRates]);

  const convertAmount = useCallback((amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    
    const fromRate = fromCurrency === baseCurrency ? 1 : rates.find(r => r.currency === fromCurrency)?.rate || 1;
    const toRate = toCurrency === baseCurrency ? 1 : rates.find(r => r.currency === toCurrency)?.rate || 1;
    
    return (amount / fromRate) * toRate;
  }, [rates, baseCurrency]);

  return {
    rates,
    loading,
    lastUpdate,
    refreshRates: fetchExchangeRates,
    convertAmount
  };
};
