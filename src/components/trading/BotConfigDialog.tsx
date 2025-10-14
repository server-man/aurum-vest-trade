import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { strategyTemplates, getRiskLevelColor } from '@/lib/tradingStrategies';
import { 
  Bot, 
  TrendingUp, 
  Shield, 
  Zap, 
  Activity, 
  Layers,
  ArrowUpRight,
  ChevronRight,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface BotConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (config: BotConfiguration) => void;
  initialConfig?: Partial<BotConfiguration>;
  mode?: 'create' | 'edit';
}

export interface BotConfiguration {
  name: string;
  description: string;
  strategy_template_id: string;
  trading_pair: string;
  base_currency: string;
  quote_currency: string;
  exchange: string;
  initial_balance: number;
  take_profit_percentage: number;
  stop_loss_percentage: number;
  max_active_deals: number;
  risk_level: 'low' | 'medium' | 'high';
  advanced_settings: {
    trailing_stop: boolean;
    trailing_deviation: number;
    cooldown_period: number;
    max_daily_loss: number;
    profit_target_daily: number;
  };
}

const getIcon = (iconName: string) => {
  const icons: { [key: string]: any } = {
    shield: Shield,
    'trending-up': TrendingUp,
    zap: Zap,
    activity: Activity,
    layers: Layers,
    'arrow-up-right': ArrowUpRight,
    bot: Bot,
  };
  return icons[iconName] || Bot;
};

export function BotConfigDialog({ open, onOpenChange, onSubmit, initialConfig, mode = 'create' }: BotConfigDialogProps) {
  const [currentTab, setCurrentTab] = useState('strategy');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [config, setConfig] = useState<Partial<BotConfiguration>>({
    name: '',
    description: '',
    trading_pair: 'BTC/USDT',
    base_currency: 'BTC',
    quote_currency: 'USDT',
    exchange: 'binance',
    initial_balance: 1000,
    take_profit_percentage: 10,
    stop_loss_percentage: 5,
    max_active_deals: 3,
    risk_level: 'medium',
    advanced_settings: {
      trailing_stop: false,
      trailing_deviation: 1,
      cooldown_period: 60,
      max_daily_loss: 5,
      profit_target_daily: 10,
    },
    ...initialConfig,
  });

  const handleTemplateSelect = (templateId: string) => {
    const template = strategyTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setConfig({
        ...config,
        strategy_template_id: templateId,
        name: config.name || template.name,
        description: config.description || template.description,
        risk_level: template.risk_level,
        take_profit_percentage: template.default_config.take_profit_percentage,
        stop_loss_percentage: template.default_config.stop_loss_percentage,
        max_active_deals: template.default_config.max_active_deals,
        initial_balance: template.default_config.min_balance_required,
      });
      toast.success(`${template.name} strategy selected`);
      setCurrentTab('basic');
    }
  };

  const handleSubmit = () => {
    if (!config.name || !config.strategy_template_id) {
      toast.error('Please complete all required fields');
      return;
    }
    onSubmit(config as BotConfiguration);
    onOpenChange(false);
  };

  const updateConfig = (field: string, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const updateAdvancedSettings = (field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      advanced_settings: {
        ...prev.advanced_settings!,
        [field]: value,
      },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            {mode === 'create' ? 'Create New Trading Bot' : 'Configure Trading Bot'}
          </DialogTitle>
          <DialogDescription>
            Set up your automated trading bot with advanced configuration options
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="basic" disabled={!selectedTemplate}>Basic</TabsTrigger>
            <TabsTrigger value="risk" disabled={!selectedTemplate}>Risk</TabsTrigger>
            <TabsTrigger value="advanced" disabled={!selectedTemplate}>Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="strategy" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Choose a Trading Strategy</h3>
                <p className="text-sm text-muted-foreground">
                  Select a pre-configured strategy template that matches your trading style
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategyTemplates.map((template) => {
                  const Icon = getIcon(template.icon);
                  return (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base">{template.name}</CardTitle>
                          </div>
                          <Badge variant={template.risk_level === 'low' ? 'secondary' : template.risk_level === 'medium' ? 'default' : 'destructive'}>
                            {template.risk_level}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Take Profit:</span>
                            <span className="font-medium text-success">{template.default_config.take_profit_percentage}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Stop Loss:</span>
                            <span className="font-medium text-destructive">{template.default_config.stop_loss_percentage}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Max Deals:</span>
                            <span className="font-medium">{template.default_config.max_active_deals}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Min Balance:</span>
                            <span className="font-medium">${template.default_config.min_balance_required}</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            <Info className="h-3 w-3 inline mr-1" />
                            {template.recommended_for}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Bot Name *</Label>
                  <Input
                    id="name"
                    placeholder="My Trading Bot"
                    value={config.name}
                    onChange={(e) => updateConfig('name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exchange">Exchange</Label>
                  <Select value={config.exchange} onValueChange={(v) => updateConfig('exchange', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="binance">Binance</SelectItem>
                      <SelectItem value="coinbase">Coinbase</SelectItem>
                      <SelectItem value="kraken">Kraken</SelectItem>
                      <SelectItem value="kucoin">KuCoin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your bot's purpose..."
                  value={config.description}
                  onChange={(e) => updateConfig('description', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trading_pair">Trading Pair</Label>
                  <Select value={config.trading_pair} onValueChange={(v) => updateConfig('trading_pair', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                      <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                      <SelectItem value="BNB/USDT">BNB/USDT</SelectItem>
                      <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
                      <SelectItem value="XRP/USDT">XRP/USDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="base_currency">Base Currency</Label>
                  <Input
                    id="base_currency"
                    value={config.base_currency}
                    onChange={(e) => updateConfig('base_currency', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quote_currency">Quote Currency</Label>
                  <Input
                    id="quote_currency"
                    value={config.quote_currency}
                    onChange={(e) => updateConfig('quote_currency', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="initial_balance">Initial Balance (USD)</Label>
                <Input
                  id="initial_balance"
                  type="number"
                  value={config.initial_balance}
                  onChange={(e) => updateConfig('initial_balance', parseFloat(e.target.value))}
                  min="100"
                  step="100"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Take Profit Percentage: {config.take_profit_percentage}%</Label>
                <Slider
                  value={[config.take_profit_percentage || 10]}
                  onValueChange={(v) => updateConfig('take_profit_percentage', v[0])}
                  min={1}
                  max={50}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Bot will sell when profit reaches this percentage
                </p>
              </div>

              <div className="space-y-2">
                <Label>Stop Loss Percentage: {config.stop_loss_percentage}%</Label>
                <Slider
                  value={[config.stop_loss_percentage || 5]}
                  onValueChange={(v) => updateConfig('stop_loss_percentage', v[0])}
                  min={0.5}
                  max={20}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Bot will sell to prevent further losses at this percentage
                </p>
              </div>

              <div className="space-y-2">
                <Label>Max Active Deals: {config.max_active_deals}</Label>
                <Slider
                  value={[config.max_active_deals || 3]}
                  onValueChange={(v) => updateConfig('max_active_deals', v[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum number of simultaneous trading positions
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="risk_level">Risk Level</Label>
                <Select value={config.risk_level} onValueChange={(v: any) => updateConfig('risk_level', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Conservative</SelectItem>
                    <SelectItem value="medium">Medium - Balanced</SelectItem>
                    <SelectItem value="high">High - Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Trailing Stop Loss</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically adjust stop loss as profit increases
                  </p>
                </div>
                <Switch
                  checked={config.advanced_settings?.trailing_stop}
                  onCheckedChange={(v) => updateAdvancedSettings('trailing_stop', v)}
                />
              </div>

              {config.advanced_settings?.trailing_stop && (
                <div className="space-y-2">
                  <Label>Trailing Deviation: {config.advanced_settings.trailing_deviation}%</Label>
                  <Slider
                    value={[config.advanced_settings.trailing_deviation]}
                    onValueChange={(v) => updateAdvancedSettings('trailing_deviation', v[0])}
                    min={0.5}
                    max={5}
                    step={0.1}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Cooldown Period (seconds): {config.advanced_settings?.cooldown_period}</Label>
                <Slider
                  value={[config.advanced_settings?.cooldown_period || 60]}
                  onValueChange={(v) => updateAdvancedSettings('cooldown_period', v[0])}
                  min={30}
                  max={300}
                  step={10}
                />
                <p className="text-xs text-muted-foreground">
                  Waiting time between consecutive trades
                </p>
              </div>

              <div className="space-y-2">
                <Label>Max Daily Loss Limit: {config.advanced_settings?.max_daily_loss}%</Label>
                <Slider
                  value={[config.advanced_settings?.max_daily_loss || 5]}
                  onValueChange={(v) => updateAdvancedSettings('max_daily_loss', v[0])}
                  min={1}
                  max={20}
                  step={0.5}
                />
                <p className="text-xs text-muted-foreground">
                  Bot will stop trading if daily losses exceed this limit
                </p>
              </div>

              <div className="space-y-2">
                <Label>Daily Profit Target: {config.advanced_settings?.profit_target_daily}%</Label>
                <Slider
                  value={[config.advanced_settings?.profit_target_daily || 10]}
                  onValueChange={(v) => updateAdvancedSettings('profit_target_daily', v[0])}
                  min={1}
                  max={50}
                  step={0.5}
                />
                <p className="text-xs text-muted-foreground">
                  Bot can pause after reaching this daily profit goal
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex gap-2">
            {currentTab !== 'strategy' && (
              <Button variant="outline" onClick={() => {
                const tabs = ['strategy', 'basic', 'risk', 'advanced'];
                const currentIndex = tabs.indexOf(currentTab);
                if (currentIndex > 0) setCurrentTab(tabs[currentIndex - 1]);
              }}>
                Back
              </Button>
            )}
            {currentTab !== 'advanced' && selectedTemplate && (
              <Button onClick={() => {
                const tabs = ['strategy', 'basic', 'risk', 'advanced'];
                const currentIndex = tabs.indexOf(currentTab);
                if (currentIndex < tabs.length - 1) setCurrentTab(tabs[currentIndex + 1]);
              }}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
            {currentTab === 'advanced' && (
              <Button onClick={handleSubmit}>
                {mode === 'create' ? 'Create Bot' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
