import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Bot, 
  Plus,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { BotCard } from '@/components/trading/BotCard';
import { BotConfigDialog, BotConfiguration } from '@/components/trading/BotConfigDialog';
import { BotAnalytics } from '@/components/trading/BotAnalytics';

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

interface TradingBotsProps {
  userId: string;
}

const TradingBots = ({ userId }: TradingBotsProps) => {
  const [bots, setBots] = useState<TradingBot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [selectedBot, setSelectedBot] = useState<TradingBot | null>(null);
  const [configMode, setConfigMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    if (userId) {
      fetchTradingBots();
    }
  }, [userId]);

  const fetchTradingBots = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trading_bots')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBots(data || []);
    } catch (error: any) {
      console.error('Error fetching trading bots:', error);
      toast.error('Failed to load trading bots');
    } finally {
      setLoading(false);
    }
  };

  const toggleBotStatus = async (botId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('trading_bots')
        .update({ 
          is_activated: !currentStatus,
          status: !currentStatus ? 'active' : 'inactive'
        })
        .eq('id', botId)
        .eq('user_id', userId);

      if (error) throw error;

      setBots(prev => prev.map(bot => 
        bot.id === botId 
          ? { 
              ...bot, 
              is_activated: !currentStatus,
              status: !currentStatus ? 'active' : 'inactive'
            }
          : bot
      ));

      toast.success(`Bot ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      console.error('Error updating bot status:', error);
      toast.error('Failed to update bot status');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleCreateBot = async (config: BotConfiguration) => {
    try {
      const { data, error } = await supabase
        .from('trading_bots')
        .insert({
          user_id: userId,
          name: config.name,
          description: config.description,
          trading_pair: config.trading_pair,
          base_currency: config.base_currency,
          quote_currency: config.quote_currency,
          exchange: config.exchange,
          initial_balance: config.initial_balance,
          current_balance: config.initial_balance,
          take_profit_percentage: config.take_profit_percentage,
          stop_loss_percentage: config.stop_loss_percentage,
          max_active_deals: config.max_active_deals,
          risk_level: config.risk_level,
          strategy_id: '00000000-0000-0000-0000-000000000000', // Placeholder
        })
        .select()
        .single();

      if (error) throw error;

      setBots(prev => [data, ...prev]);
      toast.success('Trading bot created successfully!');
      setShowConfigDialog(false);
    } catch (error: any) {
      console.error('Error creating bot:', error);
      toast.error('Failed to create trading bot');
    }
  };

  const handleViewAnalytics = (bot: TradingBot) => {
    setSelectedBot(bot);
    setShowAnalyticsDialog(true);
  };

  const handleConfigureBot = (bot: TradingBot) => {
    setSelectedBot(bot);
    setConfigMode('edit');
    setShowConfigDialog(true);
  };

  const handleOpenCreateDialog = () => {
    setSelectedBot(null);
    setConfigMode('create');
    setShowConfigDialog(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bots List */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">AI Trading Bots</CardTitle>
              <CardDescription>
                Manage and monitor your automated trading strategies
              </CardDescription>
            </div>
            <Button className="gap-2 hover-scale" onClick={handleOpenCreateDialog}>
              <Plus className="h-4 w-4" />
              Create New Bot
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {bots.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="relative inline-block mb-6">
                <Bot className="h-20 w-20 text-muted-foreground animate-pulse" />
                <Zap className="h-8 w-8 text-primary absolute -top-2 -right-2 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No Trading Bots Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first AI-powered trading bot to start generating passive income with automated strategies
              </p>
              <Button size="lg" className="gap-2" onClick={handleOpenCreateDialog}>
                <Plus className="h-5 w-5" />
                Create Your First Bot
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {bots.map((bot, index) => (
                <div key={bot.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <BotCard 
                    bot={bot} 
                    onToggle={toggleBotStatus}
                    onViewDetails={handleViewAnalytics}
                    onConfigure={handleConfigureBot}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bot Configuration Dialog */}
      <BotConfigDialog
        open={showConfigDialog}
        onOpenChange={setShowConfigDialog}
        onSubmit={handleCreateBot}
        mode={configMode}
        initialConfig={selectedBot ? {
          name: selectedBot.name,
          description: selectedBot.description,
          trading_pair: selectedBot.trading_pair,
          base_currency: selectedBot.base_currency,
          quote_currency: selectedBot.quote_currency,
          exchange: selectedBot.exchange,
          initial_balance: selectedBot.initial_balance,
          take_profit_percentage: selectedBot.take_profit_percentage,
          stop_loss_percentage: selectedBot.stop_loss_percentage,
          max_active_deals: selectedBot.max_active_deals,
          risk_level: selectedBot.risk_level as 'low' | 'medium' | 'high',
        } : undefined}
      />

      {/* Bot Analytics Dialog */}
      <Dialog open={showAnalyticsDialog} onOpenChange={setShowAnalyticsDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              {selectedBot?.name} - Performance Analytics
            </DialogTitle>
          </DialogHeader>
          {selectedBot && <BotAnalytics bot={selectedBot} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TradingBots;