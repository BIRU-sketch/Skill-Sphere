'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import FeatureCard from '@/components/cards/FeatureCard';
import StatCard from '@/components/cards/StatCard';

const OrganizerDashboard = () => {
  return (
    <div className="space-y-8 p-6">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Organizer Control Center
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Launch events, manage teams, review submissions, and communicate with participants.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Active Events" value="5" trend="2 ending soon" icon="🎯" />
        <StatCard title="Participants" value="124" trend="+12 today" icon="👥" />
        <StatCard title="Submissions" value="89" trend="67% completion" icon="📤" />
        <StatCard title="Judges" value="8" trend="All assigned" icon="⚖️" />
      </section>

      <motion.section
        className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <FeatureCard
          title="Create Hackathon"
          description="Define timelines, judging criteria, and publish instantly to participants."
          href="/organizer/hackathons/new"
          icon="🚀"
        />
        <FeatureCard
          title="Manage Judges"
          description="Add expert judges and assign projects for evaluation with role-based permissions."
          href="/organizer/judges"
          icon="⚖️"
        />
        <FeatureCard
          title="Review Submissions"
          description="Evaluate projects, provide feedback, and score teams based on defined criteria."
          href="/organizer/submissions"
          icon="📝"
        />
        <FeatureCard
          title="Analytics & Reports"
          description="Review participant stats, submission rates, and judge activity in real time."
          href="/organizer/analytics"
          icon="📊"
        />
        <FeatureCard
          title="Certificates"
          description="Auto-generate and distribute digital certificates to winners and participants."
          href="/organizer/certificates"
          icon="🏆"
        />
        <FeatureCard
          title="Announcements"
          description="Send updates, deadlines, and important information to all participants."
          href="/organizer/announcements"
          icon="📢"
        />
      </motion.section>
    </div>
  );
};

export default OrganizerDashboard;

