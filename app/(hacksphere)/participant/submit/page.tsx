'use client';

import SubmissionForm from '@/components/forms/SubmissionForm';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const SubmitProjectPage = () => {
  const searchParams = useSearchParams();
  const hackathonId = searchParams.get('hackathonId') || '';
  const teamId = searchParams.get('teamId') || '';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: any, file: File | null) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to submit project
      // await fetch('/api/submissions', { method: 'POST', body: formData });
      console.log('Submitting:', { values, file, hackathonId, teamId });
      alert('Submission successful! (This is a demo)');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Submit Your Project</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Upload your project details, code repository, and presentation files for evaluation.
        </p>
      </header>

      <SubmissionForm onSubmit={handleSubmit} hackathonId={hackathonId} teamId={teamId} />
    </div>
  );
};

export default SubmitProjectPage;

