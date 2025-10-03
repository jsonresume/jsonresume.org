'use client';

import { sampleResume } from './EditorModule/data/sampleResume';
import { useCreateResume } from './CreateResumeModule/hooks/useCreateResume';
import { CreateResumeCard } from './CreateResumeModule/components/CreateResumeCard';

export default function CreateResume() {
  const { creating, handleCreateResume } = useCreateResume(sampleResume);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
      <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />

      <CreateResumeCard
        creating={creating}
        onCreateResume={handleCreateResume}
      />
    </div>
  );
}
