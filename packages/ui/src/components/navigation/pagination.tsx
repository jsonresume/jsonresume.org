import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Button } from '../button/button';
import * as s from './navigation.css';

/** Page numbers to show: always the first, last and a window around the current page. */
export function pageWindow(
  page: number,
  pageCount: number,
  siblings = 1
): Array<number | 'gap'> {
  const pages = new Set<number>([1, pageCount]);
  for (let p = page - siblings; p <= page + siblings; p++)
    if (p >= 1 && p <= pageCount) pages.add(p);
  const sorted = [...pages].sort((a, b) => a - b);
  const out: Array<number | 'gap'> = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev > 1)
      out.push(p - prev === 2 ? prev + 1 : 'gap');
    out.push(p);
  });
  return out;
}

export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  page: number;
  pageCount: number;
  /** Builds a link for each page (server-friendly). */
  href?: (page: number) => string;
  /** Or handle page changes in place. */
  onPageChange?: (page: number) => void;
  label?: string;
  previousLabel?: string;
  nextLabel?: string;
}

/** Numbered pages with previous and next. Renders links when href is given, buttons otherwise. */
export function Pagination({
  page,
  pageCount,
  href,
  onPageChange,
  label = 'Pagination',
  previousLabel = 'Previous',
  nextLabel = 'Next',
  className,
  ...props
}: PaginationProps) {
  if (pageCount <= 1) return null;
  const item = (
    target: number,
    content: ReactNode,
    extra: { current?: boolean; ariaLabel?: string } = {}
  ) => {
    const disabled = target < 1 || target > pageCount;
    const common = {
      className: s.pageItem,
      'aria-current': extra.current ? ('page' as const) : undefined,
      'aria-label': extra.ariaLabel,
      'aria-disabled': disabled || undefined,
    };
    return href && !disabled ? (
      <a href={href(target)} {...common}>
        {content}
      </a>
    ) : (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onPageChange?.(target)}
        {...common}
      >
        {content}
      </button>
    );
  };
  const pages = (siblings: number, fit: string) => (
    <ul className={cx(s.pagination, fit)}>
      <li>{item(page - 1, '‹', { ariaLabel: previousLabel })}</li>
      {pageWindow(page, pageCount, siblings).map((p, i) =>
        p === 'gap' ? (
          <li key={`gap-${i}`} className={s.pageGap} aria-hidden="true">
            …
          </li>
        ) : (
          <li key={p}>
            {item(p, p, { current: p === page, ariaLabel: `Page ${p}` })}
          </li>
        )
      )}
      <li>{item(page + 1, '›', { ariaLabel: nextLabel })}</li>
    </ul>
  );
  // Both render; CSS shows the one that fits (the other is display: none,
  // so screen readers meet only one).
  return (
    <nav
      aria-label={label}
      className={cx(s.paginationNav, className)}
      {...props}
    >
      {pages(1, s.pagesWide)}
      {pages(0, s.pagesNarrow)}
    </nav>
  );
}

export interface LoadMoreProps {
  /** How many items are showing, and how many exist (if known). */
  shown: number;
  total?: number;
  onLoadMore: () => void;
  loading?: boolean;
  label?: string;
}

/** Appends the next page in place, with a running count. */
export function LoadMore({
  shown,
  total,
  onLoadMore,
  loading = false,
  label = 'Load more',
}: LoadMoreProps) {
  const done = total !== undefined && shown >= total;
  return (
    <div className={s.loadMore}>
      <p className={s.loadMoreStatus} aria-live="polite">
        {total !== undefined
          ? `Showing ${shown} of ${total}`
          : `Showing ${shown}`}
      </p>
      {done ? null : (
        <Button onClick={onLoadMore} loading={loading}>
          {label}
        </Button>
      )}
    </div>
  );
}
