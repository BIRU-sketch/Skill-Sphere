'use client';

import { useState, useEffect } from 'react';
import { Portfolio } from '@/types';
import { getPortfolio } from '@/lib/firebase/portfolio-service';

/**
 * Hook to fetch student portfolio
 */
export function usePortfolio(studentId: string | undefined) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      if (!studentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getPortfolio(studentId);
        setPortfolio(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, [studentId]);

  return { portfolio, loading, error, refetch: fetchPortfolio };
}

