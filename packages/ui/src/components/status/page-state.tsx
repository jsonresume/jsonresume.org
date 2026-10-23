import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Button } from '../button/button';
import { Spinner } from '../display/display';
import * as s from './status.css';

type Kind = 'loading' | 'error' | 'not-found' | 'empty';

export interface PageStateProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  kind: Kind;
  title?: ReactNode;
  description?: ReactNode;
  /** Small label above the title, e.g. "404". */
  code?: ReactNode;
  /** Buttons or links: Go home, Back to jobs. */
  actions?: ReactNode;
  /** Adds a Try again button for errors. */
  onRetry?: () => void;
  /** Technical details, collapsed by default. */
  details?: string;
  /** Whole page (default) or a panel within one. */
  size?: 'page' | 'panel';
  /** Heading level of the title. */
  level?: 1 | 2 | 3;
}

const defaults: Record<Kind, { title: string; description: string }> = {
  loading: { title: 'Loading', description: '' },
  error: {
    title: 'Something went wrong',
    description: 'This part of the page failed to load. Try again in a moment.',
  },
  'not-found': {
    title: 'Page not found',
    description: 'The page may have moved, or the address may be wrong.',
  },
  empty: { title: 'Nothing here yet', description: '' },
};

const icons: Record<Exclude<Kind, 'loading'>, ReactNode> = {
  error: (
    <path d="M12 8v5m0 3h.01M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z" />
  ),
  'not-found': (
    <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4M8.5 11h5" />
  ),
  empty: <path d="M4 7h16v12H4zM4 7l2-3h12l2 3M9 11h6" />,
};

/** Whole-page or panel states: loading, error, not found, empty. */
export function PageState({
  kind,
  title,
  description,
  code,
  actions,
  onRetry,
  details,
  size,
  level = 1,
  className,
  ...props
}: PageStateProps) {
  const Heading = `h${level}` as const;
  const copy = defaults[kind];
  const isLoading = kind === 'loading';
  return (
    <section
      className={cx(s.pageState({ size }), className)}
      aria-busy={isLoading || undefined}
      role={kind === 'error' ? 'alert' : undefined}
      {...props}
    >
      {isLoading ? (
        <Spinner label={typeof title === 'string' ? title : copy.title} />
      ) : (
        <svg
          className={s.stateIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {icons[kind]}
        </svg>
      )}
      {code ? <p className={s.stateCode}>{code}</p> : null}
      {isLoading ? (
        // The spinner's status region announces it; this is the visible copy.
        <p className={s.stateText} aria-hidden="true">
          {title ?? copy.title}
        </p>
      ) : (
        <Heading className={s.stateTitle}>{title ?? copy.title}</Heading>
      )}
      {description ?? copy.description ? (
        <p className={s.stateText}>{description ?? copy.description}</p>
      ) : null}
      {onRetry || actions ? (
        <div className={s.stateActions}>
          {onRetry ? (
            <Button variant="primary" onClick={onRetry}>
              Try again
            </Button>
          ) : null}
          {actions}
        </div>
      ) : null}
      {details ? (
        <details className={s.stateDetails}>
          <summary>Technical details</summary>
          <pre>{details}</pre>
        </details>
      ) : null}
    </section>
  );
}
