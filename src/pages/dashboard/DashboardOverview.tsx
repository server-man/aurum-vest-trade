import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  TrendingUp, 
  Activity, 
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';

const DashboardOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBalance: 0,
    activeBots: 0,
    totalPnL: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch wallet balance
      const { data: walletData } = await supabase
        .from('user_wallets')
        .select('balance')
        .eq('user_id', user?.id)
        .maybeSingle();

      // Fetch active bots count
      const { data: botsData } = await supabase
        .from('trading_bots')
        .select('id, profit_loss')
        .eq('user_id', user?.id)
        .eq('status', 'active');

      const totalPnL = botsData?.reduce((sum, bot) => sum + (bot.profit_loss || 0), 0) || 0;

      setStats({
        totalBalance: walletData?.balance || 0,
        activeBots: botsData?.length || 0,
        totalPnL
      });
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Error loading dashboard data');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your trading performance overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Available in wallet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBots}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${stats.totalPnL.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              All time profit/loss
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Welcome to Aurum Vest! Start by setting up your wallet and creating your first trading bot.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 p-4 border border-border rounded-lg">
            <Activity className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <h4 className="font-medium">Complete your profile</h4>
              <p className="text-sm text-muted-foreground">Add your personal information and preferences</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.href = '/dashboard/profile'}
            >
              Complete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;