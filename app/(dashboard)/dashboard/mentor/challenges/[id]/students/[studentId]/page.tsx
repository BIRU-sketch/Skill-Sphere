'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useChallenge } from '@/hooks/useChallenge';
import { getEnrollmentByStudentAndChallenge, updateEnrollmentStatus } from '@/lib/firebase/enrollment-service';
import { Enrollment } from '@/types';
import { formatDate } from '@/lib/utils/date';
import { FiArrowLeft, FiUser, FiMail, FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function StudentApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.id as string;
  const studentId = params.studentId as string;
  const { challenge, loading: challengeLoading } = useChallenge(challengeId);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchEnrollment() {
      try {
        setLoading(true);
        const data = await getEnrollmentByStudentAndChallenge(studentId, challengeId);
        setEnrollment(data);
      } catch (error) {
        console.error('Error fetching enrollment:', error);
      } finally {
        setLoading(false);
      }
    }

    if (challengeId && studentId) {
      fetchEnrollment();
    }
  }, [challengeId, studentId]);

  const handleStatusUpdate = async (newStatus: Enrollment['status']) => {
    if (!enrollment) return;

    try {
      setUpdating(true);
      await updateEnrollmentStatus(enrollment.id, newStatus);
      toast.success(`Status updated to ${newStatus}!`);
      setEnrollment({ ...enrollment, status: newStatus });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (challengeLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!challenge || !enrollment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Application not found</h2>
        <Link
          href={`/dashboard/mentor/challenges/${challengeId}`}
          className="text-primary-600 hover:text-primary-700 mt-4 inline-block"
        >
          ← Back to challenge
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        href={`/dashboard/mentor/challenges/${challengeId}`}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back to Students List</span>
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Student Application</h1>
            <p className="text-gray-600">{challenge.title}</p>
          </div>
          <div>
            <StatusBadge status={enrollment.status} />
          </div>
        </div>

        {/* Student Info */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="bg-primary-100 p-3 rounded-full">
            <FiUser className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{enrollment.studentName}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <FiMail className="w-4 h-4" />
                {enrollment.studentEmail}
              </span>
              <span className="flex items-center gap-1">
                <FiCalendar className="w-4 h-4" />
                Applied {formatDate(enrollment.enrolledAt, 'PPP')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Application Essay */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">📝 Application Essay</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {enrollment.applicationEssay}
          </p>
        </div>
      </div>

      {/* Why Join */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">💡 Why Join This Challenge?</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {enrollment.whyJoin}
          </p>
        </div>
      </div>

      {/* Experience */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">🎯 Relevant Experience</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {enrollment.experience}
          </p>
        </div>
      </div>

      {/* Actions */}
      {enrollment.status === 'enrolled' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Review Application</h2>
          <div className="flex gap-4">
            <button
              onClick={() => handleStatusUpdate('in-progress')}
              disabled={updating}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              <FiCheckCircle className="w-5 h-5" />
              {updating ? 'Updating...' : 'Approve & Start'}
            </button>
            <button
              onClick={() => handleStatusUpdate('rejected')}
              disabled={updating}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              <FiXCircle className="w-5 h-5" />
              {updating ? 'Updating...' : 'Reject Application'}
            </button>
          </div>
        </div>
      )}

      {/* Status History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Status History</h2>
        <div className="space-y-3">
          <TimelineItem
            title="Application Submitted"
            date={enrollment.enrolledAt}
            status="completed"
          />
          {enrollment.submittedAt && (
            <TimelineItem
              title="Work Submitted"
              date={enrollment.submittedAt}
              status="completed"
            />
          )}
          {enrollment.reviewedAt && (
            <TimelineItem
              title="Reviewed"
              date={enrollment.reviewedAt}
              status="completed"
            />
          )}
        </div>
      </div>
    </div>
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
    <span className={`px-4 py-2 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
      {status.replace('-', ' ').toUpperCase()}
    </span>
  );
}

function TimelineItem({
  title,
  date,
  status,
}: {
  title: string;
  date: any;
  status: 'completed' | 'pending';
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-3 h-3 rounded-full mt-1.5 ${
          status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
        }`}
      />
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{formatDate(date, 'PPP p')}</p>
      </div>
    </div>
  );
}

