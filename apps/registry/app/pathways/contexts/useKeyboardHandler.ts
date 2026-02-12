import { useEffect, type MutableRefObject } from 'react';
import type { FocusArea, KeyboardHandlers } from './KeyboardContext';

interface UseKeyboardHandlerProps {
  focusArea: FocusArea;
  isHelpOpen: boolean;
  setIsHelpOpen: (open: boolean) => void;
  setFocusArea: (area: FocusArea) => void;
  handlersRef: MutableRefObject<KeyboardHandlers>;
}

/**
 * Hook that attaches the global keyboard event handler.
 * Delegates key presses to registered handler functions.
 */
export function useKeyboardHandler({
  focusArea,
  isHelpOpen,
  setIsHelpOpen,
  setFocusArea,
  handlersRef,
}: UseKeyboardHandlerProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Allow Escape to work in inputs
      if (isInput && event.key !== 'Escape') return;

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
            setIsHelpOpen((prev: boolean) => !prev);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusArea, isHelpOpen, setIsHelpOpen, setFocusArea, handlersRef]);
}
