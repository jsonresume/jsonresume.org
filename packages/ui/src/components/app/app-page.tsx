import type { ReactNode } from 'react';
import * as s from './page.css';

export interface AppPageProps {
  /** The page's one h1. */
  title: ReactNode;
  description?: ReactNode;
  /** Buttons at the end of the header. */
  actions?: ReactNode;
  /** The one filter row (date range first), above everything it scopes. */
  toolbar?: ReactNode;
  children: ReactNode;
}

/** A page inside AppShell: title and actions, the filter row, then content. */
export function AppPage({
  title,
  description,
  actions,
  toolbar,
  children,
}: AppPageProps) {
  return (
    <div className={s.page}>
      <div className={s.header}>
        <div className={s.titles}>
          <h1 className={s.title}>{title}</h1>
          {description ? <p className={s.description}>{description}</p> : null}
        </div>
        {actions ? <div className={s.actions}>{actions}</div> : null}
      </div>
      {toolbar ? (
        <div className={s.toolbar} role="group" aria-label="Filters">
          {toolbar}
        </div>
      ) : null}
      {children}
    </div>
  );
}
