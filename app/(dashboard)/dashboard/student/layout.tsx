'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { ROUTES } from '@/lib/constants';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isStudent, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !isStudent) {
      // Redirect non-students to their appropriate dashboard
      router.push(ROUTES.MENTOR_DASHBOARD);
    }
  }, [user, isStudent, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isStudent) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Student Access Only
          </h2>
          <p className="text-gray-600 mb-6">
            This area is restricted to students only. You are signed in as a {user.role}.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

