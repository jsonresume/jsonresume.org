import { Button, PageState } from '@jsonresume/ui';
import { captureError } from '@repo/posthog/browser';
import type { ErrorComponentProps } from '@tanstack/react-router';

/** A page that crashed: say so, offer a retry and a way home. */
export function RouteError({ error, reset }: ErrorComponentProps) {
  return (
    <PageState
      kind="error"
      title="Something went wrong"
      description="This page hit an error. Try again, or head back home."
      onRetry={reset}
      details={error instanceof Error ? error.message : String(error)}
      actions={
        <Button asChild variant="secondary">
          <a href="/">Go home</a>
        </Button>
      }
    />
  );
}

/**
 * Router options for crashed pages. The router only calls onCatch where a
 * route has an error component, so both are set together; React caught the
 * error, so PostHog's own capture never sees it.
 */
export const routeErrors = {
  defaultErrorComponent: RouteError,
  defaultOnCatch: captureError,
};
