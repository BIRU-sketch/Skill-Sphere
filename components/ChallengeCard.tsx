import Link from 'next/link';
import { Challenge } from '@/types';
import { ROUTES } from '@/lib/constants';
import { formatDate, getRelativeTime } from '@/lib/utils/date';
import { FiUser, FiClock } from 'react-icons/fi';

interface ChallengeCardProps {
  challenge: Challenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 flex-1">
            {challenge.title}
          </h3>
          <DifficultyBadge difficulty={challenge.difficulty} />
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {challenge.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
            {challenge.category}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <FiUser className="w-4 h-4" />
            <span>{challenge.mentorName}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiClock className="w-4 h-4" />
            <span>{getRelativeTime(challenge.createdAt)}</span>
          </div>
        </div>

        <Link
          href={ROUTES.CHALLENGE_DETAIL(challenge.id)}
          className="block w-full text-center bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ml-2 ${colors[difficulty as keyof typeof colors]}`}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
}

