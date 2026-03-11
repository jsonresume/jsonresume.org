'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/auth';

const STATE_COLORS = {
  interested: 'bg-green-100 text-green-800',
  applied: 'bg-blue-100 text-blue-800',
  maybe: 'bg-yellow-100 text-yellow-800',
  not_interested: 'bg-gray-100 text-gray-500',
  dismissed: 'bg-gray-100 text-gray-400',
};

const STATE_ICONS = {
  interested: '⭐',
  applied: '📨',
  not_interested: '✗',
  dismissed: '👁',
  maybe: '?',
};

function formatSalary(salary, salaryUsd) {
  if (salaryUsd) return `$${Math.round(salaryUsd / 1000)}k`;
  if (salary) return salary;
  return null;
}

function formatLocation(loc, remote) {
  const parts = [];
  if (loc?.city) parts.push(loc.city);
  if (loc?.countryCode) parts.push(loc.countryCode);
  if (remote) parts.push(remote);
  return parts.join(', ') || null;
}

function JobCard({ job, onStateChange }) {
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

function Filters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        value={filters.stateFilter}
        onChange={(e) => onChange({ ...filters, stateFilter: e.target.value })}
        className="px-3 py-1.5 border rounded-md text-sm bg-white"
      >
        <option value="all">All states</option>
        <option value="interested">Interested</option>
        <option value="applied">Applied</option>
        <option value="maybe">Maybe</option>
        <option value="unmarked">Unmarked</option>
      </select>
      <label className="flex items-center gap-1.5 text-sm">
        <input
          type="checkbox"
          checked={filters.remote}
          onChange={(e) => onChange({ ...filters, remote: e.target.checked })}
          className="rounded"
        />
        Remote only
      </label>
    </div>
  );
}

export default function MyJobsPage() {
  const { user, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    remote: false,
    stateFilter: 'all',
  });

  const fetchJobs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/my-jobs');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setJobs(data.jobs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchJobs();
  }, [user, fetchJobs]);

  const handleStateChange = async (jobId, state) => {
    const existing = jobs.find((j) => j.id === jobId);
    const newState = existing?.state === state ? null : state;

    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, state: newState } : j))
    );

    const res = await fetch('/api/my-jobs/mark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, state: newState }),
    });

    if (!res.ok) {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, state: existing?.state } : j))
      );
    }
  };

  let filtered = jobs || [];
  if (filters.stateFilter === 'unmarked') {
    filtered = filtered.filter((j) => !j.state);
  } else if (filters.stateFilter !== 'all') {
    filtered = filtered.filter((j) => j.state === filters.stateFilter);
  }
  if (filters.remote) {
    filtered = filtered.filter((j) => j.remote === 'Full');
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">My Job Matches</h1>
          <p className="text-gray-500">
            Sign in to see jobs matched to your resume.
          </p>
          <a
            href="/login"
            className="inline-block px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Sign in with GitHub
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Job Matches</h1>
        <p className="text-gray-500 text-sm mt-1">
          Jobs from HN &quot;Who is Hiring&quot; matched to your resume using AI
          embeddings.
        </p>
      </div>

      <div className="mb-6">
        <Filters filters={filters} onChange={setFilters} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700 text-sm mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12 text-gray-500">
          <p>Matching jobs to your resume...</p>
          <p className="text-xs mt-1">
            This generates an embedding — may take a few seconds.
          </p>
        </div>
      )}

      {jobs && filtered.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No jobs match your current filters.
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((job) => (
          <JobCard key={job.id} job={job} onStateChange={handleStateChange} />
        ))}
      </div>

      {jobs && !loading && (
        <div className="mt-6 text-xs text-gray-400 text-center">
          Showing {filtered.length} of {jobs.length} matched jobs
        </div>
      )}
    </div>
  );
}
