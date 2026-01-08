'use client';

/**
 * AgentStatus - Shows current agent/streaming status
 * Displays visual feedback during AI processing
 */

const STATUS_CONFIG = {
  ready: null, // Don't render when ready
  submitted: {
    icon: '◌',
    text: 'Processing...',
    className: 'bg-gray-50 text-gray-500 border-gray-200',
    animate: true,
  },
  streaming: {
    icon: '●',
    text: 'Responding...',
    className: 'bg-blue-50 text-blue-600 border-blue-200',
    animate: true,
  },
  error: {
    icon: '!',
    text: 'Error occurred',
    className: 'bg-red-50 text-red-600 border-red-200',
    animate: false,
  },
};

export default function AgentStatus({ status }) {
  const config = STATUS_CONFIG[status];

  // Don't render for 'ready' status or unknown status
  if (!config) return null;

  return (
    <div
      className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded border ${config.className}`}
    >
      <span className={config.animate ? 'animate-pulse' : ''}>
        {config.icon}
      </span>
      <span>{config.text}</span>
    </div>
  );
}

/**
 * Inline typing indicator for message streams
 */
export function TypingIndicator() {
  return (
    <span className="inline-flex items-center gap-0.5 text-gray-400">
      <span className="animate-bounce" style={{ animationDelay: '0ms' }}>
        ·
      </span>
      <span className="animate-bounce" style={{ animationDelay: '150ms' }}>
        ·
      </span>
      <span className="animate-bounce" style={{ animationDelay: '300ms' }}>
        ·
      </span>
    </span>
  );
}
