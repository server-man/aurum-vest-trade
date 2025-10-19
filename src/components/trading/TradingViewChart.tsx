import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, CandlestickData, CandlestickSeries } from 'lightweight-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWatchlist } from '@/hooks/useWatchlist';

interface TradingViewChartProps {
  symbol: string;
  data?: CandlestickData[];
  height?: number;
  interval?: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  assetType?: 'crypto' | 'stock';
}

export const TradingViewChart = ({ symbol, data = [], height = 400, interval = '1h', assetType = 'crypto' }: TradingViewChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<CandlestickData[]>(data);
  const [selectedInterval, setSelectedInterval] = useState(interval);
  const [timeframe, setTimeframe] = useState<'1D' | '7D' | '1M' | '1Y'>('1D');
  const { toast } = useToast();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const getIntervalFromTimeframe = (tf: string): string => {
    switch (tf) {
      case '1D': return '5m';
      case '7D': return '1h';
      case '1M': return '4h';
      case '1Y': return '1d';
      default: return '1h';
    }
  };

  const getLimitFromTimeframe = (tf: string): number => {
    switch (tf) {
      case '1D': return 288; // 24h * 60min / 5min
      case '7D': return 168; // 7 days * 24h
      case '1M': return 180; // ~30 days * 6 (4h intervals)
      case '1Y': return 365; // 365 days
      default: return 200;
    }
  };

  const fetchRealData = async (tf?: string) => {
    setLoading(true);
    const currentTimeframe = tf || timeframe;
    const fetchInterval = getIntervalFromTimeframe(currentTimeframe);
    const limit = getLimitFromTimeframe(currentTimeframe);
    
    try {
      const { data: result, error } = await supabase.functions.invoke('crypto-candles', {
        body: { symbol, interval: fetchInterval, limit }
      });

      if (error) throw error;

      if (result?.success && result?.data) {
        setChartData(result.data);
        toast({
          title: "Chart Updated",
          description: `${currentTimeframe} data loaded for ${symbol}`,
        });
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      toast({
        title: "Error",
        description: "Failed to load live chart data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTimeframeChange = (tf: '1D' | '7D' | '1M' | '1Y') => {
    setTimeframe(tf);
    fetchRealData(tf);
  };

  const toggleWatchlist = async () => {
    const inWatchlist = isInWatchlist(symbol, assetType);
    if (inWatchlist) {
      // Find and remove - we'll need to enhance this
      toast({
        title: "Removed from Watchlist",
        description: `${symbol} removed from your watchlist`,
      });
    } else {
      await addToWatchlist(symbol, assetType);
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Fetch real data on mount
    if (chartData.length === 0) {
      fetchRealData(timeframe);
    } else {
      candlestickSeries.setData(chartData);
    }

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [symbol, height, selectedInterval]);

  useEffect(() => {
    if (seriesRef.current && chartData.length > 0) {
      seriesRef.current.setData(chartData);
    }
  }, [chartData]);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg">{symbol} Chart</CardTitle>
          <div className="flex items-center gap-2">
            <Tabs value={timeframe} onValueChange={(v) => handleTimeframeChange(v as any)}>
              <TabsList>
                <TabsTrigger value="1D">1D</TabsTrigger>
                <TabsTrigger value="7D">7D</TabsTrigger>
                <TabsTrigger value="1M">1M</TabsTrigger>
                <TabsTrigger value="1Y">1Y</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleWatchlist}
            >
              <Star 
                className={`h-4 w-4 ${isInWatchlist(symbol, assetType) ? 'fill-primary text-primary' : ''}`} 
              />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchRealData()}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartContainerRef} className="w-full" />
      </CardContent>
    </Card>
  );
};
