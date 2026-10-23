import { Slot } from '@radix-ui/react-slot';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { Button } from '../button/button';
import * as s from './navigation.css';

/* TabNav */

export interface TabNavProps extends HTMLAttributes<HTMLElement> {
  /** Names the navigation, e.g. "Profile". */
  label: string;
}

/**
 * Navigation between sibling pages of one area, styled as tabs. Each item
 * is a real link; use Tabs instead for panels within a single page.
 */
export function TabNav({ label, className, children, ...props }: TabNavProps) {
  return (
    <nav aria-label={label} className={className} {...props}>
      <ul className={s.tabNav}>{children}</ul>
    </nav>
  );
}

export interface TabNavLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  asChild?: boolean;
}

export const TabNavLink = forwardRef<HTMLAnchorElement, TabNavLinkProps>(
  function TabNavLink(
    { active = false, asChild = false, className, ...props },
    ref
  ) {
    const Comp = asChild ? Slot : 'a';
    return (
      <li>
        <Comp
          ref={ref}
          className={cx(s.tabLink, className)}
          aria-current={active ? 'page' : undefined}
          {...props}
        />
      </li>
    );
  }
);

/* Pagination */

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
  return (
    <nav aria-label={label} className={className} {...props}>
      <ul className={s.pagination}>
        <li>{item(page - 1, '‹', { ariaLabel: previousLabel })}</li>
        {pageWindow(page, pageCount).map((p, i) =>
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

/* BackLink */

export interface BackLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
}

/** Return to the parent list or page. Name it after the destination: "Back to jobs". */
export const BackLink = forwardRef<HTMLAnchorElement, BackLinkProps>(
  function BackLink({ asChild = false, className, children, ...props }, ref) {
    const Comp = asChild ? Slot : 'a';
    return (
      <Comp ref={ref} className={cx(s.backLink, className)} {...props}>
        {asChild ? (
          children
        ) : (
          <>
            <span aria-hidden="true">←</span>
            {children}
          </>
        )}
      </Comp>
    );
  }
);
