/**
 * JobsPane Component
 * Right pane - displays ranked job matches
 */

'use client';

// Component for displaying ranked job matches

export function JobsPane({ jobs, selectedJob, onSelectJob, loading }) {
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
              onClick={() => onSelectJob(job)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-slate-100 border-slate-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
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
                  {gptJob.location ||
                    (typeof job.location === 'string'
                      ? job.location
                      : job.location?.city ||
                        job.location?.region ||
                        'Location TBD')}
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
