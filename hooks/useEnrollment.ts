'use client';

import { useState, useEffect } from 'react';
import { Enrollment } from '@/types';
import {
  getEnrollmentsByStudent,
  getEnrollmentsByChallenge,
  getEnrollmentByStudentAndChallenge,
} from '@/lib/firebase/enrollment-service';

/**
 * Hook to fetch student enrollments
 */
export function useStudentEnrollments(studentId: string | undefined) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEnrollments() {
      if (!studentId) return;

      try {
        setLoading(true);
        const data = await getEnrollmentsByStudent(studentId);
        setEnrollments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEnrollments();
  }, [studentId]);

  return { enrollments, loading, error };
}

/**
 * Hook to check if student is enrolled in a challenge
 */
export function useIsEnrolled(studentId: string | undefined, challengeId: string | undefined) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkEnrollment() {
      if (!studentId || !challengeId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getEnrollmentByStudentAndChallenge(studentId, challengeId);
        setEnrollment(data);
        setIsEnrolled(!!data);
      } catch (err: any) {
        console.error('Error checking enrollment:', err);
        setIsEnrolled(false);
      } finally {
        setLoading(false);
      }
    }

    checkEnrollment();
  }, [studentId, challengeId]);

  return { isEnrolled, enrollment, loading };
}

