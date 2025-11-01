'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon?: string;
}

const FeatureCard = ({ title, description, href, icon }: FeatureCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <Link href={href} className="block">
        <div className="mb-3 flex items-center gap-3">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
        <div className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:underline">
          Learn more →
        </div>
      </Link>
    </motion.div>
  );
};

export default FeatureCard;

