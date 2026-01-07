// Render a single part of a chat message.
// Handles plain text and tool invocations (updateResume, job tools).
import React from 'react';
import ToolCard from './ToolCard';
import { ResumeToolInvocation, ResumeToolPart } from './ResumeToolPart';
import {
  FilterJobsInvocation,
  ShowJobsInvocation,
  JobInsightsInvocation,
  RefreshMatchesInvocation,
  FilterJobsPart,
  ShowJobsPart,
  JobInsightsPart,
  RefreshMatchesPart,
} from './JobToolParts';

const TOOL_INVOCATION_MAP = {
  updateResume: ResumeToolInvocation,
  filterJobs: FilterJobsInvocation,
  showJobs: ShowJobsInvocation,
  getJobInsights: JobInsightsInvocation,
  refreshJobMatches: RefreshMatchesInvocation,
};

export default function Part({ part }) {
  if (!part || !part.type) {
    return null;
  }

  switch (part.type) {
    case 'text':
      return <span>{part.text}</span>;

    // AI SDK v6 tool format - tool-invocation with toolInvocation object
    case 'tool-invocation': {
      const { toolInvocation } = part;
      if (!toolInvocation) return null;

      const { toolName, state } = toolInvocation;

      // Show loading state while calling
      if (state === 'call') {
        return (
          <ToolCard icon="⏳" title={`Calling ${toolName}...`} color="gray" />
        );
      }

      // Route to specific tool handler
      const ToolComponent = TOOL_INVOCATION_MAP[toolName];
      if (ToolComponent) {
        return <ToolComponent toolInvocation={toolInvocation} />;
      }

      // Generic tool display for unknown tools
      return (
        <ToolCard
          icon="🔧"
          title={toolName}
          color="gray"
          showSuccess={state === 'result'}
        />
      );
    }

    // AI SDK v6 format: part.type === 'tool-{toolName}'
    case 'tool-updateResume':
      return <ResumeToolPart part={part} />;

    case 'tool-filterJobs':
      return <FilterJobsPart part={part} />;

    case 'tool-showJobs':
      return <ShowJobsPart part={part} />;

    case 'tool-getJobInsights':
      return <JobInsightsPart part={part} />;

    case 'tool-refreshJobMatches':
      return <RefreshMatchesPart part={part} />;

    // Handle step indicators
    case 'step-start':
    case 'step-finish':
      return null;

    default:
      return null;
  }
}
