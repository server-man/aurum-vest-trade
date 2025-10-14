import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AIAnalysis {
  analysis?: string;
  recommendation?: string;
  sentiment?: any;
  signal?: string;
  confidence?: number;
  riskScore?: number;
  marketData?: any;
  timestamp?: string;
  reasoning?: string;
  entry?: number;
  takeProfit?: number;
  stopLoss?: number;
  factors?: string[];
  recommendations?: string[];
  shouldContinue?: boolean;
}

export const useCryptoAI = () => {
  const [loading, setLoading] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<AIAnalysis | null>(null);

  const analyzeMarket = useCallback(async (symbol: string, userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('crypto-ai-agent', {
        body: { action: 'analyze_market', symbol, userId }
      });

      if (error) throw error;

      setLastAnalysis(data.data);
      return data.data;
    } catch (error) {
      console.error('Error analyzing market:', error);
      toast.error('Failed to analyze market');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateSignal = useCallback(async (symbol: string, userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('crypto-ai-agent', {
        body: { action: 'generate_signal', symbol, userId }
      });

      if (error) throw error;

      const signalData = data.data;
      
      // Store signal in database
      if (signalData.signal !== 'HOLD') {
        const { error: insertError } = await supabase.from('signals').insert({
          symbol: signalData.symbol,
          signal_type: signalData.signal.toLowerCase(),
          price: signalData.currentPrice,
          target_price: signalData.entry * (1 + signalData.takeProfit / 100),
          stop_loss: signalData.entry * (1 - signalData.stopLoss / 100),
          confidence_level: signalData.confidence,
          description: signalData.reasoning,
          source: 'AI Agent',
          is_active: true,
        });

        if (insertError) {
          console.error('Error storing signal:', insertError);
        }
      }

      setLastAnalysis(signalData);
      return signalData;
    } catch (error) {
      console.error('Error generating signal:', error);
      toast.error('Failed to generate signal');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeSentiment = useCallback(async (symbol: string, userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('crypto-ai-agent', {
        body: { action: 'sentiment_analysis', symbol, userId }
      });

      if (error) throw error;

      setLastAnalysis(data.data);
      return data.data;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      toast.error('Failed to analyze sentiment');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const assessRisk = useCallback(async (botId: string, userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('crypto-ai-agent', {
        body: { action: 'risk_assessment', botId, userId }
      });

      if (error) throw error;

      setLastAnalysis(data.data);
      return data.data;
    } catch (error) {
      console.error('Error assessing risk:', error);
      toast.error('Failed to assess risk');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTradeRecommendation = useCallback(async (symbol: string, userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('crypto-ai-agent', {
        body: { action: 'trade_recommendation', symbol, userId }
      });

      if (error) throw error;

      setLastAnalysis(data.data);
      return data.data;
    } catch (error) {
      console.error('Error getting recommendation:', error);
      toast.error('Failed to get recommendation');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const syncMarketData = useCallback(async (symbols?: string[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('market-data-sync', {
        body: { symbols }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error syncing market data:', error);
      throw error;
    }
  }, []);

  return {
    loading,
    lastAnalysis,
    analyzeMarket,
    generateSignal,
    analyzeSentiment,
    assessRisk,
    getTradeRecommendation,
    syncMarketData,
  };
};
