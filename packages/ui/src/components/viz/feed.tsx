import type { ReactNode } from 'react';
import * as s from './viz.css';

export interface ActivityItem {
  id: string | number;
  /** ISO date-time or Date. */
  time: string | Date;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
}

export interface ActivityFeedProps {
  items: ActivityItem[];
  label?: string;
  /** Reference time for "2 hours ago" (defaults to now). Pass it for stable server rendering. */
  now?: Date;
  locale?: string;
}

const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['week', 604_800],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
];

/** "3 hours ago", "yesterday" for a past time. */
export function relativeTime(time: Date, now: Date, locale = 'en') {
  const seconds = Math.round((time.getTime() - now.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size)
      return rtf.format(Math.round(seconds / size), unit);
  }
  return rtf.format(0, 'minute');
}

/** Time-stamped events, newest first, with relative times. */
export function ActivityFeed({
  items,
  label = 'Recent activity',
  now = new Date(),
  locale,
}: ActivityFeedProps) {
  return (
    <ol className={s.feed} aria-label={label}>
      {items.map((item) => {
        const time = new Date(item.time);
        return (
          <li key={item.id} className={s.feedItem}>
            <span className={s.feedIcon} aria-hidden="true">
              {item.icon ?? '•'}
            </span>
            <p className={s.feedTitle}>{item.title}</p>
            <time
              className={s.feedTime}
              dateTime={time.toISOString()}
              title={time.toLocaleString(locale)}
            >
              {relativeTime(time, now, locale)}
            </time>
            {item.description ? (
              <p className={s.feedText}>{item.description}</p>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export interface TimelineEntry {
  /** Display date or range, e.g. "2019 – Present". */
  date: string;
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  /** Block content under the description, such as a list of highlights. */
  details?: ReactNode;
  /** Highlights the current role. */
  current?: boolean;
}

export interface TimelineProps {
  items: TimelineEntry[];
  label?: string;
  headingLevel?: 2 | 3 | 4;
}

/** A vertical career or project timeline. */
export function Timeline({
  items,
  label = 'Timeline',
  headingLevel = 3,
}: TimelineProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <ol className={s.timeline} aria-label={label}>
      {items.map((item, i) => (
        <li key={i} className={s.timelineItem}>
          <span
            className={s.timelineDot({ current: item.current })}
            aria-hidden="true"
          />
          <span className={s.timelineDate}>{item.date}</span>
          <Heading className={s.timelineTitle}>{item.title}</Heading>
          {item.subtitle ? (
            <p className={s.timelineSubtitle}>{item.subtitle}</p>
          ) : null}
          {item.description ? (
            <p className={s.timelineText}>{item.description}</p>
          ) : null}
          {item.details ? (
            <div className={s.timelineText}>{item.details}</div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
