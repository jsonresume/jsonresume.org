'use client';

import { Button, Tooltip } from '@jsonresume/ui';
import { useEffect, useState } from 'react';

type Theme = 'system' | 'light' | 'dark';
const KEY = 'jr-styleguide-theme';
const NEXT: Record<Theme, Theme> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};
const NAME: Record<Theme, string> = {
  system: 'System theme',
  light: 'Light theme',
  dark: 'Dark theme',
};

const ICON: Record<Theme, string> = {
  // A screen: follow the system.
  system: 'M3 4.5h14v9H3zM7 16.5h6M10 13.5v3',
  light:
    'M10 3v1.5M10 15.5V17M3 10h1.5M15.5 10H17M5 5l1 1M14 14l1 1M5 15l1-1M14 6l1-1M13 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  dark: 'M16 11.5A6.5 6.5 0 0 1 8.5 4a6.5 6.5 0 1 0 7.5 7.5Z',
};

const read = (): Theme => {
  try {
    const saved = localStorage.getItem(KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'system';
  } catch {
    return 'system';
  }
};

/**
 * Steps through the system's theme, light and dark by setting data-theme on
 * <html>. The layout's script applies a saved choice before first paint.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => setTheme(read()), []);

  const choose = (next: Theme) => {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      if (next === 'system') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, next);
    } catch {
      // storage unavailable: the choice lasts this page
    }
  };

  const next = NEXT[theme];
  return (
    <Tooltip content={`${NAME[theme]}. Switch to ${NAME[next].toLowerCase()}`}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`${NAME[theme]}; switch to ${NAME[next].toLowerCase()}`}
        onClick={() => choose(next)}
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d={ICON[theme]} />
        </svg>
      </Button>
    </Tooltip>
  );
}
