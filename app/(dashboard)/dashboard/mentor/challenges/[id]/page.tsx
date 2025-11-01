'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useChallenge } from '@/hooks/useChallenge';
import { getEnrollmentsByChallenge } from '@/lib/firebase/enrollment-service';
import { Enrollment } from '@/types';
import { formatDate } from '@/lib/utils/date';
import { FiUser, FiMail, FiCalendar, FiEye } from 'react-icons/fi';
import { ROUTES } from '@/lib/constants';

export default function MentorChallengeDetailPage() {
  const params = useParams();
  const challengeId = params.id as string;
  const { challenge, loading: challengeLoading } = useChallenge(challengeId);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        setLoading(true);
        const data = await getEnrollmentsByChallenge(challengeId);
        setEnrollments(data);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setLoading(false);
      }
    }

    if (challengeId) {
      fetchEnrollments();
    }
  }, [challengeId]);

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (filter === 'all') return true;
    return enrollment.status === filter;
  });

  const stats = {
    total: enrollments.length,
    enrolled: enrollments.filter(e => e.status === 'enrolled').length,
    inProgress: enrollments.filter(e => e.status === 'in-progress').length,
    submitted: enrollments.filter(e => e.status === 'submitted').length,
    approved: enrollments.filter(e => e.status === 'approved').length,
  };

  if (challengeLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Challenge not found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Challenge Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{challenge.title}</h1>
            <p className="text-gray-600">{challenge.category} • {challenge.difficulty}</p>
          </div>
          <Link
            href={ROUTES.CHALLENGE_DETAIL(challengeId)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View Public Page →
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-5 gap-4">
        <StatCard title="Total Students" value={stats.total} color="blue" />
        <StatCard title="Enrolled" value={stats.enrolled} color="purple" />
        <StatCard title="In Progress" value={stats.inProgress} color="yellow" />
        <StatCard title="Submitted" value={stats.submitted} color="orange" />
        <StatCard title="Approved" value={stats.approved} color="green" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2 flex-wrap">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
            All ({stats.total})
          </FilterButton>
          <FilterButton active={filter === 'enrolled'} onClick={() => setFilter('enrolled')}>
            Enrolled ({stats.enrolled})
          </FilterButton>
          <FilterButton active={filter === 'in-progress'} onClick={() => setFilter('in-progress')}>
            In Progress ({stats.inProgress})
          </FilterButton>
          <FilterButton active={filter === 'submitted'} onClick={() => setFilter('submitted')}>
            Submitted ({stats.submitted})
          </FilterButton>
          <FilterButton active={filter === 'approved'} onClick={() => setFilter('approved')}>
            Approved ({stats.approved})
          </FilterButton>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Enrolled Students</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredEnrollments.length} student{filteredEnrollments.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filteredEnrollments.length > 0 ? (
          <div className="divide-y">
            {filteredEnrollments.map(enrollment => (
              <Link
                key={enrollment.id}
                href={`/dashboard/mentor/challenges/${challengeId}/students/${enrollment.studentId}`}
                className="block p-6 hover:bg-gray-50 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary-100 p-2 rounded-full">
                        <FiUser className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{enrollment.studentName}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <FiMail className="w-4 h-4" />
                            {enrollment.studentEmail}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiCalendar className="w-4 h-4" />
                            {formatDate(enrollment.enrolledAt, 'PP')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-11">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {enrollment.applicationEssay}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <StatusBadge status={enrollment.status} />
                    <button className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium">
                      <FiEye className="w-4 h-4" />
                      View Application
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <FiUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No students yet
            </h3>
            <p className="text-gray-600">
              Students will appear here once they enroll in your challenge
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className={`text-3xl font-bold ${colors[color as keyof typeof colors]}`}>{value}</p>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
        active
          ? 'bg-primary-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    enrolled: 'bg-purple-100 text-purple-700',
    'in-progress': 'bg-yellow-100 text-yellow-700',
    submitted: 'bg-orange-100 text-orange-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
      {status.replace('-', ' ').toUpperCase()}
    </span>
  );
}

