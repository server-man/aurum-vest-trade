import { supabase } from '@/integrations/supabase/client';

/**
 * Database connection utilities with caching and optimization
 */

export interface QueryOptions {
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTTL?: number;
}

export class DatabaseManager {
  private static instance: DatabaseManager;
  private queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  private constructor() {
    this.setupOptimizations();
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private setupOptimizations() {
    // Clear expired cache entries every 5 minutes
    setInterval(() => {
      this.clearExpiredCache();
    }, 5 * 60 * 1000);
  }

  /**
   * Execute optimized query with caching and retry logic
   */
  async executeQuery<T = any>(
    queryFn: () => Promise<{ data: T | null; error: any }>,
    options: QueryOptions = {}
  ): Promise<{ data: T | null; error: any }> {
    const {
      timeout = 60000,
      retries = 3,
      cache = false,
      cacheTTL = 5 * 60 * 1000 // 5 minutes default
    } = options;

    // Generate cache key based on query function string
    const cacheKey = cache ? this.generateCacheKey(queryFn.toString()) : null;

    // Check cache first
    if (cacheKey && cache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return { data: cached, error: null };
      }
    }

    let lastError: any = null;
    
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const result = await Promise.race([
          queryFn(),
          this.createTimeoutPromise(timeout)
        ]);

        // Cache successful results
        if (cacheKey && cache && result.data && !result.error) {
          this.setCache(cacheKey, result.data, cacheTTL);
        }

        return result;
      } catch (error) {
        lastError = error;
        console.warn(`Query attempt ${attempt + 1} failed:`, error);
        
        // Exponential backoff for retries
        if (attempt < retries - 1) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    return { data: null, error: lastError };
  }

  /**
   * Get user profile with caching
   */
  async getUserProfile(userId: string, useCache = true) {
    return this.executeQuery(
      async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        return { data, error };
      },
      { cache: useCache, cacheTTL: 10 * 60 * 1000 }
    );
  }

  /**
   * Get user trading bots
   */
  async getUserTradingBots(userId: string, useCache = true) {
    return this.executeQuery(
      async () => {
        const { data, error } = await supabase
          .from('trading_bots')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        return { data, error };
      },
      { cache: useCache, cacheTTL: 2 * 60 * 1000 }
    );
  }

  /**
   * Get wallet assets
   */
  async getUserWalletAssets(userId: string, useCache = true) {
    return this.executeQuery(
      async () => {
        const { data, error } = await supabase
          .from('wallet_assets')
          .select('*')
          .eq('user_id', userId)
          .order('balance', { ascending: false });
        return { data, error };
      },
      { cache: useCache, cacheTTL: 30 * 1000 }
    );
  }

  /**
   * Get price history
   */
  async getPriceHistory(symbol: string, limit = 100, useCache = true) {
    return this.executeQuery(
      async () => {
        const { data, error } = await supabase
          .from('price_history')
          .select('*')
          .eq('asset_symbol', symbol)
          .order('recorded_at', { ascending: false })
          .limit(limit);
        return { data, error };
      },
      { cache: useCache, cacheTTL: 60 * 1000 }
    );
  }

  /**
   * Database health check
   */
  async healthCheck(): Promise<{ healthy: boolean; latency: number; error?: any }> {
    const start = performance.now();
    
    try {
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      const latency = performance.now() - start;
      
      return {
        healthy: !error,
        latency,
        error
      };
    } catch (error) {
      return {
        healthy: false,
        latency: performance.now() - start,
        error
      };
    }
  }

  /**
   * Cache management methods
   */
  private generateCacheKey(query: string): string {
    return btoa(query).replace(/[^a-zA-Z0-9]/g, '').substring(0, 50);
  }

  private getFromCache(key: string): any | null {
    const cached = this.queryCache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.queryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, cached] of this.queryCache.entries()) {
      if (now - cached.timestamp >= cached.ttl) {
        this.queryCache.delete(key);
      }
    }
  }

  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Query timeout')), timeout);
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.queryCache.size,
      keys: Array.from(this.queryCache.keys())
    };
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.queryCache.clear();
  }
}

// Export singleton instance
export const databaseManager = DatabaseManager.getInstance();