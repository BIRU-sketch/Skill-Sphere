'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChallenge } from '@/hooks/useChallenge';
import { useUser } from '@/hooks/useUser';
import { useIsEnrolled } from '@/hooks/useEnrollment';
import { enrollInChallenge } from '@/lib/firebase/enrollment-service';
import { toast } from 'react-toastify';
import { FiClock, FiUser, FiAward, FiCheckCircle } from 'react-icons/fi';
import { formatDate } from '@/lib/utils/date';
import EnrollmentApplicationForm from '@/components/EnrollmentApplicationForm';

export default function ChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.id as string;
  const { user, isStudent } = useUser();
  const { challenge, loading } = useChallenge(challengeId);
  const { isEnrolled, enrollment, loading: enrollmentLoading } = useIsEnrolled(
    user?.id,
    challengeId
  );
  const [enrolling, setEnrolling] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const handleEnrollClick = () => {
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = async (applicationData: any) => {
    if (!user || !challenge) return;

    try {
      setEnrolling(true);
      await enrollInChallenge(
        challenge.id,
        challenge.title,
        user.id,
        user.displayName,
        user.email,
        applicationData
      );
      toast.success('Application submitted successfully! The mentor will review your enrollment.');
      setShowApplicationForm(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading || enrollmentLoading) {
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{challenge.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <FiUser /> {challenge.mentorName}
              </span>
              <span className="flex items-center gap-1">
                <FiClock /> {formatDate(challenge.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className={`px-3 py-1 text-xs font-medium rounded ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty.toUpperCase()}
            </span>
            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded text-center">
              {challenge.category}
            </span>
          </div>
        </div>

        {isStudent && (
          <div className="mt-6">
            {isEnrolled ? (
              <div className="flex items-center gap-2 text-green-600">
                <FiCheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  You are enrolled - Status: {enrollment?.status}
                </span>
              </div>
            ) : (
              <button
                onClick={handleEnrollClick}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition"
              >
                Apply to Challenge
              </button>
            )}
          </div>
        )}
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && challenge && (
        <EnrollmentApplicationForm
          challengeTitle={challenge.title}
          onSubmit={handleApplicationSubmit}
          onCancel={() => setShowApplicationForm(false)}
          isSubmitting={enrolling}
        />
      )}

      {/* Description */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold mb-4">Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{challenge.description}</p>
      </div>

      {/* Requirements */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
        <ul className="space-y-2">
          {challenge.requirements.map((req, index) => (
            <li key={index} className="flex items-start gap-2">
              <FiCheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Learning Outcomes */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold mb-4">Learning Outcomes</h2>
        <ul className="space-y-2">
          {challenge.learningOutcomes.map((outcome, index) => (
            <li key={index} className="flex items-start gap-2">
              <FiAward className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{outcome}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Resources */}
      {challenge.resources && challenge.resources.length > 0 && (
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold mb-4">Resources</h2>
          <ul className="space-y-2">
            {challenge.resources.map((resource, index) => (
              <li key={index}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {resource.title} →
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function getDifficultyColor(difficulty: string) {
  const colors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };
  return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-700';
}

