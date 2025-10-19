import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Newspaper, ExternalLink, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export const NewsFeed = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'crypto' | 'stock'>('crypto');

  const fetchNews = async (type: 'crypto' | 'stock') => {
    setLoading(true);
    try {
      // Using a free news aggregator - CryptoPanic for crypto, or mock data
      // In production, integrate with real news APIs like NewsAPI, CryptoPanic, or Alpha Vantage News
      
      if (type === 'crypto') {
        // Mock crypto news data
        const mockCryptoNews: NewsItem[] = [
          {
            title: "Bitcoin Reaches New All-Time High",
            description: "BTC surpasses previous records amid institutional adoption",
            url: "https://example.com",
            source: "CryptoNews",
            publishedAt: new Date().toISOString(),
            sentiment: "positive"
          },
          {
            title: "Ethereum Upgrade Shows Promising Results",
            description: "Network efficiency improves following latest protocol update",
            url: "https://example.com",
            source: "CoinDesk",
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            sentiment: "positive"
          },
          {
            title: "Regulatory Developments in Crypto Market",
            description: "New guidelines announced for digital asset trading",
            url: "https://example.com",
            source: "Bloomberg",
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            sentiment: "neutral"
          }
        ];
        setNews(mockCryptoNews);
      } else {
        // Mock stock news data
        const mockStockNews: NewsItem[] = [
          {
            title: "Tech Stocks Rally on Strong Earnings",
            description: "Major tech companies report better-than-expected quarterly results",
            url: "https://example.com",
            source: "CNBC",
            publishedAt: new Date().toISOString(),
            sentiment: "positive"
          },
          {
            title: "Market Volatility Expected This Week",
            description: "Analysts predict increased trading activity ahead of Fed announcement",
            url: "https://example.com",
            source: "Reuters",
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            sentiment: "neutral"
          },
          {
            title: "Energy Sector Shows Growth Momentum",
            description: "Oil prices stabilize as demand forecasts improve",
            url: "https://example.com",
            source: "MarketWatch",
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            sentiment: "positive"
          }
        ];
        setNews(mockStockNews);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(activeTab);
  }, [activeTab]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500/20 text-green-500';
      case 'negative': return 'bg-red-500/20 text-red-500';
      default: return 'bg-blue-500/20 text-blue-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Market News
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchNews(activeTab)}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'crypto' | 'stock')}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="stock">Stocks</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-3 mt-4">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </>
            ) : news.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Newspaper className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No news available</p>
              </div>
            ) : (
              news.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">{item.source}</span>
                        <span>•</span>
                        <span>{formatTime(item.publishedAt)}</span>
                        {item.sentiment && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className={`text-xs ${getSentimentColor(item.sentiment)}`}>
                              {item.sentiment}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
