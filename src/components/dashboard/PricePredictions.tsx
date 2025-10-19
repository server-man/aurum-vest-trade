import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePricePredictions } from '@/hooks/usePricePredictions';
import { TrendingUp, TrendingDown, Minus, Brain, AlertTriangle, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

export const PricePredictions = () => {
  const { predictions, loading, fetchPredictions } = usePricePredictions();
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [assetType, setAssetType] = useState<'crypto' | 'stock'>('crypto');

  const handleGenerate = () => {
    if (symbol) {
      fetchPredictions(symbol, assetType);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-500';
      case 'high': return 'bg-red-500/20 text-red-500';
      default: return 'bg-yellow-500/20 text-yellow-500';
    }
  };

  const getChangePercent = (current: number, predicted: number) => {
    const change = ((predicted - current) / current) * 100;
    return change.toFixed(2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 fill-primary text-primary" />
          AI Price Predictions
        </CardTitle>
        <CardDescription>
          Machine learning-based price forecasts powered by AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="flex gap-2">
          <Input
            placeholder="Symbol (e.g., BTCUSDT)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="flex-1"
          />
          <Select value={assetType} onValueChange={(v: 'crypto' | 'stock') => setAssetType(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="crypto">Crypto</SelectItem>
              <SelectItem value="stock">Stock</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleGenerate} disabled={loading || !symbol}>
            {loading ? (
              <>Analyzing...</>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-1" />
                Predict
              </>
            )}
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        )}

        {/* Predictions Display */}
        {!loading && predictions && (
          <div className="space-y-4">
            {/* Current Price */}
            <div className="p-4 border rounded-lg bg-accent/50">
              <div className="text-sm text-muted-foreground">Current Price</div>
              <div className="text-2xl font-bold">${predictions.currentPrice.toFixed(2)}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={getRiskColor(predictions.riskLevel)}>
                  {predictions.riskLevel} risk
                </Badge>
              </div>
            </div>

            {/* Prediction Cards */}
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(predictions.predictions).map(([timeframe, pred]) => (
                <div key={timeframe} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {timeframe === '1hour' ? '1 Hour' :
                       timeframe === '24hours' ? '24 Hours' :
                       timeframe === '7days' ? '7 Days' :
                       '30 Days'}
                    </span>
                    {getTrendIcon(pred.trend)}
                  </div>
                  <div className="text-lg font-bold">${pred.price.toFixed(2)}</div>
                  <div className={`text-sm ${pred.trend === 'up' ? 'text-green-500' : pred.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {pred.trend === 'up' ? '+' : pred.trend === 'down' ? '-' : ''}
                    {Math.abs(parseFloat(getChangePercent(predictions.currentPrice, pred.price)))}%
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Confidence</span>
                      <span>{pred.confidence}%</span>
                    </div>
                    <Progress value={pred.confidence} className="h-1" />
                  </div>
                </div>
              ))}
            </div>

            {/* Analysis */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Analysis</span>
              </div>
              <p className="text-sm text-muted-foreground">{predictions.analysis}</p>
            </div>

            {/* Key Factors */}
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-semibold mb-2">Key Factors</div>
              <div className="flex flex-wrap gap-2">
                {predictions.keyFactors.map((factor, idx) => (
                  <Badge key={idx} variant="secondary">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
              <strong>Disclaimer:</strong> These predictions are AI-generated estimates based on historical data and should not be considered financial advice. Always do your own research before making investment decisions.
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !predictions && (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>Enter a symbol and click Predict</p>
            <p className="text-sm">Get AI-powered price forecasts</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
