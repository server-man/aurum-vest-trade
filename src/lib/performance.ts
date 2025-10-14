/**
 * Performance monitoring and optimization utilities
 */

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkRequests: number;
  cacheHitRate: number;
}

export interface ComponentMetrics {
  name: string;
  renderCount: number;
  averageRenderTime: number;
  lastRender: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private componentMetrics = new Map<string, ComponentMetrics>();
  private networkMetrics: Array<{ url: string; duration: number; timestamp: number }> = [];
  private memoryChecks: number[] = [];
  
  private constructor() {
    this.initializeMonitoring();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeMonitoring() {
    // Monitor memory usage every 30 seconds
    setInterval(() => {
      this.recordMemoryUsage();
    }, 30000);

    // Monitor network requests
    this.setupNetworkMonitoring();
  }

  /**
   * Record component render performance
   */
  recordComponentRender(componentName: string, renderTime: number) {
    const existing = this.componentMetrics.get(componentName);
    
    if (existing) {
      existing.renderCount++;
      existing.averageRenderTime = (existing.averageRenderTime + renderTime) / 2;
      existing.lastRender = Date.now();
    } else {
      this.componentMetrics.set(componentName, {
        name: componentName,
        renderCount: 1,
        averageRenderTime: renderTime,
        lastRender: Date.now()
      });
    }
  }

  /**
   * Measure component performance
   */
  measureComponent<T>(componentName: string, renderFn: () => T): T {
    const start = performance.now();
    const result = renderFn();
    const end = performance.now();
    
    this.recordComponentRender(componentName, end - start);
    return result;
  }

  /**
   * Record memory usage
   */
  private recordMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.memoryChecks.push(memory.usedJSHeapSize);
      
      // Keep only last 100 measurements
      if (this.memoryChecks.length > 100) {
        this.memoryChecks.shift();
      }
    }
  }

  /**
   * Setup network monitoring
   */
  private setupNetworkMonitoring() {
    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const start = performance.now();
      const url = args[0] instanceof Request ? args[0].url : args[0].toString();
      
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - start;
        
        this.networkMetrics.push({
          url,
          duration,
          timestamp: Date.now()
        });
        
        // Keep only last 1000 requests
        if (this.networkMetrics.length > 1000) {
          this.networkMetrics.shift();
        }
        
        return response;
      } catch (error) {
        const duration = performance.now() - start;
        this.networkMetrics.push({
          url,
          duration,
          timestamp: Date.now()
        });
        throw error;
      }
    };
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      loadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0,
      renderTime: this.getAverageRenderTime(),
      memoryUsage: this.getCurrentMemoryUsage(),
      networkRequests: this.networkMetrics.length,
      cacheHitRate: this.calculateCacheHitRate()
    };
  }

  /**
   * Get component performance data
   */
  getComponentMetrics(): ComponentMetrics[] {
    return Array.from(this.componentMetrics.values());
  }

  /**
   * Get slow components (render time > threshold)
   */
  getSlowComponents(threshold = 16): ComponentMetrics[] {
    return Array.from(this.componentMetrics.values())
      .filter(metric => metric.averageRenderTime > threshold)
      .sort((a, b) => b.averageRenderTime - a.averageRenderTime);
  }

  /**
   * Get network performance data
   */
  getNetworkMetrics() {
    const recent = this.networkMetrics.filter(
      req => Date.now() - req.timestamp < 5 * 60 * 1000 // Last 5 minutes
    );

    const avgDuration = recent.reduce((sum, req) => sum + req.duration, 0) / recent.length || 0;
    const slowRequests = recent.filter(req => req.duration > 1000); // > 1 second

    return {
      totalRequests: recent.length,
      averageDuration: avgDuration,
      slowRequests: slowRequests.length,
      slowRequestUrls: slowRequests.map(req => req.url)
    };
  }

  private getAverageRenderTime(): number {
    const metrics = Array.from(this.componentMetrics.values());
    if (metrics.length === 0) return 0;
    
    const total = metrics.reduce((sum, metric) => sum + metric.averageRenderTime, 0);
    return total / metrics.length;
  }

  private getCurrentMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  private calculateCacheHitRate(): number {
    // This would need to be integrated with your caching system
    // For now, return a placeholder value
    return 0.85; // 85% cache hit rate
  }

  /**
   * Performance optimization suggestions
   */
  getOptimizationSuggestions(): string[] {
    const suggestions: string[] = [];
    const metrics = this.getMetrics();
    const slowComponents = this.getSlowComponents();
    const networkMetrics = this.getNetworkMetrics();

    if (metrics.loadTime > 3000) {
      suggestions.push('Page load time is slow. Consider code splitting and lazy loading.');
    }

    if (metrics.memoryUsage > 50 * 1024 * 1024) { // 50MB
      suggestions.push('High memory usage detected. Check for memory leaks.');
    }

    if (slowComponents.length > 0) {
      suggestions.push(`Slow components detected: ${slowComponents.slice(0, 3).map(c => c.name).join(', ')}`);
    }

    if (networkMetrics.averageDuration > 500) {
      suggestions.push('Network requests are slow. Consider request optimization.');
    }

    if (networkMetrics.slowRequests > 5) {
      suggestions.push('Multiple slow network requests detected.');
    }

    return suggestions;
  }

  /**
   * Reset all metrics
   */
  reset() {
    this.componentMetrics.clear();
    this.networkMetrics.length = 0;
    this.memoryChecks.length = 0;
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics() {
    return {
      timestamp: Date.now(),
      performance: this.getMetrics(),
      components: this.getComponentMetrics(),
      network: this.getNetworkMetrics(),
      suggestions: this.getOptimizationSuggestions()
    };
  }
}

/**
 * React Hook for measuring component performance
 */
export const usePerformanceMonitor = (componentName: string) => {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    measureRender: <T>(renderFn: () => T): T => {
      return monitor.measureComponent(componentName, renderFn);
    },
    recordRender: (duration: number) => {
      monitor.recordComponentRender(componentName, duration);
    }
  };
};

/**
 * Higher-order component for automatic performance monitoring
 */
export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  return React.memo((props: P) => {
    const monitor = PerformanceMonitor.getInstance();
    
    return monitor.measureComponent(displayName, () => (
      React.createElement(WrappedComponent, props)
    ));
  });
};

/**
 * Performance measurement decorator
 */
export const measurePerformance = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  const monitor = PerformanceMonitor.getInstance();
  
  descriptor.value = function (...args: any[]) {
    const methodName = `${target.constructor.name}.${propertyKey}`;
    return monitor.measureComponent(methodName, () => originalMethod.apply(this, args));
  };
  
  return descriptor;
};

/**
 * Lazy loading utility with performance tracking
 */
export const createPerformantLazyComponent = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  componentName: string
) => {
  const monitor = PerformanceMonitor.getInstance();
  
  return React.lazy(async () => {
    const start = performance.now();
    const component = await importFn();
    const loadTime = performance.now() - start;
    
    monitor.recordComponentRender(`${componentName}:load`, loadTime);
    
    return {
      default: withPerformanceMonitoring(component.default, componentName)
    };
  });
};

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// React import for the HOC
import React from 'react';
