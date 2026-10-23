import type { ReactNode } from 'react';
import { Button } from '../button/button';
import { Card, CardContent } from '../display/display';
import * as s from './status.css';

export interface SignInGateProps {
  /** What signing in unlocks, as a heading: "Track your applications". */
  title: ReactNode;
  description?: ReactNode;
  /** Short list of what the reader gets. */
  features?: ReactNode[];
  /** Link to the sign-in route… */
  signInHref?: string;
  /** …or a handler (e.g. signIn('github')). */
  onSignIn?: () => void;
  signInLabel?: string;
  level?: 1 | 2 | 3;
}

const GitHubMark = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path
      fill="currentColor"
      d="M8 .2a8 8 0 0 0-2.5 15.6c.4 0 .5-.2.5-.4v-1.5c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.5 7.5 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.6 3.9.3.3.6.8.6 1.5v2.2c0 .2.1.5.6.4A8 8 0 0 0 8 .2Z"
    />
  </svg>
);

/** Explains that a feature needs an account, and offers Sign in with GitHub. */
export function SignInGate({
  title,
  description,
  features = [],
  signInHref,
  onSignIn,
  signInLabel = 'Sign in with GitHub',
  level = 2,
}: SignInGateProps) {
  const Heading = `h${level}` as const;
  return (
    <Card tone="subtle">
      <CardContent>
        <div className={s.pageState({ size: 'panel' })}>
          <Heading className={s.stateTitle}>{title}</Heading>
          {description ? <p className={s.stateText}>{description}</p> : null}
          {features.length ? (
            <ul className={s.gateFeatures}>
              {features.map((f, i) => (
                <li key={i} className={s.gateFeature}>
                  <span aria-hidden="true">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          ) : null}
          <div className={s.stateActions}>
            {signInHref ? (
              <Button asChild variant="ink" size="lg">
                <a href={signInHref}>
                  <GitHubMark /> {signInLabel}
                </a>
              </Button>
            ) : (
              <Button variant="ink" size="lg" onClick={onSignIn}>
                <GitHubMark /> {signInLabel}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
