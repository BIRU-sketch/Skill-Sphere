'use client';

import { useState, useEffect, useCallback } from 'react';
import { Portfolio } from '@/types';
import { getPortfolio } from '@/lib/firebase/portfolio-service';

/**
 * Hook to fetch student portfolio
 */
export function usePortfolio(studentId: string | undefined) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = useCallback(async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getPortfolio(studentId);
      setPortfolio(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return { portfolio, loading, error, refetch: fetchPortfolio };
}

