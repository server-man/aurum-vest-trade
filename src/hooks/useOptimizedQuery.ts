/**
 * Optimized React Query hooks with memory leak prevention
 */

import { useQuery, useMutation, UseQueryOptions, UseMutationOptions, QueryKey } from '@tanstack/react-query';
import { useIsMounted } from '@/lib/memoryLeakPrevention';
import { useEffect, useRef } from 'react';

/**
 * Optimized useQuery with automatic cleanup and memory leak prevention
 */
export function useOptimizedQuery<
  TData = unknown,
  TError = Error,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: (context: any) => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
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
    queryKey,
    queryFn: async (context) => {
      return queryFn({
        ...context,
        signal: abortControllerRef.current?.signal,
      });
    },
    enabled: options?.enabled !== false && isMounted.current,
    ...options,
  } as UseQueryOptions<TData, TError>);
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

  const query = useOptimizedQuery<TData>(
    [...queryKey, page.current],
    () => queryFn(page.current),
    {
      placeholderData: (previousData: any) => previousData,
    }
  );

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
