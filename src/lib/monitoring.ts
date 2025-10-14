/**
 * Application monitoring and error tracking utilities
 */

export interface ErrorInfo {
  message: string;
  stack?: string;
  component?: string;
  url?: string;
  timestamp: number;
  userId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp: number;
}

class MonitoringService {
  private static instance: MonitoringService;
  private errors: ErrorInfo[] = [];
  private events: AnalyticsEvent[] = [];
  private isProduction = import.meta.env.PROD;
  private userId?: string;

  private constructor() {
    this.setupErrorHandlers();
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  /**
   * Set current user for error tracking
   */
  setUser(userId: string) {
    this.userId = userId;
  }

  /**
   * Setup global error handlers
   */
  private setupErrorHandlers() {
    // Catch unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        severity: 'high',
        context: {
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        severity: 'high',
        context: {
          type: 'unhandledrejection',
          reason: event.reason
        }
      });
    });

    // React error boundary support
    (window as any).__AURUM_VEST_ERROR_HANDLER__ = (error: Error, errorInfo: any) => {
      this.logError({
        message: error.message,
        stack: error.stack,
        component: errorInfo.componentStack,
        severity: 'medium',
        context: errorInfo
      });
    };
  }

  /**
   * Log application error
   */
  logError(error: Omit<ErrorInfo, 'timestamp' | 'userId'>) {
    const errorInfo: ErrorInfo = {
      ...error,
      timestamp: Date.now(),
      userId: this.userId
    };

    this.errors.push(errorInfo);

    // Keep only last 100 errors in memory
    if (this.errors.length > 100) {
      this.errors.shift();
    }

    // Console log in development
    if (!this.isProduction) {
      console.error('Application Error:', errorInfo);
    }

    // Send to external service in production
    if (this.isProduction) {
      this.sendErrorToService(errorInfo);
    }
  }

  /**
   * Track analytics event
   */
  trackEvent(name: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name,
      properties,
      userId: this.userId,
      timestamp: Date.now()
    };

    this.events.push(event);

    // Keep only last 1000 events in memory
    if (this.events.length > 1000) {
      this.events.shift();
    }

    // Console log in development
    if (!this.isProduction) {
      console.log('Analytics Event:', event);
    }

    // Send to analytics service
    this.sendEventToService(event);
  }

  /**
   * Track page view
   */
  trackPageView(page: string, properties?: Record<string, any>) {
    this.trackEvent('page_view', {
      page,
      url: window.location.href,
      referrer: document.referrer,
      ...properties
    });
  }

  /**
   * Track user action
   */
  trackAction(action: string, properties?: Record<string, any>) {
    this.trackEvent('user_action', {
      action,
      ...properties
    });
  }

  /**
   * Send error to external service
   */
  private async sendErrorToService(error: ErrorInfo) {
    try {
      // Example: Send to custom endpoint
      if (this.isProduction) {
        await fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(error)
        });
      }
    } catch (e) {
      console.error('Failed to send error to monitoring service:', e);
    }
  }

  /**
   * Send event to analytics service
   */
  private async sendEventToService(event: AnalyticsEvent) {
    try {
      // Example Google Analytics 4 implementation
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', event.name, {
          ...event.properties,
          user_id: event.userId
        });
      }

      // Example: Send to custom analytics endpoint
      if (this.isProduction) {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        });
      }
    } catch (e) {
      console.error('Failed to send event to analytics service:', e);
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);
    const last1h = now - (60 * 60 * 1000);

    const recent = this.errors.filter(e => e.timestamp > last24h);
    const critical = recent.filter(e => e.severity === 'critical');
    const hourly = this.errors.filter(e => e.timestamp > last1h);

    return {
      total: this.errors.length,
      last24h: recent.length,
      lastHour: hourly.length,
      critical: critical.length,
      byComponent: this.groupBy(recent, 'component'),
      bySeverity: this.groupBy(recent, 'severity')
    };
  }

  /**
   * Health check status
   */
  getHealthStatus() {
    const errorStats = this.getErrorStats();
    const criticalErrors = errorStats.critical;
    const recentErrors = errorStats.lastHour;
    
    let status: 'healthy' | 'warning' | 'error' = 'healthy';
    
    if (criticalErrors > 0) {
      status = 'error';
    } else if (recentErrors > 10) {
      status = 'warning';
    }
    
    return {
      status,
      criticalErrors,
      recentErrors,
      uptime: performance.now(),
      timestamp: Date.now()
    };
  }

  /**
   * Utility: Group array by key
   */
  private groupBy<T>(array: T[], key: keyof T): Record<string, number> {
    return array.reduce((acc, item) => {
      const value = String(item[key] || 'unknown');
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Clear stored data
   */
  clear() {
    this.errors.length = 0;
    this.events.length = 0;
  }
}

// Export singleton instance
export const monitoring = MonitoringService.getInstance();
