import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WatchlistItem {
  id: string;
  user_id: string;
  symbol: string;
  asset_type: 'crypto' | 'stock';
  asset_name?: string;
  created_at: string;
}

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchWatchlist = async () => {
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWatchlist((data as WatchlistItem[]) || []);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to load watchlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (symbol: string, assetType: 'crypto' | 'stock', assetName?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('watchlist')
        .insert({
          user_id: user.id,
          symbol,
          asset_type: assetType,
          asset_name: assetName,
        });

      if (error) throw error;

      toast({
        title: "Added to Watchlist",
        description: `${symbol} has been added to your watchlist`,
      });

      await fetchWatchlist();
    } catch (error: any) {
      console.error('Error adding to watchlist:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add to watchlist",
        variant: "destructive",
      });
    }
  };

  const removeFromWatchlist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Removed from Watchlist",
        description: "Item has been removed from your watchlist",
      });

      await fetchWatchlist();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove from watchlist",
        variant: "destructive",
      });
    }
  };

  const isInWatchlist = (symbol: string, assetType: 'crypto' | 'stock') => {
    return watchlist.some(
      (item) => item.symbol === symbol && item.asset_type === assetType
    );
  };

  useEffect(() => {
    fetchWatchlist();

    const channel = supabase
      .channel('watchlist-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'watchlist',
        },
        () => {
          fetchWatchlist();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    watchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    refreshWatchlist: fetchWatchlist,
  };
};
