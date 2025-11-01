'use client';

import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useState } from 'react';

type HackathonFormValues = {
  title: string;
  description: string;
  category: 'Hackathon' | 'CTF';
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  judgingCriteria: string[];
  rules?: string;
};

interface HackathonFormProps {
  onSubmit: (values: HackathonFormValues) => void;
  defaultValues?: Partial<HackathonFormValues>;
}

const HackathonForm = ({ onSubmit, defaultValues }: HackathonFormProps) => {
  const { register, handleSubmit, watch } = useForm<HackathonFormValues>({
    defaultValues: {
      judgingCriteria: ['innovation', 'technicalImplementation'],
      category: 'Hackathon',
      ...defaultValues,
    },
  });

  const criteriaOptions = ['innovation', 'technicalImplementation', 'design', 'impact', 'presentation'];

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur dark:bg-slate-900/70"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Hackathon Title *
        </label>
        <input
          {...register('title', { required: true })}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
          placeholder="e.g., University Hackathon 2025"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Description *
        </label>
        <textarea
          {...register('description', { required: true })}
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
          placeholder="Describe the hackathon theme, goals, and what participants will build..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Category *
        </label>
        <select
          {...register('category', { required: true })}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
        >
          <option value="Hackathon">Coding Hackathon</option>
          <option value="CTF">CTF (Capture The Flag)</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Registration Deadline *
          </label>
          <input
            type="datetime-local"
            {...register('registrationDeadline', { required: true })}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Start Date *
          </label>
          <input
            type="datetime-local"
            {...register('startDate', { required: true })}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            End Date *
          </label>
          <input
            type="datetime-local"
            {...register('endDate', { required: true })}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Rules & Guidelines (Optional)
        </label>
        <textarea
          {...register('rules')}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
          placeholder="Team size limits, submission requirements, code of conduct..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
          Judging Criteria * (Select at least one)
        </label>
        <div className="flex flex-wrap gap-2">
          {criteriaOptions.map((criterion) => (
            <label
              key={criterion}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm capitalize text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200 cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-800/50"
            >
              <input
                type="checkbox"
                value={criterion}
                {...register('judgingCriteria', { required: true })}
                className="rounded"
              />
              {criterion.replace(/([A-Z])/g, ' $1').trim()}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-500"
      >
        {watch('title') ? `Publish "${watch('title')}"` : 'Create Hackathon'}
      </button>
    </motion.form>
  );
};

export default HackathonForm;

