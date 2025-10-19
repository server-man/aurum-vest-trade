import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PriceAlert {
  id: string;
  user_id: string;
  symbol: string;
  asset_type: 'crypto' | 'stock';
  target_price: number;
  condition: 'above' | 'below';
  is_active: boolean;
  triggered_at?: string;
  created_at: string;
  updated_at: string;
}

export const usePriceAlerts = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts((data as PriceAlert[]) || []);
    } catch (error) {
      console.error('Error fetching price alerts:', error);
      toast({
        title: "Error",
        description: "Failed to load price alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async (
    symbol: string,
    assetType: 'crypto' | 'stock',
    targetPrice: number,
    condition: 'above' | 'below'
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('price_alerts')
        .insert({
          user_id: user.id,
          symbol,
          asset_type: assetType,
          target_price: targetPrice,
          condition,
          is_active: true,
        });

      if (error) throw error;

      toast({
        title: "Alert Created",
        description: `You'll be notified when ${symbol} goes ${condition} $${targetPrice}`,
      });

      await fetchAlerts();
    } catch (error: any) {
      console.error('Error creating price alert:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create alert",
        variant: "destructive",
      });
    }
  };

  const toggleAlert = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('price_alerts')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: isActive ? "Alert Enabled" : "Alert Disabled",
        description: `Price alert has been ${isActive ? 'enabled' : 'disabled'}`,
      });

      await fetchAlerts();
    } catch (error) {
      console.error('Error toggling alert:', error);
      toast({
        title: "Error",
        description: "Failed to update alert",
        variant: "destructive",
      });
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Alert Deleted",
        description: "Price alert has been removed",
      });

      await fetchAlerts();
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: "Error",
        description: "Failed to delete alert",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAlerts();

    const channel = supabase
      .channel('price-alerts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'price_alerts',
        },
        () => {
          fetchAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    alerts,
    loading,
    createAlert,
    toggleAlert,
    deleteAlert,
    refreshAlerts: fetchAlerts,
  };
};
