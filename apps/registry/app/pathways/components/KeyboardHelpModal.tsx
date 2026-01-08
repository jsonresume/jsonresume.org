'use client';

import { useEffect, useCallback } from 'react';
import { useKeyboard } from '../contexts';

// ============================================================================
// Component
// ============================================================================

export function KeyboardHelpModal() {
  const { isHelpOpen, setIsHelpOpen, shortcuts } = useKeyboard();

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isHelpOpen) {
        setIsHelpOpen(false);
      }
    },
    [isHelpOpen, setIsHelpOpen]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isHelpOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => setIsHelpOpen(false)}
    >
      <div
        className="w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setIsHelpOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-1">
          {/* Navigation */}
          <div className="pb-2 mb-2 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Navigation
            </h3>
            <ShortcutRow keyStr="↑ / ↓" description="Navigate jobs" />
            <ShortcutRow keyStr="← / →" description="Navigate tree" />
            <ShortcutRow keyStr="Enter" description="Select/expand node" />
            <ShortcutRow keyStr="Escape" description="Clear selection" />
          </div>

          {/* Actions */}
          <div className="pb-2 mb-2 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Actions
            </h3>
            <ShortcutRow keyStr="r" description="Mark as read" />
            <ShortcutRow keyStr="i" description="Mark as interested" />
            <ShortcutRow keyStr="h" description="Hide job" />
          </div>

          {/* Other */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Other
            </h3>
            <ShortcutRow keyStr="/" description="Focus search" />
            <ShortcutRow keyStr="?" description="Show this help" />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Press{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">?</kbd>{' '}
            to toggle this help
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function ShortcutRow({
  keyStr,
  description,
}: {
  keyStr: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-gray-600">{description}</span>
      <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-700">
        {keyStr}
      </kbd>
    </div>
  );
}

export default KeyboardHelpModal;
