import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  Eye,
  Activity
} from 'lucide-react';
import { BotPerformanceChart } from './BotPerformanceChart';
import { formatCurrency, formatDate } from '@/lib/formatters';

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

interface BotCardProps {
  bot: TradingBot;
  onToggle: (botId: string, currentStatus: boolean) => void;
  onViewDetails?: (bot: TradingBot) => void;
  onConfigure?: (bot: TradingBot) => void;
}

const BotCardComponent = ({ bot, onToggle, onViewDetails, onConfigure }: BotCardProps) => {
  const isProfit = bot.profit_loss >= 0;

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'bg-success/10 text-success border-success/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 animate-fade-in hover-scale overflow-hidden">
      {/* Status Bar */}
      <div className={`h-1 ${bot.is_activated ? 'bg-success' : 'bg-muted'} transition-colors`} />
      
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`relative p-3 rounded-xl transition-all ${
              bot.is_activated 
                ? 'bg-success/10 text-success' 
                : 'bg-muted text-muted-foreground'
            }`}>
              <Bot className="h-6 w-6" />
              {bot.is_activated && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">{bot.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">
                  {bot.trading_pair}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  {bot.exchange}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant={bot.is_activated ? 'default' : 'secondary'}
              className="capitalize gap-1"
            >
              <Activity className="h-3 w-3" />
              {bot.status}
            </Badge>
            <Badge className={getRiskLevelColor(bot.risk_level)}>
              {bot.risk_level} Risk
            </Badge>
          </div>
        </div>

        {/* Description */}
        {bot.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {bot.description}
          </p>
        )}

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Current Balance</p>
            <p className="text-xl font-bold">{formatCurrency(bot.current_balance)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Profit/Loss</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-xl font-bold ${isProfit ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(bot.profit_loss)}
              </p>
              <span className={`text-sm font-medium ${isProfit ? 'text-success' : 'text-destructive'}`}>
                ({isProfit ? '+' : ''}{bot.profit_loss_percentage.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <BotPerformanceChart botName={bot.name} height={200} />

        {/* Trading Parameters */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Take Profit</p>
            <p className="text-sm font-bold text-success">
              {bot.take_profit_percentage}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Stop Loss</p>
            <p className="text-sm font-bold text-destructive">
              {bot.stop_loss_percentage}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Max Deals</p>
            <p className="text-sm font-bold">{bot.max_active_deals}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            Created {formatDate(bot.created_at)}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails?.(bot)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onConfigure?.(bot)}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Config
            </Button>
            <Button 
              variant={bot.is_activated ? 'destructive' : 'default'} 
              size="sm"
              onClick={() => onToggle(bot.id, bot.is_activated)}
              className="gap-2 min-w-[100px]"
            >
              {bot.is_activated ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Memoize to prevent unnecessary re-renders
export const BotCard = memo(BotCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.bot.id === nextProps.bot.id &&
    prevProps.bot.is_activated === nextProps.bot.is_activated &&
    prevProps.bot.current_balance === nextProps.bot.current_balance &&
    prevProps.bot.profit_loss === nextProps.bot.profit_loss &&
    prevProps.bot.status === nextProps.bot.status
  );
});
