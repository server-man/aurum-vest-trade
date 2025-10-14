import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Activity,
  Sparkles,
  Target,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useCryptoAI } from '@/hooks/useCryptoAI';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AITradingAssistantProps {
  symbol?: string;
  botId?: string;
}

const AITradingAssistant = ({ symbol = 'BTCUSDT', botId }: AITradingAssistantProps) => {
  const { user } = useAuth();
  const { 
    loading, 
    lastAnalysis, 
    analyzeMarket, 
    generateSignal, 
    analyzeSentiment,
    assessRisk,
    getTradeRecommendation 
  } = useCryptoAI();
  
  const [activeTab, setActiveTab] = useState('analysis');

  const handleAnalyzeMarket = async () => {
    if (!user) return;
    try {
      await analyzeMarket(symbol, user.id);
      toast.success('Market analysis complete');
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleGenerateSignal = async () => {
    if (!user) return;
    try {
      await generateSignal(symbol, user.id);
      toast.success('Trading signal generated');
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleSentimentAnalysis = async () => {
    if (!user) return;
    try {
      await analyzeSentiment(symbol, user.id);
      toast.success('Sentiment analysis complete');
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleRiskAssessment = async () => {
    if (!user || !botId) {
      toast.error('Bot ID required for risk assessment');
      return;
    }
    try {
      await assessRisk(botId, user.id);
      toast.success('Risk assessment complete');
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleTradeRecommendation = async () => {
    if (!user) return;
    try {
      await getTradeRecommendation(symbol, user.id);
      toast.success('Trade recommendation generated');
    } catch (error) {
      // Error already handled in hook
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>AI Trading Assistant</CardTitle>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Powered by AI
          </Badge>
        </div>
        <CardDescription>
          Get AI-powered insights and recommendations for {symbol}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analysis">
              <Activity className="h-4 w-4 mr-2" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="signals">
              <Target className="h-4 w-4 mr-2" />
              Signals
            </TabsTrigger>
            <TabsTrigger value="sentiment">
              <TrendingUp className="h-4 w-4 mr-2" />
              Sentiment
            </TabsTrigger>
            <TabsTrigger value="risk">
              <Shield className="h-4 w-4 mr-2" />
              Risk
            </TabsTrigger>
            <TabsTrigger value="recommend">
              <Sparkles className="h-4 w-4 mr-2" />
              Recommend
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Get comprehensive market analysis
              </p>
              <Button 
                onClick={handleAnalyzeMarket} 
                disabled={loading}
                size="sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Market'
                )}
              </Button>
            </div>
            
            {lastAnalysis?.analysis && activeTab === 'analysis' && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Activity className="h-4 w-4" />
                  Market Analysis
                </div>
                <p className="text-sm whitespace-pre-wrap">{lastAnalysis.analysis}</p>
                {lastAnalysis.marketData && (
                  <div className="grid grid-cols-2 gap-2 text-xs mt-2 pt-2 border-t">
                    <div>Price: ${lastAnalysis.marketData.price}</div>
                    <div>Change: {lastAnalysis.marketData.change24h}%</div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="signals" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Generate AI trading signals
              </p>
              <Button 
                onClick={handleGenerateSignal} 
                disabled={loading}
                size="sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Signal'
                )}
              </Button>
            </div>
            
            {lastAnalysis?.signal && activeTab === 'signals' && (
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={lastAnalysis.signal === 'BUY' ? 'default' : lastAnalysis.signal === 'SELL' ? 'destructive' : 'secondary'}
                    className="text-lg px-3 py-1"
                  >
                    {lastAnalysis.signal}
                  </Badge>
                  {lastAnalysis.confidence && (
                    <Badge variant="outline">
                      {lastAnalysis.confidence}% confidence
                    </Badge>
                  )}
                </div>
                {lastAnalysis.reasoning && (
                  <p className="text-sm">{lastAnalysis.reasoning}</p>
                )}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {lastAnalysis.entry && <div>Entry: ${lastAnalysis.entry}</div>}
                  {lastAnalysis.takeProfit && <div>Take Profit: {lastAnalysis.takeProfit}%</div>}
                  {lastAnalysis.stopLoss && <div>Stop Loss: {lastAnalysis.stopLoss}%</div>}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Analyze market sentiment
              </p>
              <Button 
                onClick={handleSentimentAnalysis} 
                disabled={loading}
                size="sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Sentiment'
                )}
              </Button>
            </div>
            
            {lastAnalysis?.sentiment && activeTab === 'sentiment' && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sentiment</span>
                  <Badge variant={
                    lastAnalysis.sentiment.label === 'positive' ? 'default' : 
                    lastAnalysis.sentiment.label === 'negative' ? 'destructive' : 
                    'secondary'
                  }>
                    {lastAnalysis.sentiment.label}
                  </Badge>
                </div>
                {lastAnalysis.sentiment.score && (
                  <div className="text-sm">
                    Confidence: {(lastAnalysis.sentiment.score * 100).toFixed(1)}%
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Assess trading risk
              </p>
              <Button 
                onClick={handleRiskAssessment} 
                disabled={loading || !botId}
                size="sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Assessing...
                  </>
                ) : (
                  'Assess Risk'
                )}
              </Button>
            </div>
            
            {!botId && (
              <div className="p-4 bg-muted rounded-lg flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                Select a bot to assess risk
              </div>
            )}

            {lastAnalysis?.riskScore && activeTab === 'risk' && (
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Risk Score</span>
                  <Badge variant={
                    lastAnalysis.riskScore <= 3 ? 'default' : 
                    lastAnalysis.riskScore <= 6 ? 'secondary' : 
                    'destructive'
                  }>
                    {lastAnalysis.riskScore}/10
                  </Badge>
                </div>
                {lastAnalysis.factors && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Risk Factors:</p>
                    <ul className="text-xs list-disc list-inside space-y-1">
                      {lastAnalysis.factors.map((factor: string, i: number) => (
                        <li key={i}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {lastAnalysis.recommendations && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Recommendations:</p>
                    <ul className="text-xs list-disc list-inside space-y-1">
                      {lastAnalysis.recommendations.map((rec: string, i: number) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommend" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Get trade recommendations
              </p>
              <Button 
                onClick={handleTradeRecommendation} 
                disabled={loading}
                size="sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Getting...
                  </>
                ) : (
                  'Get Recommendation'
                )}
              </Button>
            </div>
            
            {lastAnalysis?.recommendation && activeTab === 'recommend' && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  AI Recommendation
                </div>
                <p className="text-sm whitespace-pre-wrap">{lastAnalysis.recommendation}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AITradingAssistant;
