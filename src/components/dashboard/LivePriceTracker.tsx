import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMarketData } from '@/hooks/useMarketData';
import { formatPrice, formatVolume, formatSymbol } from '@/lib/formatters';
import { 
  TrendingUp, 
  TrendingDown, 
  Wifi, 
  WifiOff,
  RefreshCw 
} from 'lucide-react';

interface LivePriceTrackerProps {
  symbols?: string[];
}

const LivePriceTracker = ({ symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'] }: LivePriceTrackerProps) => {
  const { getAllPrices, loading, isConnected, refreshPrices } = useMarketData(symbols);
  
  // Memoize prices to prevent unnecessary re-renders
  const prices = useMemo(() => getAllPrices(), [getAllPrices]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Live Market Prices
            {isConnected ? (
              <Badge variant="default" className="flex items-center gap-1">
                <Wifi className="h-3 w-3" />
                Live
              </Badge>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1">
                <WifiOff className="h-3 w-3" />
                Offline
              </Badge>
            )}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshPrices}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {prices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading market data...
          </div>
        ) : (
          <div className="space-y-3">
            {prices.map((price) => {
              const isPositive = price.change24h >= 0;
              return (
                <div
                  key={price.symbol}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 
                      'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {isPositive ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{formatSymbol(price.symbol)}</div>
                      <div className="text-sm text-muted-foreground">
                        Vol: {formatVolume(price.volume24h)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold">{formatPrice(price.price)}</div>
                    <div className={`text-sm font-medium ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isPositive ? '+' : ''}{price.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LivePriceTracker;
