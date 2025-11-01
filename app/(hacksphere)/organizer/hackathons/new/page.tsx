'use client';

import HackathonForm from '@/components/forms/HackathonForm';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateHackathonPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to create hackathon
      // const response = await fetch('/api/hackathons', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values),
      // });
      console.log('Creating hackathon:', values);
      alert('Hackathon created successfully! (This is a demo)');
      // router.push('/organizer/dashboard');
    } catch (error) {
      console.error('Creation error:', error);
      alert('Failed to create hackathon. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Create New Hackathon</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Set up a new hackathon or CTF challenge with custom rules, timeline, and judging criteria.
        </p>
      </header>

      <HackathonForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateHackathonPage;

