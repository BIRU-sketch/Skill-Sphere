'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiX, FiSend } from 'react-icons/fi';

interface EnrollmentFormData {
  applicationEssay: string;
  whyJoin: string;
  experience: string;
}

interface EnrollmentApplicationFormProps {
  challengeTitle: string;
  onSubmit: (data: EnrollmentFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function EnrollmentApplicationForm({
  challengeTitle,
  onSubmit,
  onCancel,
  isSubmitting,
}: EnrollmentApplicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EnrollmentFormData>();

  const applicationEssay = watch('applicationEssay', '');
  const whyJoin = watch('whyJoin', '');
  const experience = watch('experience', '');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Apply to Challenge</h2>
            <p className="text-sm text-gray-600 mt-1">{challengeTitle}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            disabled={isSubmitting}
          >
            <FiX className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              📝 <strong>Note:</strong> The mentor will review your application before approving your enrollment in this challenge.
            </p>
          </div>

          {/* Application Essay */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Essay <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Tell us about yourself, your background, and what makes you a good fit for this challenge. (Min 100 characters)
            </p>
            <textarea
              {...register('applicationEssay', {
                required: 'Application essay is required',
                minLength: {
                  value: 100,
                  message: 'Essay must be at least 100 characters',
                },
              })}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
              placeholder="Write your application essay here..."
            />
            <div className="flex justify-between mt-1">
              {errors.applicationEssay && (
                <p className="text-sm text-red-600">{errors.applicationEssay.message}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {applicationEssay.length} characters
              </p>
            </div>
          </div>

          {/* Why Join */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why do you want to join this challenge? <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              What specific goals do you hope to achieve? (Min 50 characters)
            </p>
            <textarea
              {...register('whyJoin', {
                required: 'This field is required',
                minLength: {
                  value: 50,
                  message: 'Please write at least 50 characters',
                },
              })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
              placeholder="Explain your motivation..."
            />
            <div className="flex justify-between mt-1">
              {errors.whyJoin && (
                <p className="text-sm text-red-600">{errors.whyJoin.message}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {whyJoin.length} characters
              </p>
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relevant Experience <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Describe your relevant skills, projects, or experience. (Min 50 characters)
            </p>
            <textarea
              {...register('experience', {
                required: 'Experience description is required',
                minLength: {
                  value: 50,
                  message: 'Please write at least 50 characters',
                },
              })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
              placeholder="List your relevant skills and experience..."
            />
            <div className="flex justify-between mt-1">
              {errors.experience && (
                <p className="text-sm text-red-600">{errors.experience.message}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {experience.length} characters
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner w-5 h-5 border-2"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FiSend className="w-5 h-5" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

