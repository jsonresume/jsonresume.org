'use client';

import React from 'react';
import { getToolMeta } from '../registry';
import { ToolCard } from './ToolCard';
import {
  UpdateResumeUI,
  FilterJobsUI,
  ShowJobsUI,
  JobInsightsUI,
  RefreshMatchesUI,
  SaveJobFeedbackUI,
} from './toolComponents';

// Re-export shared components
export { ToolCard, ToolDetails } from './ToolCard';

// Generic fallback UI using registry metadata
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

// Tool component mapping
const TOOL_COMPONENTS = {
  updateResume: UpdateResumeUI,
  filterJobs: FilterJobsUI,
  showJobs: ShowJobsUI,
  getJobInsights: JobInsightsUI,
  refreshJobMatches: RefreshMatchesUI,
  saveJobFeedback: SaveJobFeedbackUI,
};

export function getToolUI(toolName) {
  return TOOL_COMPONENTS[toolName] || GenericToolUI;
}

export function renderToolPart(toolName, part) {
  const ToolUI = getToolUI(toolName);
  const meta = getToolMeta(toolName);
  return <ToolUI part={part} meta={meta} />;
}
