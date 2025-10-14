import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Star,
  Zap,
  Target,
  Trophy,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemeCoin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  rank: number;
  emoji: string;
  isHot: boolean;
  volatility: 'low' | 'medium' | 'high' | 'extreme';
}

// Mock data for top 30 MEME coins with gamified elements
const generateMemeCoins = (): MemeCoin[] => {
  const memeCoins = [
    { name: 'Dogecoin', symbol: 'DOGE', emoji: '🐕', isHot: true },
    { name: 'Shiba Inu', symbol: 'SHIB', emoji: '🐶', isHot: true },
    { name: 'Pepe', symbol: 'PEPE', emoji: '🐸', isHot: true },
    { name: 'Floki Inu', symbol: 'FLOKI', emoji: '🐺', isHot: false },
    { name: 'Bonk', symbol: 'BONK', emoji: '🔨', isHot: true },
    { name: 'Baby Doge', symbol: 'BABYDOGE', emoji: '🐕‍🦺', isHot: false },
    { name: 'Wojak', symbol: 'WOJAK', emoji: '😭', isHot: false },
    { name: 'MonaCoin', symbol: 'MONA', emoji: '😸', isHot: false },
    { name: 'Memecoin', symbol: 'MEME', emoji: '😂', isHot: true },
    { name: 'Cat in a Dogs World', symbol: 'MEW', emoji: '🐱', isHot: true },
    { name: 'Book of Meme', symbol: 'BOME', emoji: '📚', isHot: false },
    { name: 'Popcat', symbol: 'POPCAT', emoji: '🐱', isHot: true },
    { name: 'Brett', symbol: 'BRETT', emoji: '👨', isHot: false },
    { name: 'Turbo', symbol: 'TURBO', emoji: '💨', isHot: true },
    { name: 'Mog Coin', symbol: 'MOG', emoji: '🧙', isHot: false },
    { name: 'Neiro', symbol: 'NEIRO', emoji: '🤖', isHot: true },
    { name: 'Goatseus Maximus', symbol: 'GOAT', emoji: '🐐', isHot: true },
    { name: 'Ponke', symbol: 'PONKE', emoji: '🐵', isHot: false },
    { name: 'Peanut the Squirrel', symbol: 'PNUT', emoji: '🐿️', isHot: true },
    { name: 'Act I : The AI Prophecy', symbol: 'ACT', emoji: '🎭', isHot: false },
    { name: 'Banana Gun', symbol: 'BANANA', emoji: '🍌', isHot: false },
    { name: 'Gigachad', symbol: 'GIGA', emoji: '💪', isHot: true },
    { name: 'Cheems', symbol: 'CHEEMS', emoji: '🐕', isHot: false },
    { name: 'Myro', symbol: 'MYRO', emoji: '🚀', isHot: false },
    { name: 'Wen', symbol: 'WEN', emoji: '❓', isHot: false },
    { name: 'Slerf', symbol: 'SLERF', emoji: '😴', isHot: false },
    { name: 'Jeo Boden', symbol: 'BODEN', emoji: '🇺🇸', isHot: false },
    { name: 'DADDY TATE', symbol: 'DADDY', emoji: '👨‍💼', isHot: false },
    { name: 'Harambe', symbol: 'HARAMBE', emoji: '🦍', isHot: false },
    { name: 'Apu Apustaja', symbol: 'APU', emoji: '🐸', isHot: false },
  ];

  return memeCoins.map((coin, index) => ({
    id: coin.symbol.toLowerCase(),
    ...coin,
    price: parseFloat((Math.random() * 0.1 + 0.001).toFixed(6)),
    change24h: parseFloat((Math.random() * 40 - 20).toFixed(2)),
    volume24h: Math.floor(Math.random() * 10000000 + 100000),
    marketCap: Math.floor(Math.random() * 1000000000 + 10000000),
    rank: index + 1,
    volatility: ['low', 'medium', 'high', 'extreme'][Math.floor(Math.random() * 4)] as any,
  }));
};

export default function MemeCoins() {
  const [memeCoins, setMemeCoins] = useState<MemeCoin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'hot' | 'gainers' | 'losers'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load
    setMemeCoins(generateMemeCoins());
    setIsLoading(false);

    // Simulate real-time updates every 3 seconds
    const interval = setInterval(() => {
      setMemeCoins(prevCoins => 
        prevCoins.map(coin => ({
          ...coin,
          price: parseFloat((coin.price + (Math.random() - 0.5) * coin.price * 0.05).toFixed(6)),
          change24h: parseFloat((coin.change24h + (Math.random() - 0.5) * 2).toFixed(2)),
          volume24h: Math.floor(coin.volume24h + (Math.random() - 0.5) * coin.volume24h * 0.1),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredCoins = memeCoins.filter(coin => {
    const matchesSearch = coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (selectedFilter) {
      case 'hot':
        return matchesSearch && coin.isHot;
      case 'gainers':
        return matchesSearch && coin.change24h > 0;
      case 'losers':
        return matchesSearch && coin.change24h < 0;
      default:
        return matchesSearch;
    }
  });

  const getVolatilityColor = (volatility: string) => {
    switch (volatility) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'extreme': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatNumber = (num: number, prefix: string = '') => {
    if (num >= 1e9) return `${prefix}${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${prefix}${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${prefix}${(num / 1e3).toFixed(2)}K`;
    return `${prefix}${num.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">MEME Coins 🪙</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            MEME Coins 🪙
            <Badge variant="secondary" className="animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              LIVE
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
            Track the hottest meme coins in real-time • Updates every 3s
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'hot', 'gainers', 'losers'] as const).map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="capitalize"
              >
                {filter === 'hot' && <Flame className="h-3 w-3 mr-1" />}
                {filter === 'gainers' && <TrendingUp className="h-3 w-3 mr-1" />}
                {filter === 'losers' && <TrendingDown className="h-3 w-3 mr-1" />}
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top Gainer</p>
                <p className="text-lg font-bold text-green-600">
                  {filteredCoins.length > 0 && 
                    `+${Math.max(...filteredCoins.map(c => c.change24h)).toFixed(2)}%`
                  }
                </p>
              </div>
              <Trophy className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500/10 to-red-600/10 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Biggest Drop</p>
                <p className="text-lg font-bold text-red-600">
                  {filteredCoins.length > 0 && 
                    `${Math.min(...filteredCoins.map(c => c.change24h)).toFixed(2)}%`
                  }
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hot Coins</p>
                <p className="text-lg font-bold text-orange-600">
                  {filteredCoins.filter(c => c.isHot).length}
                </p>
              </div>
              <Flame className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tracked</p>
                <p className="text-lg font-bold text-purple-600">{filteredCoins.length}</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoins.map((coin) => (
          <Card 
            key={coin.id} 
            className={cn(
              "relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
              coin.isHot && "ring-2 ring-orange-500/50 shadow-orange-500/20"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{coin.emoji}</span>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {coin.symbol}
                      {coin.isHot && (
                        <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                          <Flame className="h-3 w-3 mr-1" />
                          HOT
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-sm">{coin.name}</CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${coin.price.toFixed(6)}</p>
                  <div className={cn(
                    "flex items-center text-sm font-medium",
                    coin.change24h >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {coin.change24h >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Market Cap:</span>
                  <span className="font-medium">{formatNumber(coin.marketCap, '$')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume 24h:</span>
                  <span className="font-medium">{formatNumber(coin.volume24h, '$')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rank:</span>
                  <span className="font-medium">#{coin.rank}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Volatility:</span>
                  <Badge className={cn("text-xs", getVolatilityColor(coin.volatility))}>
                    {coin.volatility.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4 group hover:bg-primary hover:text-primary-foreground"
                disabled
              >
                <Star className="h-3 w-3 mr-1 group-hover:fill-current" />
                Add to Watchlist
                <Badge variant="secondary" className="ml-2 text-xs">Soon</Badge>
              </Button>
            </CardContent>
            
            {/* Animated background for hot coins */}
            {coin.isHot && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 pointer-events-none animate-pulse" />
            )}
          </Card>
        ))}
      </div>

      {filteredCoins.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No coins found matching your search criteria.</p>
        </Card>
      )}
    </div>
  );
}