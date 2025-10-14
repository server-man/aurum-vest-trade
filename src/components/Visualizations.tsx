
import { useState, useEffect } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line
} from "recharts";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Clock, PieChart, BarChart2, TrendingUp } from "lucide-react";

// Mock data for charts
const generateChartData = (length: number) => {
  const data = [];
  let value = 42000 + Math.random() * 2000;
  const now = new Date();
  
  for (let i = length - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setHours(now.getHours() - i);
    
    // Create some realistic price movements
    const change = (Math.random() - 0.5) * 200;
    value += change;
    
    data.push({
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: Math.round(value * 100) / 100,
      volume: Math.floor(Math.random() * 10000) + 5000,
      signal: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'buy' : 'sell') : null
    });
  }
  
  return data;
};

// Generate data for different timeframes
const data1h = generateChartData(60);
const data4h = generateChartData(30);
const data1d = generateChartData(24);

const Visualizations = () => {
  const [timeframe, setTimeframe] = useState("1h");
  const [chartData, setChartData] = useState(data1h);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    switch (timeframe) {
      case "1h":
        setChartData(data1h);
        break;
      case "4h":
        setChartData(data4h);
        break;
      case "1d":
        setChartData(data1d);
        break;
      default:
        setChartData(data1h);
    }
  }, [timeframe]);

  // Format the tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-binance-black p-3 border border-binance-darkGray rounded-md shadow-lg">
          <p className="text-gray-300">{`Time: ${label}`}</p>
          <p className="text-binance-yellow">{`Price: $${payload[0].value.toFixed(2)}`}</p>
          {payload[1] && <p className="text-gray-400">{`Volume: ${payload[1].value}`}</p>}
        </div>
      );
    }
    return null;
  };

  // Signal Markers for the chart
  const SignalMarkers = ({ data }: { data: any[] }) => {
    return (
      <>
        {data.map((entry, index) => {
          if (entry.signal === 'buy') {
            return (
              <svg key={`marker-${index}`} x={index * (windowWidth > 768 ? 30 : 15)} y={0} width={20} height={200}>
                <circle cx={10} cy={100} r={5} fill="#22c55e" />
                <line x1={10} y1={95} x2={10} y2={105} stroke="#22c55e" strokeWidth={2} />
              </svg>
            );
          } else if (entry.signal === 'sell') {
            return (
              <svg key={`marker-${index}`} x={index * (windowWidth > 768 ? 30 : 15)} y={0} width={20} height={200}>
                <circle cx={10} cy={100} r={5} fill="#ef4444" />
                <line x1={5} y1={100} x2={15} y2={100} stroke="#ef4444" strokeWidth={2} />
              </svg>
            );
          }
          return null;
        })}
      </>
    );
  };

  return (
    <section className="section-padding bg-binance-black/80 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-binance-yellow/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-binance-yellow/5 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-binance-yellow/10 text-binance-yellow text-sm font-medium mb-4">
            Trading Visualization
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Powerful <span className="text-gradient">Trading Bot</span> Visualizations
          </h2>
          <p className="text-gray-400 text-lg">
            Watch our bots in action with real-time insights, analytics, and trading signals.
          </p>
        </div>

        <div className="glass-effect rounded-xl p-4 md:p-6 border border-binance-darkGray">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <div className="flex items-center">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-binance-yellow/10 mr-3">
                <BarChart2 className="h-5 w-5 text-binance-yellow" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">BTC/USDT DCA Bot</h3>
                <p className="text-gray-400 text-sm">Dollar-cost averaging strategy</p>
              </div>
            </div>
            
            <div className="flex space-x-2 items-center bg-binance-darkGray rounded-lg p-1">
              <button 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeframe === "1h" ? "bg-binance-yellow text-binance-black" : "text-gray-300 hover:bg-binance-lightGray"
                }`}
                onClick={() => setTimeframe("1h")}
              >
                1H
              </button>
              <button 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeframe === "4h" ? "bg-binance-yellow text-binance-black" : "text-gray-300 hover:bg-binance-lightGray"
                }`}
                onClick={() => setTimeframe("4h")}
              >
                4H
              </button>
              <button 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeframe === "1d" ? "bg-binance-yellow text-binance-black" : "text-gray-300 hover:bg-binance-lightGray"
                }`}
                onClick={() => setTimeframe("1d")}
              >
                1D
              </button>
            </div>
          </div>

          <Tabs defaultValue="candlestick" className="w-full">
            <TabsList className="mb-4 bg-binance-darkGray">
              <TabsTrigger value="candlestick" className="data-[state=active]:bg-binance-yellow data-[state=active]:text-binance-black">
                <BarChart2 className="h-4 w-4 mr-2" /> Candlestick
              </TabsTrigger>
              <TabsTrigger value="line" className="data-[state=active]:bg-binance-yellow data-[state=active]:text-binance-black">
                <TrendingUp className="h-4 w-4 mr-2" /> Line Chart
              </TabsTrigger>
              <TabsTrigger value="volume" className="data-[state=active]:bg-binance-yellow data-[state=active]:text-binance-black">
                <PieChart className="h-4 w-4 mr-2" /> Volume
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="candlestick" className="mt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F0B90B" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#F0B90B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2B3139" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#474D57" 
                      tick={{ fill: '#8A898C' }} 
                      tickLine={{ stroke: '#474D57' }}
                    />
                    <YAxis 
                      stroke="#474D57" 
                      tick={{ fill: '#8A898C' }} 
                      tickLine={{ stroke: '#474D57' }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#F0B90B" 
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="volume" 
                      stroke="none" 
                      fillOpacity={0} 
                      fill="none" 
                    />
                    {/* Signal Markers */}
                    <SignalMarkers data={chartData} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="line" className="mt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2B3139" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#474D57" 
                      tick={{ fill: '#8A898C' }} 
                      tickLine={{ stroke: '#474D57' }}
                    />
                    <YAxis 
                      stroke="#474D57" 
                      tick={{ fill: '#8A898C' }} 
                      tickLine={{ stroke: '#474D57' }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#F0B90B" 
                      strokeWidth={2}
                      dot={{ stroke: '#F0B90B', fill: '#1E2026', strokeWidth: 2, r: 4 }}
                      activeDot={{ stroke: '#F0B90B', fill: '#F0B90B', strokeWidth: 0, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="volume" className="mt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2B3139" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#474D57" 
                      tick={{ fill: '#8A898C' }} 
                      tickLine={{ stroke: '#474D57' }}
                    />
                    <YAxis 
                      stroke="#474D57" 
                      tick={{ fill: '#8A898C' }} 
                      tickLine={{ stroke: '#474D57' }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="volume" 
                      fill="#F0B90B" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>

          {/* Bot Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-binance-darkGray rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">24h Profit</div>
              <div className="text-green-400 font-bold text-lg">+2.8%</div>
            </div>
            <div className="bg-binance-darkGray rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Total Trades</div>
              <div className="text-white font-bold text-lg">147</div>
            </div>
            <div className="bg-binance-darkGray rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Win Rate</div>
              <div className="text-white font-bold text-lg">76.2%</div>
            </div>
            <div className="bg-binance-darkGray rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Running Since</div>
              <div className="text-white font-bold text-lg">7d 14h</div>
            </div>
          </div>
        </div>

        {/* Additional visualization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="glass-effect rounded-xl p-4 md:p-6 border border-binance-darkGray h-full flex flex-col">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-binance-yellow/10 mr-3">
                <Clock className="h-5 w-5 text-binance-yellow" />
              </div>
              <h3 className="text-white font-semibold text-lg">24/7 Trading Activity</h3>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full max-w-xs">
                <div className="aspect-square rounded-full border-4 border-binance-darkGray flex items-center justify-center relative">
                  <div className="absolute inset-2 rounded-full border-t-4 border-binance-yellow animate-spin"></div>
                  <div className="text-center">
                    <div className="text-white text-lg font-semibold">Active</div>
                    <div className="text-gray-400 text-sm">24/7 Monitoring</div>
                  </div>
                </div>
                
                {/* Time markers */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-gray-400 text-xs">00:00</div>
                <div className="absolute right-0 top-1/2 translate-x-2 -translate-y-1/2 text-gray-400 text-xs">06:00</div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 text-gray-400 text-xs">12:00</div>
                <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 text-gray-400 text-xs">18:00</div>
                
                {/* Activity indicators */}
                <div className="absolute top-1/4 right-1/4 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/5 h-3 w-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                <div className="absolute bottom-1/4 left-1/4 h-3 w-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
                <div className="absolute top-2/5 left-1/5 h-3 w-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "1.5s" }}></div>
              </div>
            </div>
            
            <div className="mt-4 text-center text-gray-400">
              Your bot is actively monitoring the market and executing trades based on your strategy.
            </div>
          </div>
          
          <div className="glass-effect rounded-xl p-4 md:p-6 border border-binance-darkGray flex flex-col">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-binance-yellow/10 mr-3">
                <TrendingUp className="h-5 w-5 text-binance-yellow" />
              </div>
              <h3 className="text-white font-semibold text-lg">Recent Bot Actions</h3>
            </div>
            
            <div className="flex-1">
              <ul className="space-y-4">
                {[
                  { time: "10:42 AM", action: "BUY", asset: "BTC", price: "41,235.67", amount: "0.0045" },
                  { time: "08:17 AM", action: "SELL", asset: "ETH", price: "2,876.32", amount: "0.125" },
                  { time: "Yesterday, 11:52 PM", action: "BUY", asset: "SOL", price: "82.14", amount: "2.4" },
                  { time: "Yesterday, 07:30 PM", action: "BUY", asset: "BTC", price: "40,895.51", amount: "0.0038" },
                  { time: "Yesterday, 02:15 PM", action: "SELL", asset: "BTC", price: "41,105.25", amount: "0.0063" },
                ].map((item, index) => (
                  <li key={index} className="bg-binance-darkGray rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-md flex items-center justify-center mr-3 ${
                        item.action === "BUY" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                      }`}>
                        {item.action === "BUY" ? "B" : "S"}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">
                          {item.action} {item.amount} {item.asset}
                        </div>
                        <div className="text-gray-400 text-xs">{item.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm">${item.price}</div>
                      <div className={`text-xs ${
                        item.action === "BUY" ? "text-green-400" : "text-red-400"
                      }`}>
                        {item.action === "BUY" ? "Purchased" : "Sold"}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Visualizations;
