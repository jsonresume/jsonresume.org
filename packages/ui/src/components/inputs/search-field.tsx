'use client';

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
} from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../form/field';
import * as s from './inputs.css';

export interface SearchFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'onChange' | 'value' | 'defaultValue'
  > {
  value?: string;
  defaultValue?: string;
  /** Every keystroke. */
  onValueChange?: (value: string) => void;
  /** Debounced: fires once typing pauses, and immediately on clear or Enter. */
  onSearch?: (value: string) => void;
  debounceMs?: number;
  size?: 'md' | 'lg';
  clearLabel?: string;
}

/** Search input with an icon, a clear button and a debounced search callback. */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  function SearchField(
    {
      value,
      defaultValue = '',
      onValueChange,
      onSearch,
      debounceMs = 250,
      size,
      clearLabel = 'Clear search',
      className,
      onKeyDown,
      ...props
    },
    ref
  ) {
    const [inner, setInner] = useState(defaultValue);
    const current = value ?? inner;
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const control = useFieldControl(props);

    useEffect(
      () => () => {
        if (timer.current) clearTimeout(timer.current);
      },
      []
    );

    const update = (next: string, immediate = false) => {
      if (value === undefined) setInner(next);
      onValueChange?.(next);
      if (timer.current) clearTimeout(timer.current);
      if (immediate) onSearch?.(next);
      else timer.current = setTimeout(() => onSearch?.(next), debounceMs);
    };

    return (
      <div className={cx(s.search({ size }), className)}>
        <svg
          className={s.searchIcon}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="4.5" />
          <path d="m10.5 10.5 3 3" strokeLinecap="round" />
        </svg>
        <input
          ref={ref}
          type="search"
          className={s.searchInput}
          value={current}
          onChange={(e) => update(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') update(current, true);
            if (e.key === 'Escape' && current) {
              e.preventDefault();
              update('', true);
            }
            onKeyDown?.(e);
          }}
          {...control}
        />
        {current ? (
          <button
            type="button"
            className={s.iconButton}
            onClick={() => update('', true)}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="m4 4 8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <span className={visuallyHidden}>{clearLabel}</span>
          </button>
        ) : null}
      </div>
    );
  }
);
