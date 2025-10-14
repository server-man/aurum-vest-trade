import { useAuth } from '@/contexts/AuthContext';
import TradingBots from '@/components/dashboard/TradingBots';
import AITradingAssistant from '@/components/dashboard/AITradingAssistant';
import LivePriceTracker from '@/components/dashboard/LivePriceTracker';

const TradingBotsPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trading Bots</h1>
        <p className="text-muted-foreground">
          AI-powered automated trading with real-time market data
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TradingBots userId={user?.id} />
        </div>
        <div className="space-y-6">
          <LivePriceTracker />
          <AITradingAssistant />
        </div>
      </div>
    </div>
  );
};

export default TradingBotsPage;