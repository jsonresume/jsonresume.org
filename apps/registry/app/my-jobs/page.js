'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/auth';
import { JobCard } from './JobCard';
import { Filters } from './Filters';
import { filterJobs } from './jobFormatters';

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

  const filtered = filterJobs(jobs, filters);

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
