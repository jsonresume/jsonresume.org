import { RegistryProvider, useAtomValue } from '@effect/atom-react';
import { accountAtom, useSignedInHint } from '@repo/api-client';
import { Button } from '@jsonresume/ui';
import { AsyncResult } from 'effect/reactivity';
import type { ReactNode } from 'react';

type Render = (username: string | null) => ReactNode;

function FromAccount({ children }: { children: Render }) {
  const account = useAtomValue(accountAtom);
  const live = AsyncResult.isSuccess(account) && account.value.public;
  return children(live ? account.value.username : null);
}

/**
 * The signed-in visitor's username when their page is live, to show
 * themes on their own resume (owners' views aren't counted), else null.
 * The account is only asked for when the browser looks signed in. Inside
 * a RegistryProvider.
 */
export function OwnPage({ children }: { children: Render }) {
  const signedIn = useSignedInHint();
  return signedIn ? (
    <FromAccount>{children}</FromAccount>
  ) : (
    <>{children(null)}</>
  );
}

/** "Live preview": on the visitor's own page when signed in and live. */
export function LivePreview({
  slug,
  href,
}: {
  slug: string;
  href: (slug: string, username?: string) => string;
}) {
  return (
    <RegistryProvider>
      <OwnPage>
        {(me) => (
          <Button asChild size="lg">
            <a href={href(slug, me ?? undefined)}>
              {me ? 'Preview on your resume' : 'Live preview'}
            </a>
          </Button>
        )}
      </OwnPage>
    </RegistryProvider>
  );
}
