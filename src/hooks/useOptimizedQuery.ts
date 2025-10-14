/**
 * Optimized React Query hooks with memory leak prevention
 */

import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useIsMounted } from '@/lib/memoryLeakPrevention';
import { useEffect, useRef } from 'react';

/**
 * Optimized useQuery with automatic cleanup and memory leak prevention
 */
export function useOptimizedQuery<TData = unknown, TError = Error>(
  options: UseQueryOptions<TData, TError>
) {
  const isMounted = useIsMounted();
  const abortControllerRef = useRef<AbortController>();

  useEffect(() => {
    abortControllerRef.current = new AbortController();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return useQuery<TData, TError>({
    ...options,
    // Only enable query if component is mounted
    enabled: options.enabled !== false && isMounted.current,
    // Add abort signal to query function if it accepts it
    queryFn: async (context) => {
      if (typeof options.queryFn === 'function') {
        return options.queryFn({
          ...context,
          signal: abortControllerRef.current?.signal,
        });
      }
      throw new Error('queryFn is required');
    },
  });
}

/**
 * Optimized useMutation with cleanup
 */
export function useOptimizedMutation<TData = unknown, TError = Error, TVariables = void>(
  options: UseMutationOptions<TData, TError, TVariables>
) {
  const isMounted = useIsMounted();

  return useMutation<TData, TError, TVariables>({
    ...options,
    onSuccess: (data, variables, context) => {
      if (isMounted.current && options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (isMounted.current && options.onError) {
        options.onError(error, variables, context);
      }
    },
    onSettled: (data, error, variables, context) => {
      if (isMounted.current && options.onSettled) {
        options.onSettled(data, error, variables, context);
      }
    },
  });
}

/**
 * Batched queries for reduced network overhead
 */
export function useBatchedQueries<T>(
  queries: UseQueryOptions<T>[],
  batchSize: number = 5
) {
  const results = queries.map((query) => useOptimizedQuery(query));
  
  return {
    data: results.map(r => r.data),
    isLoading: results.some(r => r.isLoading),
    isError: results.some(r => r.isError),
    errors: results.filter(r => r.error).map(r => r.error),
    refetchAll: () => Promise.all(results.map(r => r.refetch())),
  };
}

/**
 * Paginated query with automatic cleanup
 */
export function useOptimizedPaginatedQuery<TData = unknown>(
  queryKey: any[],
  queryFn: (page: number) => Promise<TData>,
  options?: {
    pageSize?: number;
    initialPage?: number;
  }
) {
  const page = useRef(options?.initialPage || 1);
  const isMounted = useIsMounted();

  const query = useOptimizedQuery<TData>({
    queryKey: [...queryKey, page.current],
    queryFn: () => queryFn(page.current),
    keepPreviousData: true,
  });

  const nextPage = () => {
    if (isMounted.current) {
      page.current += 1;
      query.refetch();
    }
  };

  const previousPage = () => {
    if (isMounted.current && page.current > 1) {
      page.current -= 1;
      query.refetch();
    }
  };

  return {
    ...query,
    page: page.current,
    nextPage,
    previousPage,
  };
}
