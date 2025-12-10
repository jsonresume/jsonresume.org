'use client';

import dynamic from 'next/dynamic';

const CosmicJobsGame = dynamic(() => import('./CosmicJobsGame'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-white text-xl">Loading Cosmic Simulation...</div>
    </div>
  ),
});

export default function CosmicJobsWrapper({ jobs, resumes }) {
  return <CosmicJobsGame jobs={jobs} resumes={resumes} />;
}
