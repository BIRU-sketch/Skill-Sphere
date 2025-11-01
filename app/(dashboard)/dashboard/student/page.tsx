'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useStudentEnrollments } from '@/hooks/useEnrollment';
import { usePortfolio } from '@/hooks/usePortfolio';
import { FiAward, FiTrendingUp, FiBook } from 'react-icons/fi';
import { ROUTES } from '@/lib/constants';

export default function StudentDashboardPage() {
  const { user } = useUser();
  const { enrollments, loading: enrollmentsLoading } = useStudentEnrollments(user?.id);
  const { portfolio, loading: portfolioLoading } = usePortfolio(user?.id);

  if (enrollmentsLoading || portfolioLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  const activeEnrollments = enrollments.filter(e => 
    e.status === 'enrolled' || e.status === 'in-progress'
  );
  const completedChallenges = enrollments.filter(e => e.status === 'approved');

  return (
    <div className="space-y-8">
      {/* Header with Role Badge */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">Welcome back, {user?.displayName}!</h1>
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                Student
              </span>
            </div>
            <p className="text-blue-100">Track your progress and continue learning</p>
          </div>
          <Link
            href={ROUTES.CHALLENGES}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition font-semibold"
          >
            Browse Challenges
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          icon={<FiBook className="w-8 h-8" />}
          title="Active Challenges"
          value={activeEnrollments.length}
          color="blue"
        />
        <StatCard
          icon={<FiTrendingUp className="w-8 h-8" />}
          title="Completed"
          value={completedChallenges.length}
          color="green"
        />
        <StatCard
          icon={<FiAward className="w-8 h-8" />}
          title="Certificates"
          value={portfolio?.certificateCount || 0}
          color="purple"
        />
      </div>

      {/* Active Challenges */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Active Challenges</h2>
          <Link
            href={ROUTES.CHALLENGES}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Browse More →
          </Link>
        </div>
        {activeEnrollments.length > 0 ? (
          <div className="space-y-4">
            {activeEnrollments.slice(0, 5).map(enrollment => (
              <div
                key={enrollment.id}
                className="border-l-4 border-primary-500 pl-4 py-2"
              >
                <Link
                  href={ROUTES.CHALLENGE_DETAIL(enrollment.challengeId)}
                  className="font-medium text-gray-900 hover:text-primary-600"
                >
                  {enrollment.challengeTitle}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  Status: <span className="capitalize">{enrollment.status}</span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            You haven't enrolled in any challenges yet.{' '}
            <Link href={ROUTES.CHALLENGES} className="text-primary-600 hover:underline">
              Start learning now!
            </Link>
          </p>
        )}
      </div>

      {/* Recent Certificates */}
      {portfolio && portfolio.certificateCount > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Recent Achievements</h2>
            <Link
              href={ROUTES.CERTIFICATES}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {portfolio.completedChallenges.slice(0, 4).map((challenge) => (
              <div
                key={challenge.certificateId}
                className="border rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-start gap-3">
                  <FiAward className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">{challenge.challengeTitle}</h3>
                    <p className="text-sm text-gray-500 mt-1">{challenge.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: 'blue' | 'green' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}

