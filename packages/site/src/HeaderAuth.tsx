import { Button } from '@jsonresume/ui';
import { useSignedInHint } from '@repo/api-client/hints';
import { paths } from './links';
import { SiteLink } from './SiteLink';

/**
 * The header's end: Sign in and Sign up, or Dashboard once signed in. Pages
 * are prerendered, so the signed-in state comes from a hint cookie, read
 * after hydration (the server and first client render show signed out).
 */
export function HeaderAuth() {
  const signedIn = useSignedInHint();
  if (signedIn) {
    return (
      <Button asChild size="sm" variant="ink">
        <SiteLink href={paths.dashboard}>Dashboard</SiteLink>
      </Button>
    );
  }
  return (
    <>
      <Button asChild size="sm" variant="ghost">
        <SiteLink href={paths.signIn}>Sign in</SiteLink>
      </Button>
      <Button asChild size="sm" variant="primary">
        <SiteLink href={paths.signUp}>Sign up</SiteLink>
      </Button>
    </>
  );
}
