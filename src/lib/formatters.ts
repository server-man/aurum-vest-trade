/**
 * Common formatting utilities to avoid code duplication
 */

export const formatCurrency = (amount: number, options?: {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  currency?: string;
}) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: options?.currency || 'USD',
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(amount);
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(price);
};

export const formatVolume = (volume: number) => {
  if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
  if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
  return volume.toFixed(2);
};

export const formatPercentage = (value: number, decimals: number = 2) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const formatSymbol = (symbol: string) => {
  return symbol.replace('USDT', '/USDT');
};

export const formatCompactNumber = (num: number) => {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(num);
};