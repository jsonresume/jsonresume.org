export interface KeyboardShortcut {
  key: string;
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[];
  description: string;
  action: string;
}

export const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'ArrowUp',
    description: 'Navigate to previous job',
    action: 'navigatePrev',
  },
  {
    key: 'ArrowDown',
    description: 'Navigate to next job',
    action: 'navigateNext',
  },
  {
    key: 'ArrowLeft',
    description: 'Navigate to parent node',
    action: 'navigateParent',
  },
  {
    key: 'ArrowRight',
    description: 'Navigate to first child',
    action: 'navigateChild',
  },
  {
    key: 'Enter',
    description: 'Select/expand current node',
    action: 'selectNode',
  },
  { key: 'Escape', description: 'Clear selection', action: 'clearSelection' },
  { key: 'r', description: 'Mark as read', action: 'markRead' },
  { key: 'i', description: 'Mark as interested', action: 'markInterested' },
  { key: 'h', description: 'Hide job', action: 'markHidden' },
  { key: '/', description: 'Focus search', action: 'focusSearch' },
  { key: '?', description: 'Show keyboard shortcuts', action: 'showHelp' },
];
