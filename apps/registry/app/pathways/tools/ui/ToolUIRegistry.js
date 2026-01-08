'use client';

import React from 'react';
import { getToolMeta } from '../registry';

/**
 * Tool UI Registry - Maps tools to their UI components
 * Provides consistent rendering for tool parts with automatic fallbacks
 */

// Generic Tool UI component using registry metadata
function GenericToolUI({ part, meta }) {
  const isReady =
    part.state === 'input-available' || part.state === 'output-available';
  const isComplete = part.state === 'output-available';

  if (!isReady) return null;

  return (
    <ToolCard
      icon={meta.icon}
      title={isComplete ? meta.successMessage : meta.processingMessage}
      color={meta.color}
      showSuccess={isComplete}
    />
  );
}

// Resume Update UI
function UpdateResumeUI({ part, meta }) {
  const isReady =
    part.state === 'input-available' || part.state === 'output-available';
  const isComplete = part.state === 'output-available';

  if (!isReady) return null;

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
function FilterJobsUI({ part, meta }) {
  const isReady =
    part.state === 'input-available' || part.state === 'output-available';
  const isComplete = part.state === 'output-available';

  if (!isReady) return null;

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
function ShowJobsUI({ part, meta }) {
  const isReady =
    part.state === 'input-available' || part.state === 'output-available';
  const isComplete = part.state === 'output-available';

  if (!isReady) return null;

  return (
    <ToolCard
      icon={meta.icon}
      title={meta.processingMessage}
      color={meta.color}
      showSuccess={isComplete}
      successMessage={meta.successMessage}
    >
      {part.input?.query && (
        <p className="text-sm opacity-80">Query: "{part.input.query}"</p>
      )}
    </ToolCard>
  );
}

// Job Insights UI
function JobInsightsUI({ part, meta }) {
  const isReady =
    part.state === 'input-available' || part.state === 'output-available';
  const isComplete = part.state === 'output-available';

  if (!isReady) return null;

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
function RefreshMatchesUI({ part, meta }) {
  const isReady =
    part.state === 'input-available' || part.state === 'output-available';
  const isComplete = part.state === 'output-available';

  if (!isReady) return null;

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
function SaveJobFeedbackUI({ part, meta }) {
  const isReady =
    part.state === 'input-available' || part.state === 'output-available';
  const isComplete = part.state === 'output-available';

  if (!isReady) return null;

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

// Tool component mapping
const TOOL_COMPONENTS = {
  updateResume: UpdateResumeUI,
  filterJobs: FilterJobsUI,
  showJobs: ShowJobsUI,
  getJobInsights: JobInsightsUI,
  refreshJobMatches: RefreshMatchesUI,
  saveJobFeedback: SaveJobFeedbackUI,
};

/**
 * Get the UI component for a tool
 */
export function getToolUI(toolName) {
  return TOOL_COMPONENTS[toolName] || GenericToolUI;
}

/**
 * Render a tool part with automatic component and metadata lookup
 */
export function renderToolPart(toolName, part) {
  const ToolUI = getToolUI(toolName);
  const meta = getToolMeta(toolName);
  return <ToolUI part={part} meta={meta} />;
}

// Shared ToolCard component with modern minimal styling
const COLOR_SCHEMES = {
  blue: 'bg-blue-50/80 text-blue-900 border-blue-200',
  purple: 'bg-purple-50/80 text-purple-900 border-purple-200',
  indigo: 'bg-indigo-50/80 text-indigo-900 border-indigo-200',
  amber: 'bg-amber-50/80 text-amber-900 border-amber-200',
  green: 'bg-green-50/80 text-green-900 border-green-200',
  gray: 'bg-gray-50/80 text-gray-600 border-gray-200',
  cyan: 'bg-cyan-50/80 text-cyan-900 border-cyan-200',
};

function ToolCard({
  icon,
  title,
  color = 'gray',
  children,
  showSuccess,
  successMessage = 'Complete',
}) {
  const colorClass = COLOR_SCHEMES[color] || COLOR_SCHEMES.gray;

  return (
    <div
      className={`p-3 rounded-lg border ${colorClass} text-xs space-y-1.5 transition-all`}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">
          {icon} {title}
        </span>
        {showSuccess && <span className="text-green-600 text-[10px]">✓</span>}
      </div>
      {children}
      {showSuccess && (
        <div className="text-green-700/80 text-[10px] font-medium">
          {successMessage}
        </div>
      )}
    </div>
  );
}

function ToolDetails({ label, data }) {
  if (!data) return null;

  return (
    <details className="mt-1.5">
      <summary className="cursor-pointer text-[10px] font-medium opacity-70 hover:opacity-100">
        {label}
      </summary>
      <pre className="whitespace-pre-wrap break-words bg-white/60 p-2 rounded mt-1 text-[10px] max-h-32 overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}

export { ToolCard, ToolDetails };
