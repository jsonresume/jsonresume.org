'use client';

import { Button, Tooltip } from '@jsonresume/ui';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
const KEY = 'jr-styleguide-theme';

/** Previews the dark tokens by setting data-theme on <html>. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {
      // storage unavailable: stay light
    }
    if (saved === 'dark') setTheme('dark');
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <Tooltip content={`Switch to ${next} theme`}>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Dark theme"
        aria-pressed={theme === 'dark'}
        onClick={() => setTheme(next)}
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          {theme === 'dark' ? (
            <path
              d="M10 3v1.5M10 15.5V17M3 10h1.5M15.5 10H17M5 5l1 1M14 14l1 1M5 15l1-1M14 6l1-1M13 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M16 11.5A6.5 6.5 0 0 1 8.5 4a6.5 6.5 0 1 0 7.5 7.5Z"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </Button>
    </Tooltip>
  );
}
