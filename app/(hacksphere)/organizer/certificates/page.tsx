'use client';

import SubmissionCard from '@/components/dashboard/SubmissionCard';

const ManageCertificatesPage = () => {
  return (
    <div className="space-y-8 p-6">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Certificates</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Auto-generate, preview, and deliver digital certificates to teams and participants.
        </p>
      </header>

      <section className="space-y-4">
        {/* Certificates can be filtered by hackathon, status (draft/issued), etc. */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Generate Certificates</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Select a completed hackathon and generate certificates for all winners and participants.
          </p>
          <button className="mt-4 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500">
            Generate All Certificates
          </button>
        </div>

        <SubmissionCard />
      </section>
    </div>
  );
};

export default ManageCertificatesPage;

