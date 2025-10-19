import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePriceAlerts } from '@/hooks/usePriceAlerts';
import { Bell, Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';

export const PriceAlerts = () => {
  const { alerts, loading, createAlert, toggleAlert, deleteAlert } = usePriceAlerts();
  const [symbol, setSymbol] = useState('');
  const [assetType, setAssetType] = useState<'crypto' | 'stock'>('crypto');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  const handleCreate = async () => {
    if (!symbol || !targetPrice) return;
    await createAlert(symbol.toUpperCase(), assetType, parseFloat(targetPrice), condition);
    setSymbol('');
    setTargetPrice('');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Price Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 fill-primary text-primary" />
          Price Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create Alert Form */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Symbol"
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
          </div>
          <div className="flex gap-2">
            <Select value={condition} onValueChange={(v: 'above' | 'below') => setCondition(v)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above</SelectItem>
                <SelectItem value="below">Below</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Target price"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleCreate} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Create
            </Button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-2">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>No price alerts set</p>
              <p className="text-sm">Create alerts to get notified</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-full ${alert.condition === 'above' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {alert.condition === 'above' ? (
                      <ArrowUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{alert.symbol}</span>
                      <Badge variant={alert.asset_type === 'crypto' ? 'default' : 'secondary'}>
                        {alert.asset_type}
                      </Badge>
                      {alert.triggered_at && (
                        <Badge variant="outline" className="text-xs">
                          Triggered
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {alert.condition === 'above' ? 'Above' : 'Below'} ${alert.target_price}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={alert.is_active}
                    onCheckedChange={(checked) => toggleAlert(alert.id, checked)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAlert(alert.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
