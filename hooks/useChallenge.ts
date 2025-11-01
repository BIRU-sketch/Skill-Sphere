'use client';

import { useState, useEffect } from 'react';
import { Challenge } from '@/types';
import {
  getChallenge,
  getActiveChallenges,
  getChallengesByMentor,
  getChallengesByCategory,
} from '@/lib/firebase/challenge-service';

/**
 * Hook to fetch a single challenge
 */
export function useChallenge(challengeId: string) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChallenge() {
      try {
        setLoading(true);
        const data = await getChallenge(challengeId);
        setChallenge(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (challengeId) {
      fetchChallenge();
    }
  }, [challengeId]);

  return { challenge, loading, error };
}

/**
 * Hook to fetch active challenges
 */
export function useActiveChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        setLoading(true);
        const data = await getActiveChallenges();
        setChallenges(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, []);

  return { challenges, loading, error, refetch: () => {} };
}

/**
 * Hook to fetch challenges by mentor
 */
export function useMentorChallenges(mentorId: string | undefined) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChallenges() {
      if (!mentorId) return;

      try {
        setLoading(true);
        const data = await getChallengesByMentor(mentorId);
        setChallenges(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, [mentorId]);

  return { challenges, loading, error };
}

