import { useState, useCallback } from 'react';

interface UseApiRequestOptions<T, P extends unknown[]> {
  onSuccess?: (data: T, args: P) => void;
  onError?: (error: Error) => void;
}

/**
 * A generic hook for handling API requests with loading and error states
 */
export function useApiRequest<T, P extends unknown[]>(
  apiFunction: (...args: P) => Promise<T>,
  options: UseApiRequestOptions<T, P> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: P) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result);
        options.onSuccess?.(result, args);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction, options]
  );

  return {
    execute,
    data,
    isLoading,
    error,
    setData
  };
} 