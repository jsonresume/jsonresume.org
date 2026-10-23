'use client';

import { useRef, useState, type InputHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../form/field';
import { Chip } from './chip';
import * as s from './inputs.css';

export interface TagInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange'
  > {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (tags: string[]) => void;
  /** Keys that commit the typed text as a tag. */
  separators?: string[];
  maxTags?: number;
}

/**
 * Add and remove short values as chips: skills, keywords. Enter or comma
 * adds, Backspace on an empty field removes the last one, and pasting a
 * comma-separated list adds them all.
 */
export function TagInput({
  value,
  defaultValue = [],
  onValueChange,
  separators = ['Enter', ','],
  maxTags,
  className,
  placeholder,
  ...props
}: TagInputProps) {
  const [inner, setInner] = useState(defaultValue);
  const tags = value ?? inner;
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const control = useFieldControl(props);
  const full = maxTags !== undefined && tags.length >= maxTags;

  const commit = (next: string[]) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  const add = (raw: string) => {
    const incoming = raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .filter((t, i, all) => all.indexOf(t) === i && !tags.includes(t));
    if (!incoming.length) return;
    const room =
      maxTags === undefined
        ? incoming
        : incoming.slice(0, Math.max(0, maxTags - tags.length));
    commit([...tags, ...room]);
    setDraft('');
  };

  return (
    <div
      className={cx(s.tagInput, className)}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          onRemove={() => commit(tags.filter((t) => t !== tag))}
        >
          {tag}
        </Chip>
      ))}
      <input
        {...control}
        ref={inputRef}
        className={s.tagInputField}
        value={draft}
        placeholder={full ? undefined : placeholder}
        disabled={full || props.disabled}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (separators.includes(e.key) && draft.trim()) {
            e.preventDefault();
            add(draft);
          } else if (e.key === 'Backspace' && !draft && tags.length) {
            commit(tags.slice(0, -1));
          }
        }}
        onPaste={(e) => {
          const text = e.clipboardData.getData('text');
          if (text.includes(',')) {
            e.preventDefault();
            add(text);
          }
        }}
        onBlur={() => draft.trim() && add(draft)}
      />
    </div>
  );
}
