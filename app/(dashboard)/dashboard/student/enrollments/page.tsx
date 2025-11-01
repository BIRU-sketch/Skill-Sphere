'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useStudentEnrollments } from '@/hooks/useEnrollment';
import { formatDate, getRelativeTime } from '@/lib/utils/date';
import { FiClock, FiCheckCircle, FiAlertCircle, FiXCircle, FiBook } from 'react-icons/fi';
import { ROUTES } from '@/lib/constants';

export default function StudentEnrollmentsPage() {
  const { user } = useUser();
  const { enrollments, loading } = useStudentEnrollments(user?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  const pending = enrollments.filter(e => e.status === 'enrolled');
  const active = enrollments.filter(e => e.status === 'in-progress');
  const submitted = enrollments.filter(e => e.status === 'submitted');
  const approved = enrollments.filter(e => e.status === 'approved');
  const rejected = enrollments.filter(e => e.status === 'rejected');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Enrolled Challenges</h1>
        <p className="text-gray-600 mt-2">Track all your challenge enrollments and their status</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-5 gap-4">
        <StatCard title="Pending Review" count={pending.length} color="yellow" icon="⏳" />
        <StatCard title="In Progress" count={active.length} color="blue" icon="🔄" />
        <StatCard title="Submitted" count={submitted.length} color="purple" icon="📤" />
        <StatCard title="Approved" count={approved.length} color="green" icon="✅" />
        <StatCard title="Rejected" count={rejected.length} color="red" icon="❌" />
      </div>

      {/* Pending Applications */}
      {pending.length > 0 && (
        <EnrollmentSection
          title="⏳ Pending Mentor Review"
          description="Your applications are waiting for mentor approval"
          enrollments={pending}
          statusColor="yellow"
        />
      )}

      {/* Active Challenges */}
      {active.length > 0 && (
        <EnrollmentSection
          title="🔄 Active Challenges"
          description="Challenges you're currently working on"
          enrollments={active}
          statusColor="blue"
        />
      )}

      {/* Submitted */}
      {submitted.length > 0 && (
        <EnrollmentSection
          title="📤 Submitted for Review"
          description="Your work is being reviewed by the mentor"
          enrollments={submitted}
          statusColor="purple"
        />
      )}

      {/* Approved */}
      {approved.length > 0 && (
        <EnrollmentSection
          title="✅ Approved & Completed"
          description="Congratulations! You've completed these challenges"
          enrollments={approved}
          statusColor="green"
        />
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <EnrollmentSection
          title="❌ Not Accepted"
          description="These applications were not approved by the mentor"
          enrollments={rejected}
          statusColor="red"
        />
      )}

      {/* Empty State */}
      {enrollments.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FiBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No Enrollments Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start your learning journey by applying to challenges
          </p>
          <Link
            href={ROUTES.CHALLENGES}
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
          >
            Browse Challenges
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  count,
  color,
  icon,
}: {
  title: string;
  count: number;
  color: string;
  icon: string;
}) {
  const colors = {
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div className={`border rounded-lg p-4 ${colors[color as keyof typeof colors]}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold">{count}</div>
      <div className="text-xs font-medium mt-1">{title}</div>
    </div>
  );
}

function EnrollmentSection({
  title,
  description,
  enrollments,
  statusColor,
}: {
  title: string;
  description: string;
  enrollments: any[];
  statusColor: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <div className="divide-y">
        {enrollments.map((enrollment) => (
          <Link
            key={enrollment.id}
            href={ROUTES.CHALLENGE_DETAIL(enrollment.challengeId)}
            className="block p-6 hover:bg-gray-50 transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {enrollment.challengeTitle}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FiClock className="w-4 h-4" />
                    Applied {getRelativeTime(enrollment.enrolledAt)}
                  </span>
                  {enrollment.submittedAt && (
                    <span className="flex items-center gap-1">
                      <FiCheckCircle className="w-4 h-4" />
                      Submitted {getRelativeTime(enrollment.submittedAt)}
                    </span>
                  )}
                </div>
                {enrollment.status === 'enrolled' && (
                  <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      ⏳ Your application is pending review by the mentor. You'll be notified once it's reviewed.
                    </p>
                  </div>
                )}
                {enrollment.status === 'rejected' && (
                  <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                      ❌ Your application was not accepted by the mentor. You can try applying to other challenges.
                    </p>
                  </div>
                )}
              </div>
              <div className="ml-4">
                <StatusBadge status={enrollment.status} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    enrolled: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '⏳' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', icon: '🔄' },
    submitted: { bg: 'bg-purple-100', text: 'text-purple-700', icon: '📤' },
    approved: { bg: 'bg-green-100', text: 'text-green-700', icon: '✅' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: '❌' },
  };

  const style = styles[status as keyof typeof styles] || styles.enrolled;

  return (
    <div className={`${style.bg} ${style.text} px-4 py-2 rounded-lg text-center min-w-[120px]`}>
      <div className="text-xl mb-1">{style.icon}</div>
      <div className="text-xs font-bold uppercase">
        {status.replace('-', ' ')}
      </div>
    </div>
  );
}

