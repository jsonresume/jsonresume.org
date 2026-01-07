import React from 'react';
import ToolCard, { ToolDetails } from './ToolCard';

function isToolReady(state) {
  return state === 'input-available' || state === 'output-available';
}

// AI SDK v6 tool-invocation format handlers
export function FilterJobsInvocation({ toolInvocation }) {
  const { args, state, result } = toolInvocation;

  return (
    <ToolCard
      icon="🔍"
      title="Filtering jobs..."
      color="purple"
      showSuccess={state === 'result' && result?.success}
      successMessage="Filter applied"
    >
      {args?.criteria && (
        <div className="text-sm">Action: {args.action || 'filter'}</div>
      )}
    </ToolCard>
  );
}

export function ShowJobsInvocation({ toolInvocation }) {
  const { args, state } = toolInvocation;

  return (
    <ToolCard
      icon="👁️"
      title="Showing jobs..."
      color="indigo"
      showSuccess={state === 'result'}
      successMessage="Jobs filtered"
    >
      {args?.query && <div className="text-sm">Query: "{args.query}"</div>}
    </ToolCard>
  );
}

export function JobInsightsInvocation({ toolInvocation }) {
  const { args, state, result } = toolInvocation;

  return (
    <ToolCard icon="📊" title="Getting job insights..." color="amber">
      {args?.insightType && (
        <div className="text-sm">Type: {args.insightType}</div>
      )}
      {state === 'result' && (
        <ToolDetails label="View insights" data={result?.data} />
      )}
    </ToolCard>
  );
}

export function RefreshMatchesInvocation({ toolInvocation }) {
  const { state } = toolInvocation;

  return (
    <ToolCard
      icon="🔄"
      title="Refreshing job matches..."
      color="green"
      showSuccess={state === 'result'}
      successMessage="Graph refreshed"
    />
  );
}

// AI SDK v6 tool-{name} format handlers
export function FilterJobsPart({ part }) {
  if (!isToolReady(part.state)) return null;

  return (
    <ToolCard
      icon="🔍"
      title="Filtering jobs..."
      color="purple"
      showSuccess={part.state === 'output-available'}
      successMessage="Filter applied"
    >
      {part.input?.criteria && (
        <div className="text-sm">Action: {part.input.action || 'filter'}</div>
      )}
    </ToolCard>
  );
}

export function ShowJobsPart({ part }) {
  if (!isToolReady(part.state)) return null;

  return (
    <ToolCard
      icon="👁️"
      title="Showing jobs..."
      color="indigo"
      showSuccess={part.state === 'output-available'}
      successMessage="Jobs filtered"
    >
      {part.input?.query && (
        <div className="text-sm">Query: "{part.input.query}"</div>
      )}
    </ToolCard>
  );
}

export function JobInsightsPart({ part }) {
  if (!isToolReady(part.state)) return null;

  return (
    <ToolCard icon="📊" title="Getting job insights..." color="amber">
      {part.input?.insightType && (
        <div className="text-sm">Type: {part.input.insightType}</div>
      )}
      {part.state === 'output-available' && (
        <ToolDetails label="View insights" data={part.output?.data} />
      )}
    </ToolCard>
  );
}

export function RefreshMatchesPart({ part }) {
  if (!isToolReady(part.state)) return null;

  return (
    <ToolCard
      icon="🔄"
      title="Refreshing job matches..."
      color="green"
      showSuccess={part.state === 'output-available'}
      successMessage="Graph refreshed"
    />
  );
}
