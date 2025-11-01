'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { motion } from 'framer-motion';

type SubmissionFormValues = {
  title: string;
  description: string;
  techStack: string;
  repoUrl: string;
  demoUrl?: string;
};

interface SubmissionFormProps {
  onSubmit: (values: SubmissionFormValues, file: File | null) => void;
  hackathonId: string;
  teamId?: string;
}

const SubmissionForm = ({ onSubmit, hackathonId, teamId }: SubmissionFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SubmissionFormValues>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit((values) => onSubmit(values, selectedFile))}
      className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Project Submission</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Submit your project for evaluation. Ensure all links are accessible and files are properly formatted.
      </p>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
          Project Title *
        </label>
        <input
          {...register('title', { required: 'Project title is required' })}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
          placeholder="My Awesome Hackathon Project"
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
          Description *
        </label>
        <textarea
          rows={4}
          {...register('description', { required: 'Description is required' })}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
          placeholder="Explain what your project does, the problem it solves, and key features..."
        />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
          Tech Stack * (comma separated)
        </label>
        <input
          {...register('techStack', { required: 'Tech stack is required' })}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
          placeholder="React, Node.js, Socket.io, MongoDB"
        />
        {errors.techStack && <p className="mt-1 text-xs text-red-600">{errors.techStack.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            GitHub Repository URL *
          </label>
          <input
            type="url"
            {...register('repoUrl', {
              required: 'GitHub URL is required',
              pattern: {
                value: /^https?:\/\/github\.com\/.+/,
                message: 'Please provide a valid GitHub repository URL',
              },
            })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
            placeholder="https://github.com/username/project"
          />
          {errors.repoUrl && <p className="mt-1 text-xs text-red-600">{errors.repoUrl.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            Deployment URL (Optional)
          </label>
          <input
            type="url"
            {...register('demoUrl')}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
            placeholder="https://your-project.vercel.app"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
          Upload Project Files * (PDF, PPT, or ZIP)
        </label>
        <input
          type="file"
          accept=".pdf,.ppt,.pptx,.zip"
          onChange={handleFileChange}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
          required
        />
        {selectedFile && (
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Files are stored securely in cloud storage with metadata linked to your submission.
        </p>
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:bg-purple-500"
      >
        Submit Project for Review
      </button>
    </motion.form>
  );
};

export default SubmissionForm;

