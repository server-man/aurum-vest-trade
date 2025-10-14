/**
 * Bundle optimization and tree shaking utilities
 */

/**
 * Dynamic import wrapper with error handling and preloading
 */
export const dynamicImport = async <T = any>(
  importFn: () => Promise<T>,
  componentName: string = 'Component'
): Promise<T> => {
  try {
    const start = performance.now();
    const module = await importFn();
    const loadTime = performance.now() - start;
    
    if (loadTime > 1000) {
      console.warn(`Slow import detected for ${componentName}: ${loadTime.toFixed(2)}ms`);
    }
    
    return module;
  } catch (error) {
    console.error(`Failed to load ${componentName}:`, error);
    throw error;
  }
};

/**
 * Preload component for faster subsequent loads
 */
export const preloadComponent = (importFn: () => Promise<any>) => {
  return importFn();
};

/**
 * Route-based code splitting helper
 */
export const createRoute = (
  path: string,
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  preload: boolean = false
) => {
  if (preload) {
    // Preload critical routes
    preloadComponent(importFn);
  }

  return {
    path,
    component: React.lazy(() => dynamicImport(importFn, path)),
  };
};

/**
 * Conditional component loading based on feature flags
 */
export const conditionalImport = async <T = any>(
  condition: boolean | (() => boolean),
  importFn: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> => {
  const shouldImport = typeof condition === 'function' ? condition() : condition;
  
  if (shouldImport) {
    return importFn();
  }
  
  return fallback;
};

/**
 * Monitor chunk loading performance
 */
class ChunkLoadMonitor {
  private static instance: ChunkLoadMonitor;
  private chunkLoads: Map<string, { duration: number; timestamp: number }> = new Map();

  static getInstance(): ChunkLoadMonitor {
    if (!ChunkLoadMonitor.instance) {
      ChunkLoadMonitor.instance = new ChunkLoadMonitor();
    }
    return ChunkLoadMonitor.instance;
  }

  recordChunkLoad(chunkName: string, duration: number) {
    this.chunkLoads.set(chunkName, {
      duration,
      timestamp: Date.now(),
    });

    // Keep only last 100 chunk loads
    if (this.chunkLoads.size > 100) {
      const firstKey = this.chunkLoads.keys().next().value;
      this.chunkLoads.delete(firstKey);
    }
  }

  getSlowChunks(threshold: number = 1000): string[] {
    return Array.from(this.chunkLoads.entries())
      .filter(([_, data]) => data.duration > threshold)
      .map(([name]) => name);
  }

  getStats() {
    const durations = Array.from(this.chunkLoads.values()).map(d => d.duration);
    
    return {
      totalChunks: this.chunkLoads.size,
      averageLoadTime: durations.reduce((a, b) => a + b, 0) / durations.length || 0,
      slowChunks: this.getSlowChunks(),
    };
  }
}

export const chunkLoadMonitor = ChunkLoadMonitor.getInstance();

/**
 * Prefetch resources for better performance
 */
export const prefetchResource = (url: string, type: 'script' | 'style' | 'image' = 'script') => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = type;
  link.href = url;
  document.head.appendChild(link);
};

/**
 * Preconnect to external domains
 */
export const preconnectDomain = (domain: string) => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = domain;
  document.head.appendChild(link);
};

/**
 * Image optimization helpers
 */
export const optimizeImage = {
  /**
   * Create srcset for responsive images
   */
  createSrcSet: (baseUrl: string, sizes: number[]): string => {
    return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
  },

  /**
   * Lazy load images with Intersection Observer
   */
  lazyLoad: (imageSelector: string = 'img[data-lazy]') => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.getAttribute('data-lazy');
            if (src) {
              img.src = src;
              img.removeAttribute('data-lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll(imageSelector).forEach(img => {
        imageObserver.observe(img);
      });

      return () => imageObserver.disconnect();
    }
  },
};

/**
 * CSS optimization - remove unused CSS dynamically
 */
export const removeUnusedStyles = (keepSelectors: string[] = []) => {
  if (typeof window === 'undefined') return;

  const allElements = document.querySelectorAll('*');
  const usedClasses = new Set<string>();

  allElements.forEach(element => {
    element.classList.forEach(className => {
      usedClasses.add(className);
    });
  });

  // This is a simplified version - in production you'd use PurgeCSS or similar
  console.log('Used CSS classes:', usedClasses.size);
  return usedClasses;
};

/**
 * Bundle analysis helper
 */
export const analyzeBundleSize = () => {
  if (typeof window === 'undefined') return null;

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  const analysis = {
    scripts: resources.filter(r => r.name.endsWith('.js')),
    styles: resources.filter(r => r.name.endsWith('.css')),
    images: resources.filter(r => /\.(png|jpg|jpeg|gif|webp|svg)$/.test(r.name)),
    total: resources.length,
  };

  const totalSize = resources.reduce((acc, r) => acc + (r.transferSize || 0), 0);
  const totalDuration = resources.reduce((acc, r) => acc + r.duration, 0);

  return {
    ...analysis,
    totalSize,
    totalSizeKB: (totalSize / 1024).toFixed(2),
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    totalDuration: totalDuration.toFixed(2),
    largestResources: resources
      .sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0))
      .slice(0, 10)
      .map(r => ({
        name: r.name,
        size: ((r.transferSize || 0) / 1024).toFixed(2) + ' KB',
        duration: r.duration.toFixed(2) + ' ms',
      })),
  };
};

// React import
import React from 'react';
