import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWatchlist } from '@/hooks/useWatchlist';
import { Star, Trash2, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export const Watchlist = () => {
  const { watchlist, loading, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [symbol, setSymbol] = useState('');
  const [assetType, setAssetType] = useState<'crypto' | 'stock'>('crypto');
  const [assetName, setAssetName] = useState('');

  const handleAdd = async () => {
    if (!symbol) return;
    await addToWatchlist(symbol.toUpperCase(), assetType, assetName || undefined);
    setSymbol('');
    setAssetName('');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Watchlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
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
          <Star className="h-5 w-5 fill-primary text-primary" />
          Watchlist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add to Watchlist Form */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              placeholder="Symbol (e.g., BTC, AAPL)"
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
            <Input
              placeholder="Name (optional)"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* Watchlist Items */}
        <div className="space-y-2">
          {watchlist.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>Your watchlist is empty</p>
              <p className="text-sm">Add assets to track them here</p>
            </div>
          ) : (
            watchlist.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.symbol}</span>
                      <Badge variant={item.asset_type === 'crypto' ? 'default' : 'secondary'}>
                        {item.asset_type}
                      </Badge>
                    </div>
                    {item.asset_name && (
                      <span className="text-sm text-muted-foreground">{item.asset_name}</span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromWatchlist(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
