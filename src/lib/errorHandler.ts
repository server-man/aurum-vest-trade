import { toast } from 'sonner';
import { monitoring } from './monitoring';

/**
 * Global error handler for the application
 */

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

export class ValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Handle application errors globally
 */
export function handleError(error: unknown, context?: string): void {
  console.error(`Error in ${context || 'application'}:`, error);

  let message = 'An unexpected error occurred';
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';

  if (error instanceof ValidationError) {
    message = error.message;
    severity = 'low';
    toast.error(message);
  } else if (error instanceof AuthenticationError) {
    message = 'Please log in to continue';
    severity = 'medium';
    toast.error(message);
  } else if (error instanceof AuthorizationError) {
    message = 'You do not have permission to perform this action';
    severity = 'medium';
    toast.error(message);
  } else if (error instanceof NetworkError) {
    message = 'Network connection error. Please check your internet connection.';
    severity = 'high';
    toast.error(message);
  } else if (error instanceof Error) {
    message = error.message || message;
    toast.error(message);
  } else {
    toast.error(message);
  }

  // Log to monitoring service
  monitoring.logError({
    message,
    stack: error instanceof Error ? error.stack : undefined,
    severity,
    context: { context, errorType: error instanceof Error ? error.name : typeof error }
  });
}

/**
 * Handle Supabase errors
 */
export function handleSupabaseError(error: any, context?: string): void {
  console.error(`Supabase error in ${context}:`, error);

  let message = 'Database operation failed';
  
  if (error?.message) {
    // Parse common Supabase errors
    if (error.message.includes('JWT')) {
      message = 'Session expired. Please log in again.';
    } else if (error.message.includes('duplicate')) {
      message = 'This record already exists';
    } else if (error.message.includes('foreign key')) {
      message = 'Cannot delete: related records exist';
    } else if (error.message.includes('permission')) {
      message = 'Permission denied';
    } else {
      message = error.message;
    }
  }

  toast.error(message);

  monitoring.logError({
    message: `Supabase: ${message}`,
    severity: 'high',
    context: { context, code: error?.code, details: error?.details }
  });
}

/**
 * Wrap async functions with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context);
      throw error;
    }
  }) as T;
}

/**
 * Retry failed operations with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}
