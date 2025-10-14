export interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  risk_level: 'low' | 'medium' | 'high';
  category: 'conservative' | 'balanced' | 'aggressive' | 'scalping' | 'swing';
  recommended_for: string;
  default_config: {
    take_profit_percentage: number;
    stop_loss_percentage: number;
    max_active_deals: number;
    min_balance_required: number;
  };
  indicators: string[];
  icon: string;
}

export const strategyTemplates: StrategyTemplate[] = [
  {
    id: 'conservative-hodl',
    name: 'Conservative HODL',
    description: 'Long-term holding strategy with minimal trading. Ideal for stable growth with low risk.',
    risk_level: 'low',
    category: 'conservative',
    recommended_for: 'Beginners and risk-averse investors',
    default_config: {
      take_profit_percentage: 15,
      stop_loss_percentage: 5,
      max_active_deals: 1,
      min_balance_required: 500,
    },
    indicators: ['SMA 50', 'SMA 200', 'RSI'],
    icon: 'shield',
  },
  {
    id: 'balanced-swing',
    name: 'Balanced Swing Trading',
    description: 'Medium-term strategy capturing price swings. Balanced risk-reward ratio.',
    risk_level: 'medium',
    category: 'balanced',
    recommended_for: 'Intermediate traders',
    default_config: {
      take_profit_percentage: 10,
      stop_loss_percentage: 4,
      max_active_deals: 3,
      min_balance_required: 1000,
    },
    indicators: ['MACD', 'RSI', 'Bollinger Bands', 'Volume'],
    icon: 'trending-up',
  },
  {
    id: 'aggressive-momentum',
    name: 'Aggressive Momentum',
    description: 'High-frequency trading following strong market trends. Higher risk, higher rewards.',
    risk_level: 'high',
    category: 'aggressive',
    recommended_for: 'Experienced traders comfortable with volatility',
    default_config: {
      take_profit_percentage: 8,
      stop_loss_percentage: 3,
      max_active_deals: 5,
      min_balance_required: 2000,
    },
    indicators: ['EMA 12', 'EMA 26', 'MACD', 'Stochastic', 'ATR'],
    icon: 'zap',
  },
  {
    id: 'scalping-rapid',
    name: 'Rapid Scalping',
    description: 'Ultra-short term trades for small, quick profits. Requires active monitoring.',
    risk_level: 'high',
    category: 'scalping',
    recommended_for: 'Advanced traders with time to monitor',
    default_config: {
      take_profit_percentage: 2,
      stop_loss_percentage: 1,
      max_active_deals: 10,
      min_balance_required: 3000,
    },
    indicators: ['EMA 5', 'EMA 10', 'Volume', 'Order Flow'],
    icon: 'activity',
  },
  {
    id: 'dca-accumulation',
    name: 'DCA Accumulation',
    description: 'Dollar-cost averaging strategy for gradual position building.',
    risk_level: 'low',
    category: 'conservative',
    recommended_for: 'Long-term investors',
    default_config: {
      take_profit_percentage: 20,
      stop_loss_percentage: 8,
      max_active_deals: 2,
      min_balance_required: 1500,
    },
    indicators: ['SMA 100', 'Volume', 'Support/Resistance'],
    icon: 'layers',
  },
  {
    id: 'breakout-trading',
    name: 'Breakout Trading',
    description: 'Captures explosive moves when price breaks key levels.',
    risk_level: 'medium',
    category: 'swing',
    recommended_for: 'Traders who can identify patterns',
    default_config: {
      take_profit_percentage: 12,
      stop_loss_percentage: 5,
      max_active_deals: 4,
      min_balance_required: 1200,
    },
    indicators: ['Bollinger Bands', 'Volume', 'ATR', 'Support/Resistance'],
    icon: 'arrow-up-right',
  },
];

export const getRiskLevelColor = (level: string) => {
  switch (level) {
    case 'low':
      return 'text-success';
    case 'medium':
      return 'text-warning';
    case 'high':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
};

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'conservative':
      return 'shield';
    case 'balanced':
      return 'trending-up';
    case 'aggressive':
      return 'zap';
    case 'scalping':
      return 'activity';
    case 'swing':
      return 'arrow-up-right';
    default:
      return 'bot';
  }
};
