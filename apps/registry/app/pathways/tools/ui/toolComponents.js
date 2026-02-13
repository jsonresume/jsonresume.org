'use client';

import React from 'react';
import { ToolCard, ToolDetails } from './ToolCard';

function isReady(part) {
  return part.state === 'input-available' || part.state === 'output-available';
}

// Resume Update UI
export function UpdateResumeUI({ part, meta }) {
  if (!isReady(part)) return null;
  const isComplete = part.state === 'output-available';

  const successMessage =
    typeof part.output === 'string'
      ? part.output
      : part.output?.message || meta.successMessage;

  return (
    <ToolCard
      icon={meta.icon}
      title={meta.processingMessage}
      color={meta.color}
      showSuccess={isComplete}
      successMessage={successMessage}
    >
      {part.input?.explanation && (
        <p className="text-sm opacity-80">{part.input.explanation}</p>
      )}
      <ToolDetails label="View changes" data={part.input?.changes} />
    </ToolCard>
  );
}

// Filter Jobs UI
export function FilterJobsUI({ part, meta }) {
  if (!isReady(part)) return null;
  const isComplete = part.state === 'output-available';

  const actionLabel = {
    mark_read: 'Mark as read',
    mark_interested: 'Mark as interested',
    mark_hidden: 'Hide',
    unmark: 'Clear status',
  }[part.input?.action];

  return (
    <ToolCard
      icon={meta.icon}
      title={meta.processingMessage}
      color={meta.color}
      showSuccess={isComplete}
      successMessage={meta.successMessage}
    >
      {actionLabel && (
        <p className="text-sm opacity-80">Action: {actionLabel}</p>
      )}
    </ToolCard>
  );
}

// Show Jobs UI
export function ShowJobsUI({ part, meta }) {
  if (!isReady(part)) return null;
  const isComplete = part.state === 'output-available';

  return (
    <ToolCard
      icon={meta.icon}
      title={meta.processingMessage}
      color={meta.color}
      showSuccess={isComplete}
      successMessage={meta.successMessage}
    >
      {part.input?.query && (
        <p className="text-sm opacity-80">
          Query: &quot;{part.input.query}&quot;
        </p>
      )}
    </ToolCard>
  );
}

// Job Insights UI
export function JobInsightsUI({ part, meta }) {
  if (!isReady(part)) return null;
  const isComplete = part.state === 'output-available';

  const typeLabel = {
    salary_range: 'Salary Range',
    top_companies: 'Top Companies',
    common_skills: 'Common Skills',
    job_types: 'Job Types',
    locations: 'Locations',
  }[part.input?.insightType];

  return (
    <ToolCard
      icon={meta.icon}
      title={meta.processingMessage}
      color={meta.color}
      showSuccess={isComplete}
      successMessage={meta.successMessage}
    >
      {typeLabel && (
        <p className="text-sm opacity-80">Analyzing: {typeLabel}</p>
      )}
      {isComplete && part.output?.data && (
        <ToolDetails label="View insights" data={part.output.data} />
      )}
    </ToolCard>
  );
}

// Refresh Matches UI
export function RefreshMatchesUI({ part, meta }) {
  if (!isReady(part)) return null;
  const isComplete = part.state === 'output-available';

  return (
    <ToolCard
      icon={meta.icon}
      title={meta.processingMessage}
      color={meta.color}
      showSuccess={isComplete}
      successMessage={meta.successMessage}
    />
  );
}

// Save Job Feedback UI
export function SaveJobFeedbackUI({ part, meta }) {
  if (!isReady(part)) return null;
  const isComplete = part.state === 'output-available';

  return (
    <ToolCard
      icon={meta.icon}
      title={meta.processingMessage}
      color={meta.color}
      showSuccess={isComplete}
      successMessage={meta.successMessage}
    >
      {part.input?.jobTitle && (
        <p className="text-sm opacity-80">
          {part.input.jobTitle}
          {part.input.jobCompany && ` at ${part.input.jobCompany}`}
        </p>
      )}
    </ToolCard>
  );
}
