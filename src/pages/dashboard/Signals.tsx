import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Wifi,
  WifiOff,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useCryptoAI } from '@/hooks/useCryptoAI';
import { TradingViewChart } from '@/components/trading/TradingViewChart';
import { SignalCard } from '@/components/trading/SignalCard';

interface Signal {
  id: string;
  symbol: string;
  signal_type: string;
  price: number;
  target_price?: number;
  stop_loss?: number;
  confidence_level?: number;
  description?: string;
  expires_at?: string;
  created_at: string;
  source?: string;
}

const Signals = () => {
  const { user } = useAuth();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [aiGenerating, setAiGenerating] = useState(false);
  
  const { generateSignal } = useCryptoAI();
  
  const { 
    isConnected, 
    connectToBinance, 
    disconnect
  } = useWebSocket({
    onPriceUpdate: (update) => {
      console.log('Price update received:', update);
    },
    onSignal: (signal) => {
      console.log('New signal received:', signal);
      toast.info(`New ${signal.signal_type} signal for ${signal.symbol}`);
      fetchSignals();
    }
  });

  useEffect(() => {
    if (user) {
      fetchSignals();
      
      // Set up real-time subscription for signals
      const subscription = supabase
        .channel('signals')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'signals' },
          handleSignalChange
        )
        .subscribe();

      // Connect to Binance WebSocket for real-time prices
      const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOGEUSDT'];
      connectToBinance(symbols);

      return () => {
        subscription.unsubscribe();
        disconnect();
      };
    }
  }, [user]);

  const fetchSignals = async () => {
    try {
      const { data, error } = await supabase
        .from('signals')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setSignals(data || []);
    } catch (error: any) {
      console.error('Error fetching signals:', error);
      toast.error('Error loading signals');
    } finally {
      setLoading(false);
    }
  };

  const handleSignalChange = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      setSignals(prev => [payload.new, ...prev]);
      toast.success(`New ${payload.new.signal_type} signal for ${payload.new.symbol}`);
    } else if (payload.eventType === 'UPDATE') {
      setSignals(prev => prev.map(signal => 
        signal.id === payload.new.id ? payload.new : signal
      ));
    } else if (payload.eventType === 'DELETE') {
      setSignals(prev => prev.filter(signal => signal.id !== payload.old.id));
    }
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const handleGenerateAISignal = async () => {
    if (!user?.id) return;
    
    setAiGenerating(true);
    try {
      await generateSignal(selectedSymbol, user.id);
      toast.success('AI signal generated successfully');
      fetchSignals();
    } catch (error) {
      console.error('Error generating AI signal:', error);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleTrade = (signal: Signal) => {
    toast.success(`Opening trade for ${signal.symbol} ${signal.signal_type}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold mb-2">Trading Signals</h1>
          <p className="text-muted-foreground mb-6">Loading signals...</p>
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Trading Signals
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered real-time trading signals with advanced analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            variant={isConnected ? "default" : "secondary"} 
            className="flex items-center gap-1.5 px-3 py-1.5 animate-pulse"
          >
            {isConnected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {isConnected ? 'Live' : 'Offline'}
          </Badge>
          <button
            onClick={handleGenerateAISignal}
            disabled={aiGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover-scale"
          >
            <Sparkles className={`h-4 w-4 ${aiGenerating ? 'animate-spin' : ''}`} />
            {aiGenerating ? 'Generating...' : 'Generate AI Signal'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Active Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{signals.length}</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Buy Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {signals.filter(s => s.signal_type.toLowerCase() === 'buy').length}
            </div>
            <p className="text-xs text-muted-foreground">Bullish opportunities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Sell Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {signals.filter(s => s.signal_type.toLowerCase() === 'sell').length}
            </div>
            <p className="text-xs text-muted-foreground">Bearish alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* TradingView Chart */}
      <div className="animate-fade-in">
        <TradingViewChart symbol={selectedSymbol} height={450} />
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {signals.length === 0 ? (
          <Card className="lg:col-span-2 animate-fade-in">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Activity className="h-16 w-16 text-muted-foreground mb-4 animate-pulse" />
              <h3 className="text-xl font-semibold mb-2">No Active Signals</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                Generate AI-powered signals or wait for new market opportunities to be detected
              </p>
            </CardContent>
          </Card>
        ) : (
          signals.map((signal, index) => (
            <div 
              key={signal.id} 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <SignalCard 
                signal={signal} 
                isExpired={isExpired(signal.expires_at)}
                onTrade={handleTrade}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Signals;