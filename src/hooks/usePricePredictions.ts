import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Prediction {
  price: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

interface PricePredictions {
  symbol: string;
  currentPrice: number;
  assetType: string;
  predictions: {
    '1hour': Prediction;
    '24hours': Prediction;
    '7days': Prediction;
    '30days': Prediction;
  };
  analysis: string;
  riskLevel: 'low' | 'medium' | 'high';
  keyFactors: string[];
  generatedAt: string;
}

export const usePricePredictions = () => {
  const [predictions, setPredictions] = useState<PricePredictions | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPredictions = async (symbol: string, assetType: 'crypto' | 'stock' = 'crypto') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('price-predictions', {
        body: { symbol, assetType }
      });

      if (error) throw error;

      if (data?.success) {
        setPredictions(data);
        toast({
          title: "Predictions Generated",
          description: `AI analysis complete for ${symbol}`,
        });
      } else {
        throw new Error(data?.error || 'Failed to generate predictions');
      }
    } catch (error: any) {
      console.error('Error fetching predictions:', error);
      
      let errorMessage = 'Failed to generate predictions';
      if (error.message?.includes('Rate limit')) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (error.message?.includes('credits')) {
        errorMessage = 'AI credits exhausted. Please add credits to continue.';
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    predictions,
    loading,
    fetchPredictions,
  };
};
