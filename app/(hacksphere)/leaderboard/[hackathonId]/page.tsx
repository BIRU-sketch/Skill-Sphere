'use client';

import { useEffect } from 'react';
import LeaderboardTable from '@/components/dashboard/LeaderboardTable';
import { useParams } from 'next/navigation';

const LeaderboardPage = () => {
  const params = useParams();
  const hackathonId = params.hackathonId as string;

  // TODO: Implement Socket.io for real-time updates
  useEffect(() => {
    // const socket = io(API_BASE_URL);
    // socket.on('leaderboard:update', () => {
    //   // Refetch leaderboard data
    // });
    // return () => socket.disconnect();
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Live Leaderboard</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Watch team rankings update in real time as judges score the submissions.
        </p>
      </header>
      <LeaderboardTable hackathonId={hackathonId} />
    </div>
  );
};

export default LeaderboardPage;

