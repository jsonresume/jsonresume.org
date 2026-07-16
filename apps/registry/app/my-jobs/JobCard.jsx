'use client';

import {
  STATE_COLORS,
  STATE_ICONS,
  formatSalary,
  formatLocation,
} from './jobFormatters';

/** A single matched-job card with inline state controls. */
export function JobCard({ job, onStateChange }) {
  const location = formatLocation(job.location, job.remote);
  const salary = formatSalary(job.salary, job.salary_usd);

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-mono text-gray-400">
              {Math.round(job.similarity * 100)}%
            </span>
            {job.state && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  STATE_COLORS[job.state]
                }`}
              >
                {STATE_ICONS[job.state]} {job.state}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.company}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
            {location && <span>{location}</span>}
            {salary && <span>{salary}</span>}
            {job.type && <span>{job.type}</span>}
            {job.posted_at && (
              <span>{new Date(job.posted_at).toLocaleDateString()}</span>
            )}
          </div>
          {job.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {job.skills.slice(0, 6).map((s, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                >
                  {s.name}
                </span>
              ))}
              {job.skills.length > 6 && (
                <span className="text-xs text-gray-400">
                  +{job.skills.length - 6}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          {['interested', 'maybe', 'not_interested'].map((state) => (
            <button
              key={state}
              onClick={() => onStateChange(job.id, state)}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                job.state === state
                  ? STATE_COLORS[state]
                  : 'border-gray-200 text-gray-400 hover:border-gray-300'
              }`}
            >
              {STATE_ICONS[state]} {state === 'not_interested' ? 'pass' : state}
            </button>
          ))}
        </div>
      </div>
      {job.url && (
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline mt-2 inline-block"
        >
          View on HN →
        </a>
      )}
    </div>
  );
}
