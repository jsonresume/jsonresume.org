import type { ReactNode } from 'react';
import * as s from './page.css';

export interface AuthCardProps {
  /** The page's h1, e.g. "Sign in". */
  title: string;
  description?: ReactNode;
  children: ReactNode;
  /** Under the card's content, e.g. "New here? Create an account". */
  footer?: ReactNode;
}

/** A centred card for sign-in, sign-up and other single-task account pages. */
export function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className={s.authWrap}>
      <section className={s.authCard} aria-labelledby="auth-title">
        <div className={s.authHead}>
          <h1 id="auth-title" className={s.authTitle}>
            {title}
          </h1>
          {description ? <div>{description}</div> : null}
        </div>
        {children}
        {footer ? <p className={s.authFooter}>{footer}</p> : null}
      </section>
    </div>
  );
}
