'use client';

import dynamic from 'next/dynamic';

const ResumeChessGame = dynamic(() => import('./ResumeChessGame'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-amber-800 text-xl">Loading Resume Chess...</div>
    </div>
  ),
});

export default function ResumeChessWrapper({ resumes, jobs }) {
  return <ResumeChessGame resumes={resumes} jobs={jobs} />;
}
