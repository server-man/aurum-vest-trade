import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, CandlestickData, CandlestickSeries } from 'lightweight-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TradingViewChartProps {
  symbol: string;
  data?: CandlestickData[];
  height?: number;
  interval?: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
}

export const TradingViewChart = ({ symbol, data = [], height = 400, interval = '1h' }: TradingViewChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<CandlestickData[]>(data);
  const { toast } = useToast();

  const fetchRealData = async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('crypto-candles', {
        body: { symbol, interval, limit: 200 }
      });

      if (error) throw error;

      if (result?.success && result?.data) {
        setChartData(result.data);
        toast({
          title: "Chart Updated",
          description: `Live data loaded for ${symbol}`,
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
      fetchRealData();
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
  }, [symbol, height, interval]);

  useEffect(() => {
    if (seriesRef.current && chartData.length > 0) {
      seriesRef.current.setData(chartData);
    }
  }, [chartData]);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{symbol} Chart ({interval})</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRealData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartContainerRef} className="w-full" />
      </CardContent>
    </Card>
  );
};
