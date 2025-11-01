'use client';

import { motion } from 'framer-motion';
import AnnouncementList from '@/components/dashboard/AnnouncementList';
import LeaderboardTable from '@/components/dashboard/LeaderboardTable';
import SubmissionCard from '@/components/dashboard/SubmissionCard';
import StatCard from '@/components/cards/StatCard';

const ParticipantDashboard = () => {
  // In production, fetch from API with authentication
  const user = { profile: { fullName: 'Participant' } };

  return (
    <div className="space-y-8 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Welcome back, {user?.profile?.fullName ?? 'Participant'}!
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Track your active hackathons, submissions, and feedback in real time.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Active Hackathons" value="3" trend="+1 this week" icon="🎯" />
        <StatCard title="Team Invites" value="2" trend="Respond soon" icon="👥" />
        <StatCard title="Certificates Earned" value="5" trend="+2 this semester" icon="🏆" />
      </section>

      <motion.section
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-6 lg:col-span-2">
          <SubmissionCard />
          <AnnouncementList />
        </div>
        <LeaderboardTable />
      </motion.section>
    </div>
  );
};

export default ParticipantDashboard;

