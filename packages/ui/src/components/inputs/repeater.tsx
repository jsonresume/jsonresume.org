'use client';

import { useState, type ReactNode } from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { Button } from '../button/button';
import * as s from './inputs.css';

export interface RepeaterProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  /** A blank entry for Add. */
  create: () => T;
  /** Heading for each entry, e.g. the job title or "Untitled position". */
  itemLabel: (item: T, index: number) => string;
  /** The fields for one entry. */
  renderItem: (item: T, update: (next: T) => void, index: number) => ReactNode;
  /** Stable keys keep focus on the right entry when reordering. */
  getKey?: (item: T, index: number) => string | number;
  addLabel?: string;
  /** Names the kind of entry in announcements, e.g. "position". */
  noun?: string;
  /** Heading level for each entry's title, to fit the page outline. */
  headingLevel?: 2 | 3 | 4 | 5;
}

const Arrow = ({ up }: { up?: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path
      d={up ? 'M2.5 7.5 6 4l3.5 3.5' : 'M2.5 4.5 6 8l3.5-3.5'}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
  </svg>
);

/**
 * Add, remove and reorder entries of one shape: work, education, profiles.
 * Changes are announced, and every control names the entry it acts on.
 */
export function Repeater<T>({
  items,
  onChange,
  create,
  itemLabel,
  renderItem,
  getKey = (_item, i) => i,
  addLabel = 'Add entry',
  noun = 'entry',
  headingLevel = 3,
}: RepeaterProps<T>) {
  const Heading = `h${headingLevel}` as const;
  const [announcement, setAnnouncement] = useState('');

  const move = (from: number, to: number) => {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    if (moved === undefined) return;
    next.splice(to, 0, moved);
    onChange(next);
    setAnnouncement(
      `Moved ${itemLabel(moved, to)} to position ${to + 1} of ${items.length}.`
    );
  };

  return (
    <div className={s.repeater}>
      {items.map((item, i) => {
        const name = itemLabel(item, i);
        return (
          <section
            key={getKey(item, i)}
            className={s.repeaterItem}
            aria-label={name}
          >
            <div className={s.repeaterHeader}>
              <Heading className={s.repeaterTitle}>{name}</Heading>
              <Button
                variant="ghost"
                size="icon"
                disabled={i === 0}
                onClick={() => move(i, i - 1)}
              >
                <Arrow up />
                <span className={visuallyHidden}>Move {name} up</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={i === items.length - 1}
                onClick={() => move(i, i + 1)}
              >
                <Arrow />
                <span className={visuallyHidden}>Move {name} down</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Remove ${name}`}
                onClick={() => {
                  onChange(items.filter((_, j) => j !== i));
                  setAnnouncement(`Removed ${name}.`);
                }}
              >
                Remove
              </Button>
            </div>
            <div className={s.repeaterBody}>
              {renderItem(
                item,
                (next) => onChange(items.map((it, j) => (j === i ? next : it))),
                i
              )}
            </div>
          </section>
        );
      })}
      <div>
        <Button
          onClick={() => {
            onChange([...items, create()]);
            setAnnouncement(`Added a new ${noun}.`);
          }}
        >
          {addLabel}
        </Button>
      </div>
      <p className={visuallyHidden} aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
