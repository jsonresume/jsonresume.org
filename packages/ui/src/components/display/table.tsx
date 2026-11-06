'use client';

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx';
import * as s from './display.css';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  caption?: ReactNode;
  /** Names the scrolling area for keyboard users; defaults to the caption. */
  scrollLabel?: string;
}

/** True while the element is wider inside than out. */
function useOverflows() {
  const ref = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const check = () => setOverflows(el.scrollWidth > el.clientWidth + 1);
    const observer = new ResizeObserver(check);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, []);
  return [ref, overflows] as const;
}

/**
 * A data table that scrolls horizontally on narrow screens. While it
 * scrolls, its area is a focusable, named region, so a keyboard can too.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { caption, scrollLabel, className, children, ...props },
  ref
) {
  const [wrap, overflows] = useOverflows();
  const label =
    scrollLabel ??
    (typeof caption === 'string' ? caption : props['aria-label']) ??
    'Table';
  return (
    <div
      ref={wrap}
      className={s.tableWrap}
      {...(overflows && {
        tabIndex: 0,
        role: 'region',
        'aria-label': label,
      })}
    >
      <table ref={ref} className={cx(s.table, className)} {...props}>
        {caption ? <caption className={s.caption}>{caption}</caption> : null}
        {children}
      </table>
    </div>
  );
});

export function Th({
  className,
  scope = 'col',
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th scope={scope} className={cx(s.th, className)} {...props} />;
}

export function Td({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cx(s.td, className)} {...props} />;
}
