import { Button } from '@jsonresume/ui';
import { SIGNED_IN_HINT } from '@repo/api/cookies';
import { useSignedInHint } from '@repo/api-client/hints';
import { useEffect } from 'react';
import * as s from './headerAuth.css';
import { paths } from './links';
import { SiteLink } from './SiteLink';

/**
 * Runs in <head> before the page paints: marks <html data-auth="in"> when
 * the hint cookie says this browser is signed in. Pages are prerendered, so
 * this is what lets the header be right on the first frame.
 */
export const authHintScript = `try{if(document.cookie.split('; ').indexOf('${SIGNED_IN_HINT}=1')>-1)document.documentElement.dataset.auth='in'}catch(e){}`;

/**
 * The header's end: Sign in and Sign up, or Dashboard. Both are rendered
 * and CSS shows one (see headerAuth.css.ts), so server, first paint and
 * hydration agree. Signing in or out without a reload updates the mark.
 */
export function HeaderAuth() {
  // Read again after each render: the hook reports signed out while
  // hydrating, and trusting that would flash the wrong buttons.
  const signedIn = useSignedInHint();
  useEffect(() => {
    const now = document.cookie.split('; ').includes(`${SIGNED_IN_HINT}=1`);
    document.documentElement.dataset['auth'] = now ? 'in' : 'out';
  }, [signedIn]);
  return (
    <>
      <span className={s.signedOut}>
        <Button asChild size="sm" variant="ghost">
          <SiteLink href={paths.signIn}>Sign in</SiteLink>
        </Button>
        <Button asChild size="sm" variant="primary">
          <SiteLink href={paths.signUp}>Sign up</SiteLink>
        </Button>
      </span>
      <span className={s.signedIn}>
        <Button asChild size="sm" variant="ink">
          <SiteLink href={paths.dashboard}>Dashboard</SiteLink>
        </Button>
      </span>
    </>
  );
}
