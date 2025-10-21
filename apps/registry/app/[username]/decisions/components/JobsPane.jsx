/**
 * JobsPane Component
 * Right pane - displays ranked job matches or detailed job view
 */

'use client';

import { useState } from 'react';
import { JobDetail } from './JobDetail';

// Helper function to safely extract location string
function getLocationString(location) {
  if (!location) return 'Location TBD';
  if (typeof location === 'string') return location;
  // Handle location object
  const parts = [location.city, location.region, location.country]
    .filter(Boolean)
    .join(', ');
  return parts || 'Location TBD';
}

export function JobsPane({
  jobs,
  selectedJob,
  onSelectJob,
  loading,
  matchResult,
  user,
  onDecision,
}) {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

  // Handle job selection
  const handleSelectJob = (job) => {
    onSelectJob(job);
    setViewMode('detail');
  };

  // Handle back to list
  const handleBackToList = () => {
    setViewMode('list');
  };

  // Show detail view if a job is selected and in detail mode
  if (viewMode === 'detail' && selectedJob) {
    return (
      <div className="h-full overflow-hidden">
        <JobDetail
          job={selectedJob}
          matchResult={matchResult}
          onBack={handleBackToList}
          user={user}
          onDecision={onDecision}
        />
      </div>
    );
  }

  // Check if we're loading
  const isEvaluating = matchResult?.outcome === 'loading';
  if (loading) {
    return (
      <div className="h-full bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-slate-900">
          Job Matches (Ranked)
        </h2>
        <div className="text-center text-slate-500 py-10">Loading jobs...</div>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="h-full bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-slate-900">
          Job Matches (Ranked)
        </h2>
        <div className="text-center text-slate-500 py-10">
          No jobs available
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-2xl shadow-md p-6 flex flex-col overflow-hidden">
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {/* Header */}
      <header className="mb-4 pb-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          Job Matches (Ranked)
        </h2>
        <div className="text-xs text-slate-500 mt-1">{jobs.length} jobs</div>
      </header>

      {/* Jobs List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {jobs.map((job) => {
          const gptJob = job.gpt_content ? JSON.parse(job.gpt_content) : {};
          const isSelected = selectedJob?.id === job.id;
          const score = job._score || 0;
          const outcome = job._outcome || 'noMatch';

          return (
            <button
              key={job.id}
              onClick={() => handleSelectJob(job)}
              className={`relative w-full text-left p-3 rounded-xl border transition-all ${
                isSelected && isEvaluating
                  ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300 shadow-md animate-pulse'
                  : isSelected
                  ? 'bg-slate-100 border-slate-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {isSelected && isEvaluating && (
                <div className="absolute top-2 right-2">
                  <div
                    className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full"
                    style={{ animation: 'spin 1s linear infinite' }}
                  />
                </div>
              )}
              {/* Title and Score */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-900 truncate">
                    {gptJob.title || job.title || 'Untitled Position'}
                  </div>
                  {gptJob.company && (
                    <div className="text-xs text-slate-600 truncate">
                      {gptJob.company}
                    </div>
                  )}
                </div>
                <div
                  className={`px-2 py-0.5 rounded-full text-xs font-mono font-semibold ${
                    outcome === 'strongMatch'
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : outcome === 'possibleMatch'
                      ? 'bg-orange-100 text-orange-700 border border-orange-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {Math.round(score)}%
                </div>
              </div>

              {/* Location and Salary */}
              <div className="text-xs text-slate-600 mb-2">
                <span>
                  {getLocationString(gptJob.location || job.location)}
                </span>
                {gptJob.salary?.min && gptJob.salary?.max && (
                  <span className="ml-2">
                    • ${Math.round(gptJob.salary.min / 1000)}k-$
                    {Math.round(gptJob.salary.max / 1000)}k
                  </span>
                )}
              </div>

              {/* Skills */}
              {gptJob.skills && gptJob.skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {gptJob.skills.slice(0, 4).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 text-xs rounded-md bg-slate-100 border border-slate-200 text-slate-700"
                    >
                      {typeof skill === 'string' ? skill : skill.name}
                    </span>
                  ))}
                  {gptJob.skills.length > 4 && (
                    <span className="text-xs text-slate-500 py-0.5">
                      +{gptJob.skills.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
