import { useEffect, useRef } from 'react';
import { createChart, IChartApi, LineData, LineSeries } from 'lightweight-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BotPerformanceChartProps {
  botName: string;
  performanceData?: LineData[];
  height?: number;
}

export const BotPerformanceChart = ({ 
  botName, 
  performanceData = [], 
  height = 300 
}: BotPerformanceChartProps) => {
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

    const lineSeries = chart.addSeries(LineSeries, {
      color: '#2962FF',
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 6,
    });

    chartRef.current = chart;
    seriesRef.current = lineSeries;

    // Generate sample performance data if none provided
    const sampleData: LineData[] = performanceData.length > 0 
      ? performanceData 
      : generatePerformanceData();
    lineSeries.setData(sampleData);

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
  }, [botName, height]);

  useEffect(() => {
    if (seriesRef.current && performanceData.length > 0) {
      seriesRef.current.setData(performanceData);
    }
  }, [performanceData]);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Performance History</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartContainerRef} className="w-full" />
      </CardContent>
    </Card>
  );
};

// Generate sample performance data
function generatePerformanceData(): LineData[] {
  const data: LineData[] = [];
  let value = 1000;
  const now = Math.floor(Date.now() / 1000);
  
  for (let i = 30; i >= 0; i--) {
    const time = (now - i * 86400) as any;
    value = value * (1 + (Math.random() - 0.45) * 0.05);
    
    data.push({
      time,
      value,
    });
  }
  
  return data;
}
