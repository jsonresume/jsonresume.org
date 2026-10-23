'use client';

import { assignInlineVars } from '@vanilla-extract/dynamic';
import { useRef, useState, type ReactNode } from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { Button } from '../button/button';
import * as s from './workspace.css';

export type SwipeDecision = 'left' | 'right';

export interface SwipeDeckProps<T> {
  items: T[];
  renderCard: (item: T) => ReactNode;
  /** Accessible name of each card, e.g. the job title. */
  itemLabel: (item: T) => string;
  onDecision: (item: T, decision: SwipeDecision) => void;
  leftLabel?: string;
  rightLabel?: string;
  emptyState?: ReactNode;
  /** Distance in px that counts as a decision. */
  threshold?: number;
}

/**
 * Decide on cards one at a time: drag left or right, use the buttons, or
 * the arrow keys when the deck has focus. Decisions are announced.
 */
export function SwipeDeck<T>({
  items,
  renderCard,
  itemLabel,
  onDecision,
  leftLabel = 'Pass',
  rightLabel = 'Interested',
  emptyState = 'No more cards',
  threshold = 110,
}: SwipeDeckProps<T>) {
  const [index, setIndex] = useState(0);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const start = useRef(0);
  const current = items[index];
  const next = items[index + 1];

  const decide = (decision: SwipeDecision) => {
    if (current === undefined) return;
    onDecision(current, decision);
    setAnnouncement(
      `${decision === 'right' ? rightLabel : leftLabel}: ${itemLabel(current)}.`
    );
    setDx(0);
    setIndex((i) => i + 1);
  };

  return (
    <div className={s.deck}>
      <div
        className={s.deckStack}
        tabIndex={0}
        role="group"
        aria-roledescription="card deck"
        aria-label={
          current
            ? `${itemLabel(
                current
              )}. Left arrow to ${leftLabel.toLowerCase()}, right arrow for ${rightLabel.toLowerCase()}.`
            : 'Card deck, empty'
        }
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') decide('left');
          else if (e.key === 'ArrowRight') decide('right');
          else return;
          e.preventDefault();
        }}
      >
        {current === undefined ? (
          <div className={s.deckEmpty}>{emptyState}</div>
        ) : (
          <>
            {next !== undefined ? (
              <div
                className={s.deckCard({ position: 'next' })}
                aria-hidden="true"
              >
                {renderCard(next)}
              </div>
            ) : null}
            <div
              key={index}
              className={s.deckCard({ position: 'top' })}
              data-dragging={dragging}
              style={assignInlineVars({
                [s.dragX]: `${dx}px`,
                [s.dragAngle]: `${dx / 24}deg`,
              })}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                start.current = e.clientX;
                setDragging(true);
              }}
              onPointerMove={(e) =>
                dragging && setDx(e.clientX - start.current)
              }
              onPointerUp={() => {
                setDragging(false);
                if (Math.abs(dx) > threshold) decide(dx > 0 ? 'right' : 'left');
                else setDx(0);
              }}
            >
              <span
                className={s.deckStamp({
                  side: 'right',
                  visible: dx > threshold / 2,
                })}
                aria-hidden="true"
              >
                {rightLabel}
              </span>
              <span
                className={s.deckStamp({
                  side: 'left',
                  visible: dx < -threshold / 2,
                })}
                aria-hidden="true"
              >
                {leftLabel}
              </span>
              {renderCard(current)}
            </div>
          </>
        )}
      </div>
      <div className={s.deckActions}>
        <Button
          variant="danger"
          disabled={current === undefined}
          onClick={() => decide('left')}
        >
          {leftLabel}
        </Button>
        <Button
          variant="primary"
          disabled={current === undefined}
          onClick={() => decide('right')}
        >
          {rightLabel}
        </Button>
      </div>
      <p className={visuallyHidden} aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
