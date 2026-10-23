import { Slot } from '@radix-ui/react-slot';
import {
  forwardRef,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { cx } from '../../utils/cx';
import * as s from './display.css';

/* Badge */

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    s.BadgeVariants {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone, className, ...props },
  ref
) {
  return (
    <span ref={ref} className={cx(s.badge({ tone }), className)} {...props} />
  );
});

/* Callout */

type CalloutTone = 'note' | 'brand' | 'info' | 'success' | 'warning' | 'danger';

const calloutIcons: Record<CalloutTone, ReactNode> = {
  note: <path d="M10 6v5M10 14h.01" />,
  brand: <path d="M10 6v5M10 14h.01" />,
  info: <path d="M10 9v5M10 6h.01" />,
  success: <path d="m6.5 10.5 2.5 2.5 4.5-5.5" />,
  warning: <path d="M10 6.5v4M10 13.5h.01" />,
  danger: <path d="m7.5 7.5 5 5M12.5 7.5l-5 5" />,
};

export interface CalloutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: CalloutTone;
  title?: ReactNode;
  /** Replace the default icon, or pass `null` to hide it. */
  icon?: ReactNode;
}

/**
 * A highlighted note in running content. Warnings and errors use role
 * "alert" only when rendered in response to an action; static callouts are
 * plain content.
 */
export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  function Callout(
    { tone = 'note', title, icon, className, children, ...props },
    ref
  ) {
    const iconNode =
      icon === undefined ? (
        <svg
          className={s.calloutIcon}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="10" cy="10" r="8" />
          {calloutIcons[tone]}
        </svg>
      ) : (
        icon
      );
    return (
      <div ref={ref} className={cx(s.callout({ tone }), className)} {...props}>
        {iconNode ? <span aria-hidden="true">{iconNode}</span> : null}
        <div className={s.calloutBody}>
          {title ? <p className={s.calloutTitle}>{title}</p> : null}
          <div>{children}</div>
        </div>
      </div>
    );
  }
);

/* Spinner, Skeleton, Progress */

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Announced to assistive technology. */
  label?: string;
}

export function Spinner({
  label = 'Loading',
  className,
  ...props
}: SpinnerProps) {
  return (
    <span role="status" className={className} {...props}>
      <span className={s.spinner} aria-hidden="true" />
      <span className={visuallyHidden}>{label}</span>
    </span>
  );
}

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  width?: string;
  height?: string;
}

/** Placeholder while content loads. Decorative: pair it with a Spinner or aria-busy region. */
export function Skeleton({
  width = '100%',
  height = '1em',
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cx(s.skeleton, className)}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** 0 to `max`; omit for an indeterminate task. */
  value?: number;
  max?: number;
  /** Accessible name, e.g. "Upload progress". */
  label: string;
}

export function Progress({
  value,
  max = 100,
  label,
  className,
  ...props
}: ProgressProps) {
  const clamped =
    value === undefined ? undefined : Math.min(Math.max(value, 0), max);
  const percent = clamped === undefined ? 0 : (clamped / max) * 100;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      className={cx(s.progress, className)}
      {...props}
    >
      <div
        className={s.progressBar}
        style={{ transform: `translateX(${percent - 100}%)` }}
      />
    </div>
  );
}

/* EmptyState */

export interface EmptyStateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title,
  icon,
  action,
  className,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div className={cx(s.emptyState, className)} {...props}>
      {icon ? (
        <span className={s.emptyIcon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <p className={s.emptyTitle}>{title}</p>
      {children ? <div className={s.emptyText}>{children}</div> : null}
      {action}
    </div>
  );
}

/* Card */

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    s.CardVariants {
  asChild?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { asChild = false, tone, interactive, className, ...props },
  ref
) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cx(s.card({ tone, interactive }), className)}
      {...props}
    />
  );
});

export const CardMedia = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function CardMedia({ className, ...props }, ref) {
  return <div ref={ref} className={cx(s.cardMedia, className)} {...props} />;
});

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function CardHeader({ className, ...props }, ref) {
  return <div ref={ref} className={cx(s.cardHeader, className)} {...props} />;
});

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 2 | 3 | 4;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ level = 3, className, ...props }, ref) {
    const Tag = `h${level}` as const;
    return <Tag ref={ref} className={cx(s.cardTitle, className)} {...props} />;
  }
);

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return (
    <p ref={ref} className={cx(s.cardDescription, className)} {...props} />
  );
});

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function CardContent({ className, ...props }, ref) {
  return <div ref={ref} className={cx(s.cardContent, className)} {...props} />;
});

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function CardFooter({ className, ...props }, ref) {
  return <div ref={ref} className={cx(s.cardFooter, className)} {...props} />;
});

/* Table */

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  caption?: ReactNode;
}

/** A data table that scrolls horizontally on narrow screens. */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { caption, className, children, ...props },
  ref
) {
  return (
    <div className={s.tableWrap}>
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

/* Avatar */

export interface AvatarProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  /** The person's name: used for the alt text and the initials fallback. */
  name: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'square' | 'circle';
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export function Avatar({
  src,
  name,
  size,
  shape,
  className,
  alt,
  ...props
}: AvatarProps) {
  return (
    <span className={cx(s.avatar({ size, shape }), className)}>
      {src ? (
        <img className={s.avatarImage} src={src} alt={alt ?? name} {...props} />
      ) : (
        <span role="img" aria-label={name}>
          {initials(name)}
        </span>
      )}
    </span>
  );
}
