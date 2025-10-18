import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ExchangeRateWidgetProps {
  baseCurrency?: string;
  targetCurrencies?: string[];
}

const ExchangeRateWidget = ({ 
  baseCurrency = 'USD', 
  targetCurrencies = ['EUR', 'GBP', 'JPY', 'BTC', 'ETH'] 
}: ExchangeRateWidgetProps) => {
  const { rates, loading, lastUpdate, refreshRates } = useExchangeRates(baseCurrency, targetCurrencies);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Exchange Rates
            <Badge variant="secondary">{baseCurrency}</Badge>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshRates}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        {lastUpdate > 0 && (
          <p className="text-xs text-muted-foreground">
            Updated {formatDistanceToNow(new Date(lastUpdate * 1000), { addSuffix: true })}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {loading && rates.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Loading exchange rates...
          </div>
        ) : (
          <div className="space-y-2">
            {rates.map((rate) => (
              <div
                key={rate.currency}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="font-semibold text-lg">
                    {rate.symbol}
                  </div>
                  <div>
                    <div className="font-medium">{rate.currency}</div>
                    <div className="text-xs text-muted-foreground">
                      1 {baseCurrency} = {rate.rate.toFixed(rate.currency.includes('BTC') || rate.currency.includes('ETH') ? 8 : 4)} {rate.currency}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {rate.rate.toFixed(rate.currency.includes('BTC') || rate.currency.includes('ETH') ? 8 : 4)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExchangeRateWidget;
