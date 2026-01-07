import React from 'react';
import ToolCard, { ToolDetails } from './ToolCard';

// AI SDK v6 tool-invocation format
export function ResumeToolInvocation({ toolInvocation }) {
  const { args, state, result } = toolInvocation;

  return (
    <ToolCard
      icon="📝"
      title="Updating resume..."
      color="blue"
      showSuccess={state === 'result' && result?.success}
      successMessage={result?.message || 'Changes applied'}
    >
      {args?.explanation && <div className="text-sm">{args.explanation}</div>}
      <ToolDetails label="View changes" data={args?.changes} />
    </ToolCard>
  );
}

// AI SDK v6 tool-updateResume format
export function ResumeToolPart({ part }) {
  if (part.state !== 'input-available' && part.state !== 'output-available') {
    return null;
  }

  const { input, output } = part;
  const successMessage =
    typeof output === 'string' ? output : output?.message || 'Changes applied';

  return (
    <ToolCard
      icon="📝"
      title="Updating resume..."
      color="blue"
      showSuccess={part.state === 'output-available' && output}
      successMessage={successMessage}
    >
      {input?.explanation && <div className="text-sm">{input.explanation}</div>}
      <ToolDetails label="View changes" data={input?.changes} />
    </ToolCard>
  );
}
