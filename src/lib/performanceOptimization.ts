/**
 * Performance optimization utilities
 */

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoize function results for better performance
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    
    // Prevent memory leaks - limit cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  }) as T;
}

/**
 * RequestAnimationFrame-based throttle for smooth animations
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    if (rafId !== null) {
      return;
    }
    
    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
}

/**
 * Idle callback wrapper for non-critical tasks
 */
export function runWhenIdle(
  callback: () => void,
  options?: IdleRequestOptions
): number {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  
  // Fallback for browsers that don't support requestIdleCallback
  return setTimeout(callback, 1) as unknown as number;
}

/**
 * Cancel idle callback
 */
export function cancelIdleCallback(id: number): void {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Batch DOM updates for better performance
 */
export class DOMBatchUpdater {
  private updates: (() => void)[] = [];
  private rafId: number | null = null;

  add(update: () => void) {
    this.updates.push(update);
    this.scheduleFlush();
  }

  private scheduleFlush() {
    if (this.rafId !== null) {
      return;
    }

    this.rafId = requestAnimationFrame(() => {
      this.flush();
    });
  }

  private flush() {
    this.updates.forEach(update => update());
    this.updates = [];
    this.rafId = null;
  }

  cancel() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.updates = [];
  }
}

/**
 * Virtual scroll helper for long lists
 */
export class VirtualScrollHelper {
  private containerHeight: number;
  private itemHeight: number;
  private totalItems: number;
  private overscan: number;

  constructor(
    containerHeight: number,
    itemHeight: number,
    totalItems: number,
    overscan: number = 3
  ) {
    this.containerHeight = containerHeight;
    this.itemHeight = itemHeight;
    this.totalItems = totalItems;
    this.overscan = overscan;
  }

  getVisibleRange(scrollTop: number): { start: number; end: number } {
    const visibleStart = Math.floor(scrollTop / this.itemHeight);
    const visibleEnd = Math.ceil(
      (scrollTop + this.containerHeight) / this.itemHeight
    );

    const start = Math.max(0, visibleStart - this.overscan);
    const end = Math.min(this.totalItems, visibleEnd + this.overscan);

    return { start, end };
  }

  getTotalHeight(): number {
    return this.totalItems * this.itemHeight;
  }

  getOffsetForIndex(index: number): number {
    return index * this.itemHeight;
  }
}

/**
 * Intersection Observer wrapper for lazy loading
 */
export class LazyLoadObserver {
  private observer: IntersectionObserver;
  private callbacks: Map<Element, () => void>;

  constructor(options?: IntersectionObserverInit) {
    this.callbacks = new Map();
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const callback = this.callbacks.get(entry.target);
          if (callback) {
            callback();
            this.unobserve(entry.target);
          }
        }
      });
    }, options);
  }

  observe(element: Element, callback: () => void) {
    this.callbacks.set(element, callback);
    this.observer.observe(element);
  }

  unobserve(element: Element) {
    this.callbacks.delete(element);
    this.observer.unobserve(element);
  }

  disconnect() {
    this.observer.disconnect();
    this.callbacks.clear();
  }
}

/**
 * Web Worker wrapper for CPU-intensive tasks
 */
export class WorkerPool {
  private workers: Worker[] = [];
  private queue: Array<{
    data: any;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor(workerScript: string, poolSize: number = navigator.hardwareConcurrency || 4) {
    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerScript);
      worker.onmessage = (e) => this.handleWorkerMessage(e, worker);
      worker.onerror = (e) => this.handleWorkerError(e, worker);
      this.workers.push(worker);
    }
  }

  private handleWorkerMessage(e: MessageEvent, worker: Worker) {
    const task = this.queue.shift();
    if (task) {
      task.resolve(e.data);
      this.processQueue(worker);
    }
  }

  private handleWorkerError(e: ErrorEvent, worker: Worker) {
    const task = this.queue.shift();
    if (task) {
      task.reject(e.error);
      this.processQueue(worker);
    }
  }

  private processQueue(worker: Worker) {
    const task = this.queue.shift();
    if (task) {
      worker.postMessage(task.data);
    }
  }

  execute<T = any>(data: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ data, resolve, reject });
      
      const availableWorker = this.workers.find(() => this.queue.length > 0);
      if (availableWorker) {
        this.processQueue(availableWorker);
      }
    });
  }

  terminate() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.queue = [];
  }
}

/**
 * Performance mark helpers
 */
export const performanceMark = {
  start: (name: string) => {
    performance.mark(`${name}-start`);
  },
  
  end: (name: string) => {
    performance.mark(`${name}-end`);
    try {
      performance.measure(name, `${name}-start`, `${name}-end`);
      const measure = performance.getEntriesByName(name)[0];
      return measure.duration;
    } catch (e) {
      return 0;
    }
  },
  
  clear: (name: string) => {
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);
  },
};
