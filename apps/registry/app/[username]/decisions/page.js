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
import { usePublicResume } from '../../providers/PublicResumeProvider';
import { useAuth } from '../../components/MenuModule/hooks/useAuth';
import { ResumePane } from './components/ResumePane';
import { DecisionTreePane } from './components/DecisionTreePane';
import { JobsPane } from './components/JobsPane';
import { useJobMatching } from './hooks/useJobMatching';
import { useDecisionTree } from './hooks/useDecisionTree';
import { logger } from '@/lib/logger';

export default function DecisionsPage({ params }) {
  const { username } = params;
  const { user } = useAuth();
  const {
    resume,
    loading: resumeLoading,
    error: resumeError,
  } = usePublicResume();
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

        // Call the decisions jobs API with limit parameter and userId to filter out decided jobs
        const response = await fetch('/api/decisions/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            userId: user?.id,
            limit: 10,
          }), // Limit to 10 for testing
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.statusText}`);
        }

        const data = await response.json();
        setJobs(Array.isArray(data) ? data : []);
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
  }, [username, user]);

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

  // Refetch jobs after decision is made
  const refetchJobs = useCallback(async () => {
    try {
      setJobsLoading(true);
      const response = await fetch('/api/decisions/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          userId: user?.id,
          limit: 10,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.statusText}`);
      }

      const data = await response.json();
      setJobs(Array.isArray(data) ? data : []);
      setSelectedJob(null); // Clear selection after refetch
    } catch (error) {
      logger.error({ error: error.message }, 'Error refetching jobs');
    } finally {
      setJobsLoading(false);
    }
  }, [username, user]);

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
    <div
      className="w-full grid grid-cols-12 gap-4 p-4 bg-slate-50"
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      {/* Left Pane: Resume Display (25%) */}
      <div className="col-span-3 h-full overflow-hidden">
        <ResumePane resume={resume} />
      </div>

      {/* Center Pane: Decision Tree (50%) */}
      <div className="col-span-6 h-full overflow-hidden">
        <DecisionTreePane
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        />
      </div>

      {/* Right Pane: Ranked Jobs (25%) */}
      <div className="col-span-3 h-full overflow-hidden">
        <JobsPane
          jobs={rankedJobs}
          selectedJob={selectedJob}
          onSelectJob={handleSelectJob}
          loading={jobsLoading}
          matchResult={matchResult}
          user={user}
          onDecision={refetchJobs}
        />
      </div>
    </div>
  );
}
