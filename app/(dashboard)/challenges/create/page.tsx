'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { createChallenge } from '@/lib/firebase/challenge-service';
import { challengeSchema } from '@/lib/utils/validation';
import { ChallengeFormData } from '@/types';
import { CHALLENGE_CATEGORIES, CHALLENGE_DIFFICULTIES, ROUTES } from '@/lib/constants';
import { FiPlus, FiX } from 'react-icons/fi';

export default function CreateChallengePage() {
  const router = useRouter();
  const { user, isMentor } = useUser();
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>(['']);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema.omit({ requirements: true, learningOutcomes: true })),
  });

  if (!isMentor) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            Only mentors can create challenges. You are currently signed in as a {user?.role}.
          </p>
          <button
            onClick={() => router.back()}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: Omit<ChallengeFormData, 'requirements' | 'learningOutcomes'>) => {
    if (!user) return;

    const filteredRequirements = requirements.filter(r => r.trim() !== '');
    const filteredOutcomes = learningOutcomes.filter(o => o.trim() !== '');

    if (filteredRequirements.length === 0) {
      toast.error('Please add at least one requirement');
      return;
    }

    if (filteredOutcomes.length === 0) {
      toast.error('Please add at least one learning outcome');
      return;
    }

    try {
      setLoading(true);
      const challengeId = await createChallenge(
        {
          ...data,
          requirements: filteredRequirements,
          learningOutcomes: filteredOutcomes,
        },
        user.id,
        user.displayName
      );
      toast.success('Challenge created successfully!');
      router.push(ROUTES.CHALLENGE_DETAIL(challengeId));
    } catch (error: any) {
      toast.error(error.message || 'Failed to create challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Challenge</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Challenge Title
            </label>
            <input
              {...register('title')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
              placeholder="e.g., Build a Modern Portfolio Website"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
              placeholder="Detailed description of the challenge..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
              >
                <option value="">Select category</option>
                {CHALLENGE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                {...register('difficulty')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
              >
                <option value="">Select difficulty</option>
                {CHALLENGE_DIFFICULTIES.map(diff => (
                  <option key={diff.value} value={diff.value}>{diff.label}</option>
                ))}
              </select>
              {errors.difficulty && (
                <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            {requirements.map((req, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => {
                    const newReqs = [...requirements];
                    newReqs[index] = e.target.value;
                    setRequirements(newReqs);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                  placeholder="e.g., Knowledge of HTML, CSS, JavaScript"
                />
                {requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setRequirements(requirements.filter((_, i) => i !== index))}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setRequirements([...requirements, ''])}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              <FiPlus className="w-4 h-4" /> Add Requirement
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Outcomes
            </label>
            {learningOutcomes.map((outcome, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={outcome}
                  onChange={(e) => {
                    const newOutcomes = [...learningOutcomes];
                    newOutcomes[index] = e.target.value;
                    setLearningOutcomes(newOutcomes);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                  placeholder="e.g., Master responsive web design"
                />
                {learningOutcomes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index))}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setLearningOutcomes([...learningOutcomes, ''])}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              <FiPlus className="w-4 h-4" /> Add Learning Outcome
            </button>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Challenge'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

