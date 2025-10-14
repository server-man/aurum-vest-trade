import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Building2, Briefcase } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';

// Sample data
const stocksData = [
  { name: 'AAPL', price: 178.45, change: 2.34, changePercent: 1.33, volume: '45.2M', marketCap: '2.8T' },
  { name: 'GOOGL', price: 140.23, change: -1.23, changePercent: -0.87, volume: '23.1M', marketCap: '1.7T' },
  { name: 'MSFT', price: 378.91, change: 3.45, changePercent: 0.92, volume: '31.4M', marketCap: '2.9T' },
  { name: 'TSLA', price: 242.67, change: 5.67, changePercent: 2.39, volume: '89.3M', marketCap: '771B' },
  { name: 'AMZN', price: 145.32, change: -0.89, changePercent: -0.61, volume: '38.7M', marketCap: '1.5T' },
  { name: 'NVDA', price: 495.22, change: 12.34, changePercent: 2.56, volume: '52.1M', marketCap: '1.2T' },
];

const bondsData = [
  { name: 'US 10Y Treasury', yield: 4.52, price: 98.45, maturity: '2033', rating: 'AAA' },
  { name: 'US 30Y Treasury', yield: 4.68, price: 94.23, maturity: '2053', rating: 'AAA' },
  { name: 'Corporate Bond A', yield: 5.23, price: 102.34, maturity: '2030', rating: 'AA' },
  { name: 'Municipal Bond', yield: 3.87, price: 99.78, maturity: '2035', rating: 'AA+' },
];

const mutualFundsData = [
  { name: 'S&P 500 Index Fund', nav: 458.32, change: 1.23, ytd: 18.45, expenseRatio: 0.04 },
  { name: 'Total Market Fund', nav: 234.56, change: 0.89, ytd: 16.78, expenseRatio: 0.05 },
  { name: 'Growth Fund', nav: 678.90, change: 2.34, ytd: 24.32, expenseRatio: 0.75 },
  { name: 'Dividend Fund', nav: 345.67, change: 0.45, ytd: 12.34, expenseRatio: 0.35 },
];

const chartData = [
  { month: 'Jan', value: 10000 },
  { month: 'Feb', value: 12000 },
  { month: 'Mar', value: 11500 },
  { month: 'Apr', value: 13800 },
  { month: 'May', value: 15200 },
  { month: 'Jun', value: 17500 },
];

const portfolioData = [
  { name: 'Stocks', value: 45, color: '#8b5cf6' },
  { name: 'Bonds', value: 30, color: '#3b82f6' },
  { name: 'Mutual Funds', value: 25, color: '#10b981' },
];

export default function Investo() {
  const [activeTab, setActiveTab] = useState('stocks');

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
          Investo Trading Platform
        </h1>
        <p className="text-muted-foreground">
          Trade US Stocks, Bonds, and Mutual Funds with confidence
        </p>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Portfolio Performance
            </CardTitle>
            <CardDescription>Your investment growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RePieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {portfolioData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$17,500</div>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +18.5% YTD
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Stocks Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$7,875</div>
            <p className="text-xs text-muted-foreground">45% of portfolio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Bonds Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,250</div>
            <p className="text-xs text-muted-foreground">30% of portfolio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Mutual Funds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,375</div>
            <p className="text-xs text-muted-foreground">25% of portfolio</p>
          </CardContent>
        </Card>
      </div>

      {/* Trading Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
          <CardDescription>Real-time market data and trading opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stocks">US Stocks</TabsTrigger>
              <TabsTrigger value="bonds">Bonds</TabsTrigger>
              <TabsTrigger value="mutual">Mutual Funds</TabsTrigger>
            </TabsList>

            <TabsContent value="stocks" className="space-y-4">
              <div className="space-y-3">
                {stocksData.map((stock) => (
                  <Card key={stock.name} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold">{stock.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {stock.marketCap}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Volume: {stock.volume}
                          </p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-2xl font-bold">${stock.price}</div>
                            <div
                              className={`text-sm flex items-center gap-1 ${
                                stock.change >= 0 ? 'text-green-500' : 'text-red-500'
                              }`}
                            >
                              {stock.change >= 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {stock.change >= 0 ? '+' : ''}
                              {stock.change} ({stock.changePercent}%)
                            </div>
                          </div>
                          <Button size="sm">Trade</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bonds" className="space-y-4">
              <div className="space-y-3">
                {bondsData.map((bond) => (
                  <Card key={bond.name} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold">{bond.name}</h3>
                            <Badge>{bond.rating}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Maturity: {bond.maturity}
                          </p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Yield</div>
                            <div className="text-2xl font-bold">{bond.yield}%</div>
                            <div className="text-sm text-muted-foreground">
                              Price: ${bond.price}
                            </div>
                          </div>
                          <Button size="sm">Invest</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mutual" className="space-y-4">
              <div className="space-y-3">
                {mutualFundsData.map((fund) => (
                  <Card key={fund.name} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold">{fund.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Expense Ratio: {fund.expenseRatio}%
                          </p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">NAV</div>
                            <div className="text-2xl font-bold">${fund.nav}</div>
                            <div className="text-sm text-green-500">
                              YTD: +{fund.ytd}%
                            </div>
                          </div>
                          <Button size="sm">Buy</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-sm">Why Trade Stocks?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>• Potential for high returns</p>
            <p>• Ownership in companies</p>
            <p>• Dividend income opportunities</p>
            <p>• Liquidity and flexibility</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-sm">Why Invest in Bonds?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>• Stable and predictable income</p>
            <p>• Lower risk than stocks</p>
            <p>• Portfolio diversification</p>
            <p>• Capital preservation</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-sm">Why Choose Mutual Funds?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>• Professional management</p>
            <p>• Instant diversification</p>
            <p>• Lower investment minimums</p>
            <p>• Automatic reinvestment</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
