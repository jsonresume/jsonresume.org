'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';

// ============================================================================
// Types
// ============================================================================

export type FocusArea = 'graph' | 'chat' | 'details' | 'search' | 'none';

export interface KeyboardShortcut {
  key: string;
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[];
  description: string;
  action: string;
}

interface KeyboardContextValue {
  // Focus management
  focusArea: FocusArea;
  setFocusArea: (area: FocusArea) => void;

  // Shortcut state
  isHelpOpen: boolean;
  setIsHelpOpen: (open: boolean) => void;

  // Shortcut registration
  shortcuts: KeyboardShortcut[];
  registerShortcut: (shortcut: KeyboardShortcut) => void;
  unregisterShortcut: (key: string) => void;

  // Action handlers (to be set by consuming components)
  onNavigatePrev: (() => void) | null;
  onNavigateNext: (() => void) | null;
  onNavigateParent: (() => void) | null;
  onNavigateChild: (() => void) | null;
  onSelectNode: (() => void) | null;
  onClearSelection: (() => void) | null;
  onMarkRead: (() => void) | null;
  onMarkInterested: (() => void) | null;
  onMarkHidden: (() => void) | null;
  onFocusSearch: (() => void) | null;

  // Register handlers
  setNavigationHandlers: (handlers: {
    onNavigatePrev?: () => void;
    onNavigateNext?: () => void;
    onNavigateParent?: () => void;
    onNavigateChild?: () => void;
    onSelectNode?: () => void;
    onClearSelection?: () => void;
  }) => void;

  setActionHandlers: (handlers: {
    onMarkRead?: () => void;
    onMarkInterested?: () => void;
    onMarkHidden?: () => void;
    onFocusSearch?: () => void;
  }) => void;
}

interface KeyboardProviderProps {
  children: ReactNode;
}

// ============================================================================
// Default Shortcuts
// ============================================================================

const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
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

// ============================================================================
// Context
// ============================================================================

const KeyboardContext = createContext<KeyboardContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

export function KeyboardProvider({ children }: KeyboardProviderProps) {
  const [focusArea, setFocusArea] = useState<FocusArea>('graph');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [shortcuts, setShortcuts] =
    useState<KeyboardShortcut[]>(DEFAULT_SHORTCUTS);

  // Handler refs (to avoid re-renders when handlers change)
  const handlersRef = useRef<{
    onNavigatePrev: (() => void) | null;
    onNavigateNext: (() => void) | null;
    onNavigateParent: (() => void) | null;
    onNavigateChild: (() => void) | null;
    onSelectNode: (() => void) | null;
    onClearSelection: (() => void) | null;
    onMarkRead: (() => void) | null;
    onMarkInterested: (() => void) | null;
    onMarkHidden: (() => void) | null;
    onFocusSearch: (() => void) | null;
  }>({
    onNavigatePrev: null,
    onNavigateNext: null,
    onNavigateParent: null,
    onNavigateChild: null,
    onSelectNode: null,
    onClearSelection: null,
    onMarkRead: null,
    onMarkInterested: null,
    onMarkHidden: null,
    onFocusSearch: null,
  });

  // Register/unregister shortcuts
  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    setShortcuts((prev) => {
      const exists = prev.some((s) => s.key === shortcut.key);
      if (exists) return prev;
      return [...prev, shortcut];
    });
  }, []);

  const unregisterShortcut = useCallback((key: string) => {
    setShortcuts((prev) => prev.filter((s) => s.key !== key));
  }, []);

  // Set navigation handlers
  const setNavigationHandlers = useCallback(
    (handlers: {
      onNavigatePrev?: () => void;
      onNavigateNext?: () => void;
      onNavigateParent?: () => void;
      onNavigateChild?: () => void;
      onSelectNode?: () => void;
      onClearSelection?: () => void;
    }) => {
      if (handlers.onNavigatePrev)
        handlersRef.current.onNavigatePrev = handlers.onNavigatePrev;
      if (handlers.onNavigateNext)
        handlersRef.current.onNavigateNext = handlers.onNavigateNext;
      if (handlers.onNavigateParent)
        handlersRef.current.onNavigateParent = handlers.onNavigateParent;
      if (handlers.onNavigateChild)
        handlersRef.current.onNavigateChild = handlers.onNavigateChild;
      if (handlers.onSelectNode)
        handlersRef.current.onSelectNode = handlers.onSelectNode;
      if (handlers.onClearSelection)
        handlersRef.current.onClearSelection = handlers.onClearSelection;
    },
    []
  );

  // Set action handlers
  const setActionHandlers = useCallback(
    (handlers: {
      onMarkRead?: () => void;
      onMarkInterested?: () => void;
      onMarkHidden?: () => void;
      onFocusSearch?: () => void;
    }) => {
      if (handlers.onMarkRead)
        handlersRef.current.onMarkRead = handlers.onMarkRead;
      if (handlers.onMarkInterested)
        handlersRef.current.onMarkInterested = handlers.onMarkInterested;
      if (handlers.onMarkHidden)
        handlersRef.current.onMarkHidden = handlers.onMarkHidden;
      if (handlers.onFocusSearch)
        handlersRef.current.onFocusSearch = handlers.onFocusSearch;
    },
    []
  );

  // Global keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Allow Escape to work in inputs
      if (isInput && event.key !== 'Escape') {
        return;
      }

      // Handle shortcuts based on key
      switch (event.key) {
        case 'ArrowUp':
          if (focusArea === 'graph') {
            event.preventDefault();
            handlersRef.current.onNavigatePrev?.();
          }
          break;
        case 'ArrowDown':
          if (focusArea === 'graph') {
            event.preventDefault();
            handlersRef.current.onNavigateNext?.();
          }
          break;
        case 'ArrowLeft':
          if (focusArea === 'graph') {
            event.preventDefault();
            handlersRef.current.onNavigateParent?.();
          }
          break;
        case 'ArrowRight':
          if (focusArea === 'graph') {
            event.preventDefault();
            handlersRef.current.onNavigateChild?.();
          }
          break;
        case 'Enter':
          if (focusArea === 'graph') {
            event.preventDefault();
            handlersRef.current.onSelectNode?.();
          }
          break;
        case 'Escape':
          event.preventDefault();
          if (isHelpOpen) {
            setIsHelpOpen(false);
          } else if (focusArea !== 'graph') {
            setFocusArea('graph');
          } else {
            handlersRef.current.onClearSelection?.();
          }
          break;
        case 'r':
          if (focusArea === 'graph' && !isInput) {
            event.preventDefault();
            handlersRef.current.onMarkRead?.();
          }
          break;
        case 'i':
          if (focusArea === 'graph' && !isInput) {
            event.preventDefault();
            handlersRef.current.onMarkInterested?.();
          }
          break;
        case 'h':
          if (focusArea === 'graph' && !isInput) {
            event.preventDefault();
            handlersRef.current.onMarkHidden?.();
          }
          break;
        case '/':
          if (!isInput) {
            event.preventDefault();
            handlersRef.current.onFocusSearch?.();
            setFocusArea('search');
          }
          break;
        case '?':
          if (!isInput) {
            event.preventDefault();
            setIsHelpOpen((prev) => !prev);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusArea, isHelpOpen]);

  const value: KeyboardContextValue = {
    focusArea,
    setFocusArea,
    isHelpOpen,
    setIsHelpOpen,
    shortcuts,
    registerShortcut,
    unregisterShortcut,
    onNavigatePrev: handlersRef.current.onNavigatePrev,
    onNavigateNext: handlersRef.current.onNavigateNext,
    onNavigateParent: handlersRef.current.onNavigateParent,
    onNavigateChild: handlersRef.current.onNavigateChild,
    onSelectNode: handlersRef.current.onSelectNode,
    onClearSelection: handlersRef.current.onClearSelection,
    onMarkRead: handlersRef.current.onMarkRead,
    onMarkInterested: handlersRef.current.onMarkInterested,
    onMarkHidden: handlersRef.current.onMarkHidden,
    onFocusSearch: handlersRef.current.onFocusSearch,
    setNavigationHandlers,
    setActionHandlers,
  };

  return (
    <KeyboardContext.Provider value={value}>
      {children}
    </KeyboardContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useKeyboard(): KeyboardContextValue {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error('useKeyboard must be used within a KeyboardProvider');
  }
  return context;
}

export default KeyboardContext;
