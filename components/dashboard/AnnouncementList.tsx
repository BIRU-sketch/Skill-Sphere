'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
  audience?: string;
}

interface AnnouncementListProps {
  announcements?: Announcement[];
}

const AnnouncementList = ({ announcements = [] }: AnnouncementListProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Announcements</h2>
      {announcements.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No announcements yet.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement, idx) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900 dark:text-white">{announcement.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{announcement.message}</p>
                </div>
                <span className="ml-4 text-xs text-slate-500 dark:text-slate-500">
                  {format(new Date(announcement.createdAt), 'MMM d')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementList;

