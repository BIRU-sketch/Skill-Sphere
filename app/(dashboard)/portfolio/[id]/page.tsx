'use client';

import { useParams } from 'next/navigation';
import { usePortfolio } from '@/hooks/usePortfolio';
import { FiAward, FiMail, FiCalendar } from 'react-icons/fi';
import { formatDate } from '@/lib/utils/date';

export default function PortfolioPage() {
  const params = useParams();
  const studentId = params.id as string;
  const { portfolio, loading } = usePortfolio(studentId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Portfolio not found</h2>
        <p className="text-gray-600 mt-2">This student hasn't completed any challenges yet.</p>
      </div>
    );
  }

  if (!portfolio.isPublic) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Portfolio is Private</h2>
        <p className="text-gray-600 mt-2">This portfolio is not publicly visible.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg shadow-lg p-8">
        <div className="flex items-start gap-6">
          {portfolio.photoURL && (
            <img
              src={portfolio.photoURL}
              alt={portfolio.studentName}
              className="w-24 h-24 rounded-full border-4 border-white"
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{portfolio.studentName}</h1>
            <p className="text-primary-100 mb-4">{portfolio.bio}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <FiMail /> {portfolio.email}
              </span>
              <span className="flex items-center gap-1">
                <FiAward /> {portfolio.certificateCount} Certificates
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      {portfolio.skills && portfolio.skills.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {portfolio.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Completed Challenges */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">Completed Challenges</h2>
        {portfolio.completedChallenges.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {portfolio.completedChallenges.map((challenge) => (
              <div
                key={challenge.certificateId}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <FiAward className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {challenge.challengeTitle}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{challenge.category}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FiCalendar className="w-3 h-3" />
                      <span>Completed {formatDate(challenge.completedAt, 'PP')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No completed challenges yet.
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {portfolio.completedChallenges.length}
          </div>
          <div className="text-gray-600">Challenges Completed</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold text-secondary-600 mb-2">
            {portfolio.certificateCount}
          </div>
          <div className="text-gray-600">Certificates Earned</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {portfolio.totalPoints}
          </div>
          <div className="text-gray-600">Total Points</div>
        </div>
      </div>
    </div>
  );
}

