'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { DEFAULT_SHORTCUTS, type KeyboardShortcut } from './keyboardShortcuts';
import { useKeyboardHandler } from './useKeyboardHandler';

export type FocusArea = 'graph' | 'chat' | 'details' | 'search' | 'none';

export interface KeyboardHandlers {
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
}

interface KeyboardContextValue {
  focusArea: FocusArea;
  setFocusArea: (area: FocusArea) => void;
  isHelpOpen: boolean;
  setIsHelpOpen: (open: boolean) => void;
  shortcuts: KeyboardShortcut[];
  registerShortcut: (shortcut: KeyboardShortcut) => void;
  unregisterShortcut: (key: string) => void;
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
  setNavigationHandlers: (handlers: Partial<KeyboardHandlers>) => void;
  setActionHandlers: (handlers: Partial<KeyboardHandlers>) => void;
}

const KeyboardContext = createContext<KeyboardContextValue | null>(null);

const INITIAL_HANDLERS: KeyboardHandlers = {
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
};

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [focusArea, setFocusArea] = useState<FocusArea>('graph');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [shortcuts, setShortcuts] =
    useState<KeyboardShortcut[]>(DEFAULT_SHORTCUTS);
  const handlersRef = useRef<KeyboardHandlers>({ ...INITIAL_HANDLERS });

  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    setShortcuts((prev) => {
      if (prev.some((s) => s.key === shortcut.key)) return prev;
      return [...prev, shortcut];
    });
  }, []);

  const unregisterShortcut = useCallback((key: string) => {
    setShortcuts((prev) => prev.filter((s) => s.key !== key));
  }, []);

  const setNavigationHandlers = useCallback(
    (handlers: Partial<KeyboardHandlers>) => {
      Object.assign(handlersRef.current, handlers);
    },
    []
  );

  const setActionHandlers = useCallback(
    (handlers: Partial<KeyboardHandlers>) => {
      Object.assign(handlersRef.current, handlers);
    },
    []
  );

  useKeyboardHandler({
    focusArea,
    isHelpOpen,
    setIsHelpOpen,
    setFocusArea,
    handlersRef,
  });

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

export function useKeyboard(): KeyboardContextValue {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error('useKeyboard must be used within a KeyboardProvider');
  }
  return context;
}

export default KeyboardContext;
