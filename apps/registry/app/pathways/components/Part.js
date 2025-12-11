// Render a single part of a chat message.
// Handles plain text and tool invocations (updateResume, job tools).
import React from 'react';
import { Check } from 'lucide-react';
import styles from './chat.module.css';

// Tool configuration for consistent styling
const TOOL_CONFIG = {
  updateResume: {
    icon: '/',
    label: 'updateResume',
    variant: styles.toolResume,
  },
  filterJobs: { icon: '?', label: 'filterJobs', variant: styles.toolFilter },
  showJobs: { icon: '>', label: 'showJobs', variant: styles.toolShow },
  getJobInsights: {
    icon: '#',
    label: 'getJobInsights',
    variant: styles.toolInsights,
  },
  refreshJobMatches: {
    icon: '~',
    label: 'refreshJobMatches',
    variant: styles.toolRefresh,
  },
};

function ToolCard({ toolName, args, result, state, isPending }) {
  const config = TOOL_CONFIG[toolName] || {
    icon: '*',
    label: toolName,
    variant: styles.toolGeneric,
  };

  const isComplete = state === 'result' || state === 'output-available';

  return (
    <div
      className={`${styles.toolCard} ${config.variant} ${
        isPending ? styles.toolPending : ''
      }`}
    >
      <div className={styles.toolHeader}>
        <span className={styles.toolIcon}>{config.icon}</span>
        <span className={styles.toolTitle}>{config.label}</span>
      </div>

      {/* Tool-specific body content */}
      {toolName === 'updateResume' && args?.explanation && (
        <div className={styles.toolBody}>{args.explanation}</div>
      )}

      {toolName === 'filterJobs' && args?.action && (
        <div className={styles.toolMeta}>action: {args.action}</div>
      )}

      {toolName === 'showJobs' && args?.query && (
        <div className={styles.toolMeta}>query: "{args.query}"</div>
      )}

      {toolName === 'getJobInsights' && args?.insightType && (
        <div className={styles.toolMeta}>type: {args.insightType}</div>
      )}

      {/* Collapsible details for complex data */}
      {args?.changes && (
        <details className={styles.toolDetails}>
          <summary className={styles.toolDetailsSummary}>View changes</summary>
          <pre className={styles.toolDetailsContent}>
            {JSON.stringify(args.changes, null, 2)}
          </pre>
        </details>
      )}

      {isComplete && result?.data && (
        <details className={styles.toolDetails}>
          <summary className={styles.toolDetailsSummary}>View data</summary>
          <pre className={styles.toolDetailsContent}>
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </details>
      )}

      {/* Success indicator */}
      {isComplete && (
        <div className={styles.toolSuccess}>
          <Check className={styles.toolSuccessIcon} />
          <span>
            {result?.message ||
              (toolName === 'updateResume'
                ? 'Resume updated'
                : toolName === 'filterJobs'
                ? 'Filter applied'
                : toolName === 'showJobs'
                ? 'Jobs filtered'
                : toolName === 'getJobInsights'
                ? 'Insights ready'
                : toolName === 'refreshJobMatches'
                ? 'Graph refreshed'
                : 'Complete')}
          </span>
        </div>
      )}
    </div>
  );
}

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

      const { toolName, args, state, result } = toolInvocation;
      const isPending = state === 'call';

      return (
        <ToolCard
          toolName={toolName}
          args={args}
          result={result}
          state={state}
          isPending={isPending}
        />
      );
    }

    // AI SDK v6 format: part.type === 'tool-{toolName}'
    case 'tool-updateResume':
    case 'tool-filterJobs':
    case 'tool-showJobs':
    case 'tool-getJobInsights':
    case 'tool-refreshJobMatches': {
      if (
        part.state !== 'input-available' &&
        part.state !== 'output-available'
      ) {
        return null;
      }

      const toolName = part.type.replace('tool-', '');
      const isPending = part.state === 'input-available';

      return (
        <ToolCard
          toolName={toolName}
          args={part.input}
          result={part.output}
          state={part.state}
          isPending={isPending}
        />
      );
    }

    // Handle step indicators
    case 'step-start':
    case 'step-finish':
      return null;

    default:
      return null;
  }
}
