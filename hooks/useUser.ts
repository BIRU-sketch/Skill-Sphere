'use client';

import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to access current user data
 */
export function useUser() {
  const { user, firebaseUser, loading, error } = useAuth();

  return {
    user,
    firebaseUser,
    isAuthenticated: !!user,
    isMentor: user?.role === 'mentor',
    isStudent: user?.role === 'student',
    loading,
    error,
  };
}

