'use client';

import { useRef, useEffect, useCallback } from 'react';

/**
 * Hook to handle job-related tool invocations from the AI
 * Processes filterJobs, showJobs, getJobInsights, and refreshJobMatches tools
 */
export default function useJobToolsHandler({
  messages,
  addToolResult,
  // Context methods for job management
  markAsRead,
  markAsInterested,
  markAsHidden,
  clearJobState,
  triggerGraphRefresh,
  // Additional handlers
  setFilterText,
  jobs = [],
  jobInfo = {},
  // For job feedback
  userId,
}) {
  const handledToolCalls = useRef(new Set());

  /**
   * Handle filterJobs tool - mark jobs matching criteria
   */
  const handleFilterJobs = useCallback(
    (criteria, action) => {
      if (!criteria || !jobs?.length) return;

      const matchingJobIds = findMatchingJobs(criteria, jobs, jobInfo);

      matchingJobIds.forEach((jobId) => {
        switch (action) {
          case 'mark_read':
            markAsRead?.(jobId);
            break;
          case 'mark_interested':
            markAsInterested?.(jobId);
            break;
          case 'mark_hidden':
            markAsHidden?.(jobId);
            break;
          case 'unmark':
            clearJobState?.(jobId);
            break;
        }
      });
    },
    [jobs, jobInfo, markAsRead, markAsInterested, markAsHidden, clearJobState]
  );

  /**
   * Handle saveJobFeedback tool - save feedback to DB and mark as read
   */
  const handleSaveJobFeedback = useCallback(
    async ({ jobId, jobTitle, jobCompany, feedback, sentiment }) => {
      if (!userId || !jobId || !feedback) return;

      try {
        // Save feedback to database
        await fetch('/api/pathways/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            jobId,
            feedback,
            sentiment,
            jobTitle,
            jobCompany,
          }),
        });

        // Mark the job based on sentiment
        if (sentiment === 'interested') {
          markAsInterested?.(jobId);
        } else if (sentiment === 'applied') {
          markAsInterested?.(jobId);
        } else {
          markAsRead?.(jobId);
        }
      } catch (error) {
        console.error('Failed to save job feedback:', error);
      }
    },
    [userId, markAsRead, markAsInterested]
  );

  useEffect(() => {
    for (const msg of messages) {
      for (const part of msg.parts ?? []) {
        // AI SDK v6 format: part.type === 'tool-{toolName}'
        // Per docs: state is 'output-available' when complete, part.input has args
        // We also check 'input-available' to process early during streaming
        if (
          part.type?.startsWith('tool-') &&
          (part.state === 'output-available' ||
            part.state === 'input-available') &&
          !handledToolCalls.current.has(part.toolCallId)
        ) {
          const toolName = part.type.replace('tool-', '');
          const { criteria, action, query } = part.input ?? {};

          switch (toolName) {
            case 'filterJobs':
              handleFilterJobs(criteria, action);
              handledToolCalls.current.add(part.toolCallId);
              break;
            case 'showJobs':
              if (setFilterText && query) {
                setFilterText(query);
              }
              handledToolCalls.current.add(part.toolCallId);
              break;
            case 'getJobInsights': {
              // Insights are already returned in the tool result from server
              handledToolCalls.current.add(part.toolCallId);
              break;
            }
            case 'refreshJobMatches':
              if (triggerGraphRefresh) {
                triggerGraphRefresh();
              }
              handledToolCalls.current.add(part.toolCallId);
              break;
            case 'saveJobFeedback': {
              const { jobId, jobTitle, jobCompany, feedback, sentiment } =
                part.input ?? {};
              handleSaveJobFeedback({
                jobId,
                jobTitle,
                jobCompany,
                feedback,
                sentiment,
              });
              handledToolCalls.current.add(part.toolCallId);
              break;
            }
          }
        }
      }
    }
  }, [
    messages,
    addToolResult,
    handleFilterJobs,
    handleSaveJobFeedback,
    triggerGraphRefresh,
    setFilterText,
    jobs,
    jobInfo,
  ]);

  return null;
}

/**
 * Find jobs matching the given criteria
 */
function findMatchingJobs(criteria, jobs, jobInfo) {
  const matchingIds = [];

  for (const job of jobs) {
    const info = jobInfo[job.uuid] || {};
    let matches = true;

    // Check company names
    if (criteria.companies?.length) {
      const company = (info.company || '').toLowerCase();
      const companyMatch = criteria.companies.some((c) =>
        company.includes(c.toLowerCase())
      );
      if (!companyMatch) matches = false;
    }

    // Check keywords in title, description, skills
    if (matches && criteria.keywords?.length) {
      const searchText = [
        info.title,
        info.description,
        info.skills?.map((s) => s.name || s).join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const keywordMatch = criteria.keywords.some((k) =>
        searchText.includes(k.toLowerCase())
      );
      if (!keywordMatch) matches = false;
    }

    // Check industries
    if (matches && criteria.industries?.length) {
      const searchText = [info.title, info.description, info.company]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const industryMatch = criteria.industries.some((ind) =>
        searchText.includes(ind.toLowerCase())
      );
      if (!industryMatch) matches = false;
    }

    // Check salary range
    if (matches && (criteria.salaryMin || criteria.salaryMax)) {
      const salary = parseSalary(info.salary);
      if (salary) {
        if (criteria.salaryMin && salary < criteria.salaryMin * 1000)
          matches = false;
        if (criteria.salaryMax && salary > criteria.salaryMax * 1000)
          matches = false;
      }
    }

    // Check remote only
    if (matches && criteria.remoteOnly) {
      const remote = (info.remote || '').toLowerCase();
      const location = (info.location?.city || '').toLowerCase();
      const isRemote =
        remote.includes('remote') ||
        remote.includes('full') ||
        location.includes('remote');
      if (!isRemote) matches = false;
    }

    // Check job types
    if (matches && criteria.jobTypes?.length) {
      const jobType = (info.type || '').toLowerCase();
      const typeMatch = criteria.jobTypes.some((t) =>
        jobType.includes(t.toLowerCase())
      );
      if (!typeMatch) matches = false;
    }

    if (matches) {
      matchingIds.push(job.uuid);
    }
  }

  return matchingIds;
}

/**
 * Parse salary string to number
 */
function parseSalary(salaryStr) {
  if (!salaryStr) return null;
  const match = salaryStr.match(/\$?([\d,]+)/);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''), 10);
  }
  return null;
}

// Note: generateInsights function was removed - insights are now computed server-side
// in the getJobInsights tool execute function and returned in the tool result
