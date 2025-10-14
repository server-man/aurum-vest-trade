import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface WalletAsset {
  id: string;
  asset_name: string;
  asset_symbol: string;
  balance: number;
  locked_balance: number;
  average_cost: number;
  total_invested: number;
}

interface WalletOverviewProps {
  userId: string;
}

const WalletOverview = ({ userId }: WalletOverviewProps) => {
  const [assets, setAssets] = useState<WalletAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBalances, setShowBalances] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchWalletAssets();
    }
  }, [userId]);

  const fetchWalletAssets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wallet_assets')
        .select('*')
        .eq('user_id', userId)
        .order('balance', { ascending: false });

      if (error) throw error;

      setAssets(data || []);
      
      // Calculate total balance (simplified - would need real-time prices)
      const total = (data || []).reduce((sum, asset) => sum + (asset.balance * (asset.average_cost || 0)), 0);
      setTotalBalance(total);
    } catch (error: any) {
      console.error('Error fetching wallet assets:', error);
      toast.error('Failed to load wallet assets');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount);
  };

  const formatAssetAmount = (amount: number, symbol: string) => {
    return `${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    })} ${symbol}`;
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
      {/* Wallet Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalances(!showBalances)}
              >
                {showBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchWalletAssets}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {showBalances ? formatCurrency(totalBalance) : '••••••'}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {assets.length} assets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {showBalances ? formatCurrency(
                assets.reduce((sum, asset) => sum + (asset.balance * (asset.average_cost || 0)), 0)
              ) : '••••••'}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for trading
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locked Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {showBalances ? formatCurrency(
                assets.reduce((sum, asset) => sum + (asset.locked_balance * (asset.average_cost || 0)), 0)
              ) : '••••••'}
            </div>
            <p className="text-xs text-muted-foreground">
              In active trades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assets List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Assets</CardTitle>
              <CardDescription>
                Manage your cryptocurrency portfolio
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {assets.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No assets yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first cryptocurrency to begin trading
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Asset
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {assets.map((asset) => {
                const currentValue = asset.balance * (asset.average_cost || 0);
                const pnl = currentValue - (asset.total_invested || 0);
                const pnlPercentage = asset.total_invested ? (pnl / asset.total_invested) * 100 : 0;
                const isProfit = pnl >= 0;

                return (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary">
                          {asset.asset_symbol.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{asset.asset_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatAssetAmount(asset.balance, asset.asset_symbol)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="font-medium">
                        {showBalances ? formatCurrency(currentValue) : '••••••'}
                      </div>
                      {asset.total_invested > 0 && (
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={isProfit ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {isProfit ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {isProfit ? '+' : ''}{pnlPercentage.toFixed(2)}%
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletOverview;