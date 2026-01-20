import { useState, useEffect, useCallback } from 'react';
import { getAllSlops, getStats, SlopRecord } from '@/lib/db';

interface Stats {
  total: number;
  favorites: number;
  mostUsedMode: string | null;
}

interface UseSlopsReturn {
  slops: SlopRecord[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  favoritesOnly: boolean;
  setFavoritesOnly: (value: boolean) => void;
  stats: Stats;
}

export function useSlops(): UseSlopsReturn {
  const [slops, setSlops] = useState<SlopRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [stats, setStats] = useState<Stats>({ total: 0, favorites: 0, mostUsedMode: null });

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, statsData] = await Promise.all([
        getAllSlops(favoritesOnly),
        getStats()
      ]);
      setSlops(data);
      setStats(statsData);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to fetch slops'));
    } finally {
      setLoading(false);
    }
  }, [favoritesOnly]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { slops, loading, error, refresh, favoritesOnly, setFavoritesOnly, stats };
}
