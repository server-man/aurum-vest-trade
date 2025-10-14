import { useEffect, useRef } from 'react';
import { createChart, IChartApi, CandlestickData, CandlestickSeries } from 'lightweight-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TradingViewChartProps {
  symbol: string;
  data?: CandlestickData[];
  height?: number;
}

export const TradingViewChart = ({ symbol, data = [], height = 400 }: TradingViewChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);

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

    // Generate sample data if none provided
    const sampleData: CandlestickData[] = data.length > 0 ? data : generateSampleData();
    candlestickSeries.setData(sampleData);

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
  }, [symbol, height]);

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data);
    }
  }, [data]);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg">{symbol} Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartContainerRef} className="w-full" />
      </CardContent>
    </Card>
  );
};

// Helper function to generate sample candlestick data
function generateSampleData(): CandlestickData[] {
  const data: CandlestickData[] = [];
  const basePrice = 50000;
  let currentPrice = basePrice;
  const now = Math.floor(Date.now() / 1000);
  
  for (let i = 100; i >= 0; i--) {
    const time = (now - i * 3600) as any;
    const volatility = 0.02;
    const change = (Math.random() - 0.5) * basePrice * volatility;
    
    const open = currentPrice;
    const close = open + change;
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    
    data.push({
      time,
      open,
      high,
      low,
      close,
    });
    
    currentPrice = close;
  }
  
  return data;
}
