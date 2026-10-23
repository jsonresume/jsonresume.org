'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as s from './content.css';

/* OnThisPage */

export interface OnThisPageItem {
  /** id of the section heading. */
  id: string;
  label: ReactNode;
}

export interface OnThisPageProps {
  items: OnThisPageItem[];
  label?: string;
  className?: string;
}

/**
 * In-page navigation for long pages. Sticky from lg up; marks the section
 * currently in view (after hydration, so server and client HTML match).
 */
export function OnThisPage({
  items,
  label = 'On this page',
  className,
}: OnThisPageProps) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = items.find((item) => visible.has(item.id));
        if (first) setCurrent(first.id);
      },
      { rootMargin: '0px 0px -70% 0px' }
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={label} className={cx(s.toc, className)}>
      <p className={s.overline}>{label}</p>
      <ul className={s.tocList}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              className={s.tocLink}
              href={`#${item.id}`}
              aria-current={current === item.id ? 'true' : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ChipGroup */

export interface ChipOption {
  value: string;
  label: ReactNode;
  count?: number;
}

export interface ChipGroupProps {
  options: ChipOption[];
  /** Selected value, or null for none ("All"). */
  value: string | null;
  onValueChange: (value: string | null) => void;
  /** Names the group, e.g. "Category". */
  label: string;
  /** Label of the first chip, which clears the selection. Omit to hide it. */
  allLabel?: ReactNode;
  className?: string;
}

/**
 * Pick one of many short options, or none, as a row of toggle chips. Each
 * chip is a toggle button (aria-pressed); pressing the selected one clears it.
 */
export function ChipGroup({
  options,
  value,
  onValueChange,
  label,
  allLabel,
  className,
}: ChipGroupProps) {
  return (
    <div role="group" aria-label={label} className={cx(s.chips, className)}>
      {allLabel !== undefined ? (
        <button
          type="button"
          className={s.choice}
          aria-pressed={value === null}
          onClick={() => onValueChange(null)}
        >
          {allLabel}
        </button>
      ) : null}
      {options.map((option) => {
        const pressed = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className={s.choice}
            aria-pressed={pressed}
            onClick={() => onValueChange(pressed ? null : option.value)}
          >
            {option.label}
            {option.count !== undefined ? (
              <span className={s.choiceCount}>{option.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
