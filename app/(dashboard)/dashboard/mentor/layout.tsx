'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { ROUTES } from '@/lib/constants';

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isMentor, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !isMentor) {
      // Redirect non-mentors to their appropriate dashboard
      router.push(ROUTES.STUDENT_DASHBOARD);
    }
  }, [user, isMentor, loading, router]);

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

  if (!isMentor) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Mentor Access Only
          </h2>
          <p className="text-gray-600 mb-6">
            This area is restricted to mentors only. You are signed in as a {user.role}.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

