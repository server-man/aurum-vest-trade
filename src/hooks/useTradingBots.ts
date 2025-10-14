import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useOptimizedQuery } from './useOptimizedQuery';

interface TradingBot {
  id: string;
  name: string;
  description: string;
  status: string;
  is_activated: boolean;
  trading_pair: string;
  base_currency: string;
  quote_currency: string;
  exchange: string;
  initial_balance: number;
  current_balance: number;
  profit_loss: number;
  profit_loss_percentage: number;
  max_active_deals: number;
  take_profit_percentage: number;
  stop_loss_percentage: number;
  risk_level: string;
  created_at: string;
}

export const useTradingBots = (userId: string) => {
  const [optimisticBots, setOptimisticBots] = useState<TradingBot[]>([]);

  // Use optimized query with caching and automatic refetching
  const { data: bots = [], isLoading, refetch } = useOptimizedQuery(
    ['trading_bots', userId],
    async () => {
      const { data, error } = await supabase
        .from('trading_bots')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as TradingBot[];
    },
    {
      enabled: !!userId,
      staleTime: 30000, // 30 seconds
    }
  );

  const toggleBotStatus = useCallback(async (botId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    // Optimistic update
    setOptimisticBots(prev => 
      prev.map(bot => 
        bot.id === botId 
          ? { ...bot, is_activated: newStatus, status: newStatus ? 'active' : 'inactive' }
          : bot
      )
    );

    try {
      const { error } = await supabase
        .from('trading_bots')
        .update({ 
          is_activated: newStatus,
          status: newStatus ? 'active' : 'inactive'
        })
        .eq('id', botId)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success(`Bot ${newStatus ? 'activated' : 'deactivated'} successfully`);
      refetch();
    } catch (error: any) {
      console.error('Error updating bot status:', error);
      toast.error('Failed to update bot status');
      // Revert optimistic update
      refetch();
    }
  }, [userId, refetch]);

  const createBot = useCallback(async (config: any) => {
    try {
      const { data, error } = await supabase
        .from('trading_bots')
        .insert({
          user_id: userId,
          ...config,
          current_balance: config.initial_balance,
          strategy_id: '00000000-0000-0000-0000-000000000000',
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Trading bot created successfully!');
      refetch();
      return data;
    } catch (error: any) {
      console.error('Error creating bot:', error);
      toast.error('Failed to create trading bot');
      throw error;
    }
  }, [userId, refetch]);

  const updateBot = useCallback(async (botId: string, updates: Partial<TradingBot>) => {
    try {
      const { error } = await supabase
        .from('trading_bots')
        .update(updates)
        .eq('id', botId)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Bot updated successfully!');
      refetch();
    } catch (error: any) {
      console.error('Error updating bot:', error);
      toast.error('Failed to update bot');
      throw error;
    }
  }, [userId, refetch]);

  const deleteBot = useCallback(async (botId: string) => {
    try {
      const { error } = await supabase
        .from('trading_bots')
        .delete()
        .eq('id', botId)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Bot deleted successfully!');
      refetch();
    } catch (error: any) {
      console.error('Error deleting bot:', error);
      toast.error('Failed to delete bot');
      throw error;
    }
  }, [userId, refetch]);

  return {
    bots: optimisticBots.length > 0 ? optimisticBots : bots,
    isLoading,
    toggleBotStatus,
    createBot,
    updateBot,
    deleteBot,
    refetch,
  };
};