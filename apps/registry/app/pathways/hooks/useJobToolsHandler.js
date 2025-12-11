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

  useEffect(() => {
    for (const msg of messages) {
      for (const part of msg.parts ?? []) {
        // AI SDK v6 format: tool-invocation with toolInvocation object
        if (part.type === 'tool-invocation' && part.toolInvocation) {
          const { toolName, toolCallId, args, state } = part.toolInvocation;

          // Only process when result is available (server has processed)
          if (state !== 'result' || handledToolCalls.current.has(toolCallId))
            continue;

          switch (toolName) {
            case 'filterJobs': {
              const { criteria, action } = args ?? {};
              handleFilterJobs(criteria, action);
              handledToolCalls.current.add(toolCallId);
              break;
            }
            case 'showJobs': {
              const { query } = args ?? {};
              if (setFilterText && query) {
                setFilterText(query);
              }
              handledToolCalls.current.add(toolCallId);
              break;
            }
            case 'getJobInsights': {
              // Insights are already returned in the tool result from server
              handledToolCalls.current.add(toolCallId);
              break;
            }
            case 'refreshJobMatches': {
              if (triggerGraphRefresh) {
                triggerGraphRefresh();
              }
              handledToolCalls.current.add(toolCallId);
              break;
            }
          }
        }

        // Legacy v5 format support - tool-{name}
        if (
          part.type?.startsWith('tool-') &&
          part.state === 'input-available' &&
          !handledToolCalls.current.has(part.toolCallId)
        ) {
          const toolName = part.type.replace('tool-', '');
          const { criteria, action, query, insightType } = part.input ?? {};

          switch (toolName) {
            case 'filterJobs':
              handleFilterJobs(criteria, action);
              addToolResult?.({
                toolCallId: part.toolCallId,
                result: `Processed ${action} for jobs matching criteria`,
              });
              handledToolCalls.current.add(part.toolCallId);
              break;
            case 'showJobs':
              if (setFilterText && query) {
                setFilterText(query);
              }
              addToolResult?.({
                toolCallId: part.toolCallId,
                result: `Applied filter: "${query}"`,
              });
              handledToolCalls.current.add(part.toolCallId);
              break;
            case 'getJobInsights': {
              const insights = generateInsights(insightType, jobs, jobInfo);
              addToolResult?.({
                toolCallId: part.toolCallId,
                result: JSON.stringify(insights),
              });
              handledToolCalls.current.add(part.toolCallId);
              break;
            }
            case 'refreshJobMatches':
              if (triggerGraphRefresh) {
                triggerGraphRefresh();
              }
              addToolResult?.({
                toolCallId: part.toolCallId,
                result: 'Graph refresh triggered',
              });
              handledToolCalls.current.add(part.toolCallId);
              break;
          }
        }
      }
    }
  }, [
    messages,
    addToolResult,
    handleFilterJobs,
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

/**
 * Generate insights about the jobs
 */
function generateInsights(insightType, jobs, jobInfo) {
  const insights = { type: insightType, data: {} };

  switch (insightType) {
    case 'salary_range': {
      const salaries = jobs
        .map((j) => parseSalary(jobInfo[j.uuid]?.salary))
        .filter(Boolean);
      if (salaries.length) {
        insights.data = {
          min: Math.min(...salaries),
          max: Math.max(...salaries),
          median: salaries.sort((a, b) => a - b)[
            Math.floor(salaries.length / 2)
          ],
          count: salaries.length,
        };
      }
      break;
    }
    case 'top_companies': {
      const companies = {};
      jobs.forEach((j) => {
        const company = jobInfo[j.uuid]?.company;
        if (company) {
          companies[company] = (companies[company] || 0) + 1;
        }
      });
      insights.data = Object.entries(companies)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));
      break;
    }
    case 'common_skills': {
      const skills = {};
      jobs.forEach((j) => {
        (jobInfo[j.uuid]?.skills || []).forEach((s) => {
          const name = s.name || s;
          skills[name] = (skills[name] || 0) + 1;
        });
      });
      insights.data = Object.entries(skills)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([name, count]) => ({ name, count }));
      break;
    }
    case 'job_types': {
      const types = {};
      jobs.forEach((j) => {
        const type = jobInfo[j.uuid]?.type || 'Unknown';
        types[type] = (types[type] || 0) + 1;
      });
      insights.data = Object.entries(types).map(([type, count]) => ({
        type,
        count,
      }));
      break;
    }
    case 'locations': {
      const locations = {};
      jobs.forEach((j) => {
        const loc = jobInfo[j.uuid]?.location;
        const locStr = loc
          ? [loc.city, loc.region].filter(Boolean).join(', ')
          : 'Unknown';
        locations[locStr] = (locations[locStr] || 0) + 1;
      });
      insights.data = Object.entries(locations)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([location, count]) => ({ location, count }));
      break;
    }
  }

  return insights;
}
