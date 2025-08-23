import { useState, useEffect } from 'react';

interface UseSSRCompatibleDataOptions<T> {
  fetchData: () => Promise<T>;
  fallbackData?: T;
  initialData?: T;
}

/**
 * Hook for SSR-compatible data fetching
 * - Initializes with fallback/initial data for SSR
 * - Fetches real data on client-side only
 * - Prevents loading screens during SSR
 */
export function useSSRCompatibleData<T>({
  fetchData,
  fallbackData,
  initialData
}: UseSSRCompatibleDataOptions<T>) {
  const [data, setData] = useState<T | undefined>(initialData || fallbackData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Initialize client state
  useEffect(() => {
    setIsClient(true);
    if (initialData) {
      setData(initialData);
    } else if (fallbackData) {
      setData(fallbackData);
    }
  }, [initialData, fallbackData]);

  // Fetch real data on client side only
  useEffect(() => {
    if (!isClient) return;

    const fetchRealData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchData();
        setData(result);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Keep fallback data on error
        if (fallbackData) {
          setData(fallbackData);
        }
      } finally {
        setLoading(false);
      }
    };

    // Small delay to prevent flashing
    const timer = setTimeout(fetchRealData, 100);
    return () => clearTimeout(timer);
  }, [isClient, fetchData, fallbackData]);

  return {
    data,
    loading: loading && isClient, // Only show loading on client side
    error,
    isClient,
    refetch: () => {
      if (isClient) {
        const timer = setTimeout(async () => {
          try {
            setLoading(true);
            setError(null);
            const result = await fetchData();
            setData(result);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
          } finally {
            setLoading(false);
          }
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  };
}