/**
 * Decisions Page
 * AI-powered job matching with decision tree visualization
 *
 * Three-pane layout:
 * - Left (25%): Resume display
 * - Center (50%): React Flow decision tree
 * - Right (25%): Ranked jobs
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useResume } from '../../providers/ResumeProvider';
import { ResumePane } from './components/ResumePane';
import { DecisionTreePane } from './components/DecisionTreePane';
import { JobsPane } from './components/JobsPane';
import { useJobMatching } from './hooks/useJobMatching';
import { useDecisionTree } from './hooks/useDecisionTree';
import { logger } from '@/lib/logger';

export default function DecisionsPage({ params }) {
  const { username } = params;
  const { resume, loading: resumeLoading, error: resumeError } = useResume();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState(null);

  // Fetch jobs from database
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError(null);

        // Call the existing jobs API (used by /jobs page)
        const response = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.statusText}`);
        }

        const data = await response.json();
        setJobs(Array.isArray(data) ? data.slice(0, 100) : []); // Limit to 100
      } catch (error) {
        logger.error(
          { error: error.message, username },
          'Error fetching jobs for decisions page'
        );
        setJobsError(error.message);
        setJobs([]);
      } finally {
        setJobsLoading(false);
      }
    };

    if (username) {
      fetchJobs();
    }
  }, [username]);

  // Rank jobs using scoring algorithm
  const { rankedJobs } = useJobMatching(resume, jobs);

  // Decision tree state and animation
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    evaluateJob,
    matchResult,
  } = useDecisionTree(resume);

  // Handle job selection
  const handleSelectJob = useCallback(
    (job) => {
      setSelectedJob(job);
      if (resume && job) {
        evaluateJob(resume, job);
      }
    },
    [resume, evaluateJob]
  );

  // Auto-select top job on load
  useEffect(() => {
    if (rankedJobs.length > 0 && !selectedJob) {
      handleSelectJob(rankedJobs[0]);
    }
  }, [rankedJobs, selectedJob, handleSelectJob]);

  // Loading state
  if (resumeLoading || jobsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-lg font-medium text-slate-700 mb-2">
            Loading your decision tree...
          </div>
          <div className="text-sm text-slate-500">
            {resumeLoading && 'Fetching resume...'}
            {jobsLoading && 'Fetching jobs...'}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (resumeError || jobsError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <div className="text-lg font-medium text-red-600 mb-2">
            Oops! Something went wrong
          </div>
          <div className="text-sm text-slate-600">
            {resumeError || jobsError}
          </div>
        </div>
      </div>
    );
  }

  // No resume state
  if (!resume) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <div className="text-lg font-medium text-slate-700 mb-2">
            No resume found
          </div>
          <div className="text-sm text-slate-600 mb-4">
            Create a resume to see job matches and decision paths.
          </div>
          <a
            href={`/${username}/dashboard`}
            className="inline-block px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen grid grid-cols-12 gap-4 p-4 bg-slate-50">
      {/* Left Pane: Resume Display (25%) */}
      <div className="col-span-3">
        <ResumePane
          resume={resume}
          matchResult={matchResult}
          selectedJob={selectedJob}
        />
      </div>

      {/* Center Pane: Decision Tree (50%) */}
      <div className="col-span-6">
        <DecisionTreePane
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        />
      </div>

      {/* Right Pane: Ranked Jobs (25%) */}
      <div className="col-span-3">
        <JobsPane
          jobs={rankedJobs}
          selectedJob={selectedJob}
          onSelectJob={handleSelectJob}
          loading={jobsLoading}
        />
      </div>
    </div>
  );
}
