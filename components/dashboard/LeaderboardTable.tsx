'use client';

import { motion } from 'framer-motion';

interface LeaderboardEntry {
  rank: number;
  teamName: string;
  score: number;
  members: string[];
}

interface LeaderboardTableProps {
  entries?: LeaderboardEntry[];
  hackathonId?: string;
}

const LeaderboardTable = ({ entries = [], hackathonId }: LeaderboardTableProps) => {
  // Mock data for demonstration
  const mockEntries: LeaderboardEntry[] = entries.length > 0 ? entries : [
    { rank: 1, teamName: 'Team Alpha', score: 95, members: ['Alice', 'Bob', 'Charlie'] },
    { rank: 2, teamName: 'Team Beta', score: 88, members: ['David', 'Eve'] },
    { rank: 3, teamName: 'Team Gamma', score: 82, members: ['Frank', 'Grace', 'Henry'] },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Live Leaderboard</h2>
      {mockEntries.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No rankings available yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-2 text-left font-medium text-slate-700 dark:text-slate-300">Rank</th>
                <th className="px-4 py-2 text-left font-medium text-slate-700 dark:text-slate-300">Team</th>
                <th className="px-4 py-2 text-right font-medium text-slate-700 dark:text-slate-300">Score</th>
              </tr>
            </thead>
            <tbody>
              {mockEntries.map((entry, idx) => (
                <motion.tr
                  key={entry.rank}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-4 py-3">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      entry.rank === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      entry.rank === 2 ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' :
                      entry.rank === 3 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {entry.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{entry.teamName}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{entry.members.join(', ')}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
                    {entry.score}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTable;

