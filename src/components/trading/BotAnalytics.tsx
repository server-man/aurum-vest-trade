import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  Target,
  AlertTriangle,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';
import { BotPerformanceChart } from './BotPerformanceChart';

interface BotAnalyticsProps {
  bot: {
    id: string;
    name: string;
    profit_loss: number;
    profit_loss_percentage: number;
    current_balance: number;
    initial_balance: number;
    trading_pair: string;
  };
}

export function BotAnalytics({ bot }: BotAnalyticsProps) {
  // Mock data - in real app, this would come from database/API
  const analytics = {
    totalTrades: 156,
    winningTrades: 94,
    losingTrades: 62,
    winRate: 60.26,
    averageWin: 145.32,
    averageLoss: -87.45,
    largestWin: 523.18,
    largestLoss: -234.67,
    sharpeRatio: 1.45,
    maxDrawdown: -12.5,
    profitFactor: 1.66,
    averageHoldingTime: '4.2 hours',
    bestDay: 892.45,
    worstDay: -456.23,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const isProfit = bot.profit_loss >= 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-scale transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-bold ${isProfit ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(bot.profit_loss)}
              </span>
              <Badge variant={isProfit ? 'default' : 'destructive'} className="gap-1">
                {isProfit ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {bot.profit_loss_percentage.toFixed(2)}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              From {formatCurrency(bot.initial_balance)} invested
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">{analytics.winRate}%</span>
              <Badge variant="secondary" className="gap-1">
                <Target className="h-3 w-3" />
                Good
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {analytics.winningTrades} wins / {analytics.losingTrades} losses
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sharpe Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-success">{analytics.sharpeRatio}</span>
              <Badge variant="secondary" className="gap-1">
                <Activity className="h-3 w-3" />
                Strong
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Risk-adjusted returns
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Max Drawdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-warning">{analytics.maxDrawdown}%</span>
              <Badge variant="secondary" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Moderate
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Largest peak-to-trough decline
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trades">Trade Stats</TabsTrigger>
          <TabsTrigger value="risk">Risk Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Performance Over Time
              </CardTitle>
              <CardDescription>
                Bot's equity curve and performance history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BotPerformanceChart botName={bot.name} height={300} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Daily Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Best Day</span>
                  <span className="font-bold text-success">{formatCurrency(analytics.bestDay)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Worst Day</span>
                  <span className="font-bold text-destructive">{formatCurrency(analytics.worstDay)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. Holding Time</span>
                  <span className="font-bold">{analytics.averageHoldingTime}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Trade Efficiency</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Profit Factor</span>
                  <span className="font-bold text-success">{analytics.profitFactor}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Trades</span>
                  <span className="font-bold">{analytics.totalTrades}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Balance</span>
                  <span className="font-bold">{formatCurrency(bot.current_balance)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trades" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Winning Trades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Wins</span>
                  <span className="font-bold text-success">{analytics.winningTrades}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average Win</span>
                  <span className="font-bold text-success">{formatCurrency(analytics.averageWin)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Largest Win</span>
                  <span className="font-bold text-success">{formatCurrency(analytics.largestWin)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Win Rate</span>
                  <span className="font-bold text-success">{analytics.winRate}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  Losing Trades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Losses</span>
                  <span className="font-bold text-destructive">{analytics.losingTrades}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average Loss</span>
                  <span className="font-bold text-destructive">{formatCurrency(analytics.averageLoss)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Largest Loss</span>
                  <span className="font-bold text-destructive">{formatCurrency(analytics.largestLoss)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Loss Rate</span>
                  <span className="font-bold text-destructive">{(100 - analytics.winRate).toFixed(2)}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trade Distribution</CardTitle>
              <CardDescription>Win/Loss ratio and trade outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Winning Trades</span>
                    <span className="font-bold">{analytics.winRate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-success h-full transition-all duration-500"
                      style={{ width: `${analytics.winRate}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Losing Trades</span>
                    <span className="font-bold">{(100 - analytics.winRate).toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-destructive h-full transition-all duration-500"
                      style={{ width: `${100 - analytics.winRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Risk Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                  <span className="font-bold text-success">{analytics.sharpeRatio}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Max Drawdown</span>
                  <span className="font-bold text-warning">{analytics.maxDrawdown}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Profit Factor</span>
                  <span className="font-bold text-success">{analytics.profitFactor}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Position Sizing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Initial Capital</span>
                  <span className="font-bold">{formatCurrency(bot.initial_balance)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Capital</span>
                  <span className="font-bold">{formatCurrency(bot.current_balance)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Capital Growth</span>
                  <span className={`font-bold ${isProfit ? 'text-success' : 'text-destructive'}`}>
                    {bot.profit_loss_percentage.toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Risk Analysis</CardTitle>
              <CardDescription>Understanding your bot's risk profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Risk-Adjusted Return (Sharpe)</span>
                  <Badge variant="secondary">{analytics.sharpeRatio > 1 ? 'Excellent' : 'Good'}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  A Sharpe ratio above 1.0 indicates good risk-adjusted returns. Your bot is performing {analytics.sharpeRatio > 1 ? 'excellently' : 'well'}.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Maximum Drawdown</span>
                  <Badge variant="secondary">{Math.abs(analytics.maxDrawdown) < 15 ? 'Low' : 'Moderate'}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your bot experienced a maximum drawdown of {analytics.maxDrawdown}%, which is {Math.abs(analytics.maxDrawdown) < 15 ? 'relatively low and acceptable' : 'moderate'}.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Profit Factor</span>
                  <Badge variant="secondary">{analytics.profitFactor > 1.5 ? 'Strong' : 'Average'}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  For every dollar lost, your bot makes ${analytics.profitFactor.toFixed(2)}. A ratio above 1.5 is considered strong.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
