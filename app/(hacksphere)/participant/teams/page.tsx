'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const Teams = () => {
  const [activeTab, setActiveTab] = useState<'myTeams' | 'invites' | 'create'>('myTeams');

  return (
    <div className="space-y-8 p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Teams</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Create teams or join invites to participate in hackathons.
          </p>
        </div>
        <nav className="flex rounded-full border border-slate-200 bg-white p-1 text-sm dark:border-slate-800 dark:bg-slate-900">
          {(['myTeams', 'invites', 'create'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 capitalize transition ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          ))}
        </nav>
      </header>

      <section>
        {activeTab === 'myTeams' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4 md:grid-cols-2"
          >
            {/* Team cards would be rendered here from API */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-semibold text-slate-900 dark:text-white">Team Alpha</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">3 members • Active in Hackathon 2025</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'invites' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Display incoming team invitations */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Invitation from Team Beta</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Invited by: John Doe</p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">
                    Accept
                  </button>
                  <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'create' && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Team Name *
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
                placeholder="Enter team name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
                placeholder="Optional team description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Invite Members (Email addresses)
              </label>
              <input
                type="email"
                multiple
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
                placeholder="user@university.edu (comma separated)"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500"
            >
              Create Team
            </button>
          </motion.form>
        )}
      </section>
    </div>
  );
};

export default Teams;

