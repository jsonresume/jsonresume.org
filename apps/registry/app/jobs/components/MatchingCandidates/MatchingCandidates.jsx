'use client';

import { useCandidates } from './MatchingCandidates/useCandidates';
import { LoadingSkeleton } from './MatchingCandidates/LoadingSkeleton';
import { CandidateCard } from './MatchingCandidates/CandidateCard';

export default function MatchingCandidates({ jobId }) {
  const { candidates, loading, error } = useCandidates(jobId);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return <div className="mt-8 text-center text-gray-500">{error}</div>;
  }

  if (!candidates?.length) {
    return (
      <div className="mt-8 text-center text-gray-500">
        No matching candidates found
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Top Matching Candidates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((candidate, index) => (
          <CandidateCard
            key={candidate.username}
            candidate={candidate}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
