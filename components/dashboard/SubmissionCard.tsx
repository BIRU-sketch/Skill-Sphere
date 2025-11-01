'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Submission {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  repoUrl: string;
  demoUrl?: string;
  status: 'draft' | 'submitted' | 'reviewed';
  submittedAt: Date;
  feedback?: string;
  score?: number;
}

interface SubmissionCardProps {
  submission?: Submission;
}

const SubmissionCard = ({ submission }: SubmissionCardProps) => {
  // Mock data for demonstration
  const mockSubmission: Submission = submission || {
    id: '1',
    title: 'Smart Campus App',
    description: 'An innovative solution for managing university resources and student engagement.',
    techStack: ['React', 'Node.js', 'MongoDB'],
    repoUrl: 'https://github.com/team/smart-campus',
    demoUrl: 'https://smart-campus.vercel.app',
    status: 'submitted',
    submittedAt: new Date(),
  };

  const statusColors = {
    draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    reviewed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{mockSubmission.title}</h3>
            <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${statusColors[mockSubmission.status]}`}>
              {mockSubmission.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{mockSubmission.description}</p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {mockSubmission.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <a
              href={mockSubmission.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline dark:text-indigo-400"
            >
              View Repository →
            </a>
            {mockSubmission.demoUrl && (
              <a
                href={mockSubmission.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Live Demo →
              </a>
            )}
          </div>

          {mockSubmission.feedback && (
            <div className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Judge Feedback:</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{mockSubmission.feedback}</p>
            </div>
          )}

          {mockSubmission.score !== undefined && (
            <div className="mt-2 text-sm font-semibold text-green-600 dark:text-green-400">
              Score: {mockSubmission.score}/100
            </div>
          )}
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
        Submitted {format(new Date(mockSubmission.submittedAt), 'MMM d, yyyy h:mm a')}
      </p>
    </motion.div>
  );
};

export default SubmissionCard;

