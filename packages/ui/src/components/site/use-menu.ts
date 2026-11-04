import {
  useCallback,
  useEffect,
  useState,
  type AnimationEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type RefObject,
} from 'react';
import { media } from '../../tokens/theme';

export type MenuState = 'closed' | 'open' | 'closing';

// Skips links hidden by CSS, such as the signed-in buttons when signed out.
const shown = (el: Element) =>
  typeof el.checkVisibility === 'function' ? el.checkVisibility() : true;
// Missing where nothing is laid out, as in tests: there the menu just closes.
const wideQuery = () =>
  typeof window.matchMedia === 'function' ? window.matchMedia(media.lg) : null;

/**
 * The site menu's behaviour: open, then fold away (the CSS animation's end
 * finishes closing), with the page held still behind it, Escape to close,
 * Tab kept inside, and closed by a link or a screen grown wide.
 */
export function useMenu(
  bar: RefObject<HTMLElement | null>,
  toggleButton: RefObject<HTMLButtonElement | null>
) {
  const [state, setState] = useState<MenuState>('closed');
  const open = state === 'open';

  const close = useCallback(() => {
    const narrow = wideQuery()?.matches === false;
    setState((now) => (now !== 'open' ? now : narrow ? 'closing' : 'closed'));
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.dataset['menuOpen'] = '';
    // The menu takes the screen from the bar down: bring the bar to the top
    // first, so it doesn't jump when it becomes fixed.
    const top = bar.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) window.scrollBy(0, top);
    const wide = wideQuery();
    const onWide = () => wide?.matches && setState('closed');
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      close();
      toggleButton.current?.focus();
    };
    wide?.addEventListener('change', onWide);
    document.addEventListener('keydown', onKey);
    return () => {
      delete root.dataset['menuOpen'];
      wide?.removeEventListener('change', onWide);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, bar, toggleButton, close]);

  return {
    state,
    open,
    toggle: () => (open ? close() : setState('open')),
    /** Following a link closes the menu. */
    onClick: (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a')) close();
    },
    /** Tab wraps around the menu instead of reaching the page behind it. */
    onKeyDown: (event: ReactKeyboardEvent) => {
      if (!open || event.key !== 'Tab' || !bar.current) return;
      const all = [
        ...bar.current.querySelectorAll<HTMLElement>('a[href], button'),
      ].filter(shown);
      const first = all[0];
      const last = all[all.length - 1];
      const at = document.activeElement;
      if (event.shiftKey && at === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && at === last) {
        event.preventDefault();
        first?.focus();
      }
    },
    onAnimationEnd: (event: AnimationEvent) => {
      if (event.target === event.currentTarget && state === 'closing')
        setState('closed');
    },
  };
}
