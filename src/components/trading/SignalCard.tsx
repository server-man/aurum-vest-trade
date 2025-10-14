import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Shield,
  Clock,
  Activity,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface Signal {
  id: string;
  symbol: string;
  signal_type: string;
  price: number;
  target_price?: number;
  stop_loss?: number;
  confidence_level?: number;
  description?: string;
  expires_at?: string;
  created_at: string;
  source?: string;
}

interface SignalCardProps {
  signal: Signal;
  isExpired: boolean;
  onTrade?: (signal: Signal) => void;
}

export const SignalCard = ({ signal, isExpired, onTrade }: SignalCardProps) => {
  const isBuy = signal.signal_type.toLowerCase() === 'buy';
  const potentialProfit = signal.target_price && signal.price 
    ? ((signal.target_price - signal.price) / signal.price * 100).toFixed(2)
    : null;
  const potentialLoss = signal.stop_loss && signal.price
    ? ((signal.price - signal.stop_loss) / signal.price * 100).toFixed(2)
    : null;

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 animate-fade-in ${
      isExpired ? 'opacity-60' : 'hover-scale'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isBuy ? 'bg-success/10' : 'bg-destructive/10'
            }`}>
              {isBuy ? (
                <TrendingUp className="h-5 w-5 text-success" />
              ) : (
                <TrendingDown className="h-5 w-5 text-destructive" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{signal.symbol}</h3>
                <Badge className={`${
                  isBuy 
                    ? 'bg-success/10 text-success border-success/20' 
                    : 'bg-destructive/10 text-destructive border-destructive/20'
                }`}>
                  {signal.signal_type.toUpperCase()}
                </Badge>
              </div>
              {signal.source && (
                <p className="text-xs text-muted-foreground mt-1">
                  Source: {signal.source}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {signal.confidence_level && (
              <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium">{signal.confidence_level}%</span>
              </div>
            )}
            {isExpired && (
              <Badge variant="destructive" className="animate-pulse">
                <Clock className="h-3 w-3 mr-1" />
                Expired
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3" />
              Entry Price
            </div>
            <p className="text-lg font-bold">${signal.price.toFixed(4)}</p>
          </div>
          
          {signal.target_price && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Target className="h-3 w-3" />
                Target
              </div>
              <p className="text-lg font-bold text-success">
                ${signal.target_price.toFixed(4)}
              </p>
              {potentialProfit && (
                <p className="text-xs text-success">+{potentialProfit}%</p>
              )}
            </div>
          )}
          
          {signal.stop_loss && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                Stop Loss
              </div>
              <p className="text-lg font-bold text-destructive">
                ${signal.stop_loss.toFixed(4)}
              </p>
              {potentialLoss && (
                <p className="text-xs text-destructive">-{potentialLoss}%</p>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        {signal.description && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {signal.description}
            </p>
          </div>
        )}

        {/* Risk/Reward Ratio */}
        {potentialProfit && potentialLoss && (
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <span className="text-sm font-medium">Risk/Reward Ratio</span>
            <span className="text-sm font-bold">
              1:{(parseFloat(potentialProfit) / parseFloat(potentialLoss)).toFixed(2)}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Created: {new Date(signal.created_at).toLocaleString()}</p>
            {signal.expires_at && (
              <p>Expires: {new Date(signal.expires_at).toLocaleString()}</p>
            )}
          </div>
          
          {!isExpired && onTrade && (
            <Button 
              onClick={() => onTrade(signal)}
              className="gap-2 group-hover:gap-3 transition-all"
            >
              Execute Trade
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
