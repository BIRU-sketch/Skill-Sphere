'use client';

import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon?: string;
}

const StatCard = ({ title, value, trend, icon }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
          {trend && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{trend}</p>
          )}
        </div>
        {icon && <span className="text-3xl">{icon}</span>}
      </div>
    </motion.div>
  );
};

export default StatCard;

