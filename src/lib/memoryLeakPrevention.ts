/**
 * Memory leak prevention utilities
 */

import { useEffect, useRef } from 'react';

/**
 * Hook to safely manage event listeners with automatic cleanup
 */
export const useSafeEventListener = <K extends keyof WindowEventMap>(
  event: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
) => {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: WindowEventMap[K]) => savedHandler.current(event);
    
    window.addEventListener(event, eventListener, options);
    
    return () => {
      window.removeEventListener(event, eventListener, options);
    };
  }, [event, options]);
};

/**
 * Hook to safely manage intervals with automatic cleanup
 */
export const useSafeInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
};

/**
 * Hook to safely manage timeouts with automatic cleanup
 */
export const useSafeTimeout = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    timeoutRef.current = setTimeout(() => savedCallback.current(), delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay]);

  const clear = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return { clear };
};

/**
 * Hook to track component mount status (prevents state updates on unmounted components)
 */
export const useIsMounted = () => {
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef;
};

/**
 * Safe async state setter that checks if component is mounted
 */
export const useSafeAsyncState = <T>(initialState: T): [T, (value: T | ((prev: T) => T)) => void] => {
  const [state, setState] = React.useState<T>(initialState);
  const isMounted = useIsMounted();

  const setSafeState = (value: T | ((prev: T) => T)) => {
    if (isMounted.current) {
      setState(value);
    }
  };

  return [state, setSafeState];
};

/**
 * Cleanup manager for subscriptions and resources
 */
export class CleanupManager {
  private cleanupFunctions: (() => void)[] = [];

  add(cleanup: () => void) {
    this.cleanupFunctions.push(cleanup);
  }

  cleanup() {
    this.cleanupFunctions.forEach(fn => {
      try {
        fn();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    });
    this.cleanupFunctions = [];
  }
}

/**
 * Hook to manage cleanup functions
 */
export const useCleanupManager = () => {
  const managerRef = useRef(new CleanupManager());

  useEffect(() => {
    return () => {
      managerRef.current.cleanup();
    };
  }, []);

  return managerRef.current;
};

/**
 * Hook for managing WebSocket connections with cleanup
 */
export const useSafeWebSocket = (url: string, options?: {
  onOpen?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
}) => {
  const wsRef = useRef<WebSocket | null>(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    if (options?.onOpen) {
      ws.addEventListener('open', options.onOpen);
    }
    
    if (options?.onMessage) {
      ws.addEventListener('message', (event) => {
        if (isMounted.current) {
          options.onMessage?.(event);
        }
      });
    }
    
    if (options?.onError) {
      ws.addEventListener('error', options.onError);
    }
    
    if (options?.onClose) {
      ws.addEventListener('close', options.onClose);
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [url]);

  return wsRef;
};

/**
 * Debounced value hook with cleanup
 */
export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * AbortController hook for cancelling fetch requests
 */
export const useAbortController = () => {
  const abortControllerRef = useRef<AbortController>();

  useEffect(() => {
    abortControllerRef.current = new AbortController();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return abortControllerRef.current;
};

// React import for hooks
import React from 'react';
