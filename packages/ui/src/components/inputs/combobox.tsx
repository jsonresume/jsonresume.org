'use client';

import {
  useId,
  useMemo,
  useRef,
  useState,
  type InputHTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../form/field';
import * as s from './inputs.css';

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange'
  > {
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Shown when nothing matches the typed text. */
  emptyText?: string;
}

/**
 * A select you can type into, for long option lists (countries, companies,
 * themes). Follows the ARIA combobox pattern: arrows move, Enter picks,
 * Escape closes.
 */
export function Combobox({
  options,
  value,
  defaultValue = null,
  onValueChange,
  emptyText = 'No matches',
  className,
  placeholder,
  ...props
}: ComboboxProps) {
  const [inner, setInner] = useState<string | null>(defaultValue);
  const selected = value === undefined ? inner : value;
  const selectedLabel = options.find((o) => o.value === selected)?.label ?? '';
  const [query, setQuery] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const control = useFieldControl(props);

  const text = query ?? selectedLabel;
  const matches = useMemo(() => {
    const q = (query ?? '').trim().toLowerCase();
    return q
      ? options.filter((o) => o.label.toLowerCase().includes(q))
      : options;
  }, [options, query]);

  const choose = (option: ComboboxOption) => {
    if (value === undefined) setInner(option.value);
    onValueChange?.(option.value);
    setQuery(null);
    setOpen(false);
  };

  const activeOption = open ? matches[active] : undefined;
  const optionId = (i: number) => `${listId}-${i}`;

  return (
    <div className={cx(s.combobox, className)}>
      <div className={s.comboboxControl}>
        <input
          {...control}
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeOption ? optionId(active) : undefined}
          className={s.comboboxInput}
          value={text}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            setQuery(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
              setActive((a) =>
                Math.min(a + 1, Math.max(matches.length - 1, 0))
              );
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === 'Enter' && activeOption) {
              e.preventDefault();
              choose(activeOption);
            } else if (e.key === 'Escape') {
              setOpen(false);
              setQuery(null);
            }
          }}
        />
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path
            d="M2.5 4.5 6 8l3.5-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      {open ? (
        <ul id={listId} role="listbox" className={s.listbox}>
          {matches.length ? (
            matches.map((o, i) => (
              <li
                key={o.value}
                id={optionId(i)}
                role="option"
                aria-selected={o.value === selected}
                data-active={i === active}
                className={s.option}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(o)}
              >
                {o.label}
                {o.value === selected ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.5 6.25 5 8.75l4.5-5.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                ) : null}
              </li>
            ))
          ) : (
            <li className={s.optionEmpty} role="presentation">
              {emptyText}
            </li>
          )}
        </ul>
      ) : null}
    </div>
  );
}
