'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useMentorChallenges } from '@/hooks/useChallenge';
import { FiPlus, FiUsers, FiBook, FiCheckCircle } from 'react-icons/fi';
import { ROUTES } from '@/lib/constants';

export default function MentorDashboardPage() {
  const { user } = useUser();
  const { challenges, loading } = useMentorChallenges(user?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const totalChallenges = challenges.length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your challenges and review student submissions</p>
        </div>
        <Link
          href={ROUTES.CREATE_CHALLENGE}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          Create Challenge
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          icon={<FiBook className="w-8 h-8" />}
          title="Total Challenges"
          value={totalChallenges}
          color="blue"
        />
        <StatCard
          icon={<FiCheckCircle className="w-8 h-8" />}
          title="Active Challenges"
          value={activeChallenges.length}
          color="green"
        />
        <StatCard
          icon={<FiUsers className="w-8 h-8" />}
          title="Students Mentored"
          value={0}
          color="purple"
        />
      </div>

      {/* Challenges List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold">Your Challenges</h2>
        </div>
        {challenges.length > 0 ? (
          <div className="divide-y">
            {challenges.map(challenge => (
              <div key={challenge.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link
                      href={ROUTES.CHALLENGE_DETAIL(challenge.id)}
                      className="text-xl font-medium text-gray-900 hover:text-primary-600"
                    >
                      {challenge.title}
                    </Link>
                    <p className="text-gray-600 mt-1 line-clamp-2">{challenge.description}</p>
                    <div className="flex gap-4 mt-3">
                      <span className="text-sm text-gray-500">
                        Category: {challenge.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        Difficulty: <span className="capitalize">{challenge.difficulty}</span>
                      </span>
                      <span className={`text-sm font-medium ${
                        challenge.status === 'active' ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {challenge.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={ROUTES.CHALLENGE_DETAIL(challenge.id)}
                    className="ml-4 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <FiBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No Challenges Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first challenge to start mentoring students
            </p>
            <Link
              href={ROUTES.CREATE_CHALLENGE}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
            >
              <FiPlus className="w-5 h-5" />
              Create Challenge
            </Link>
          </div>
        )}
      </div>
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

