import { RegistryProvider, useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  AccountMenu,
  AppNav,
  AppShell,
  DropdownMenuItem,
  Logo,
  Link,
  Skeleton,
  Stack,
  Text,
  type AppNavProps,
} from '@jsonresume/ui';
import { sessionAtom, signOutAtom, useIsClient } from '@repo/api-client';
import { proxiedImage } from '@repo/images/url';
import { AsyncResult } from 'effect/reactivity';
import { useEffect, type ReactNode } from 'react';
import {
  BriefcaseIcon,
  ChartIcon,
  CompassIcon,
  FileIcon,
  GearIcon,
  OpenIcon,
  PenIcon,
} from './icons';
import { Prefetch } from './Prefetch';
import { SessionProvider, useSession } from './session';

export interface DashboardShellProps {
  /** The current path, to mark the open page in the navigation. */
  pathname: string;
  /** The app's router links for the navigation. */
  renderLink?: AppNavProps['renderLink'];
  children: ReactNode;
}

const nav = [
  { label: 'Overview', href: '/dashboard', icon: <ChartIcon /> },
  { label: 'Editor', href: '/dashboard/editor', icon: <PenIcon /> },
  { label: 'Resume', href: '/dashboard/resume', icon: <FileIcon /> },
  { label: 'Pathways', href: '/dashboard/pathways', icon: <CompassIcon /> },
  { label: 'Jobs', href: '/dashboard/jobs', icon: <BriefcaseIcon /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <GearIcon /> },
];

function Loading() {
  return (
    <Stack gap={6} aria-busy="true">
      <Skeleton height="2.25rem" width="12rem" />
      <Skeleton height="7rem" />
      <Skeleton height="16rem" />
    </Stack>
  );
}

function Account() {
  const user = useSession();
  const signOut = useAtomSet(signOutAtom, { mode: 'promiseExit' });
  return (
    <AccountMenu
      name={user.username}
      email={user.email ?? undefined}
      avatarUrl={proxiedImage(user.github?.avatarUrl, 64)}
      showName
      onSignOut={() => void signOut({}).then(() => window.location.assign('/'))}
    >
      <DropdownMenuItem asChild>
        <a href={`/@${user.username}`}>
          <OpenIcon /> View your page
        </a>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <a href="/dashboard/settings">Settings</a>
      </DropdownMenuItem>
    </AccountMenu>
  );
}

/** Waits for the session; without one, sends the visitor to sign in. */
function Gate({
  children,
  pathname,
  top,
}: {
  children: ReactNode;
  pathname: string;
  top: (node: ReactNode) => ReactNode;
}) {
  const session = useAtomValue(sessionAtom);
  const failed = AsyncResult.isFailure(session);
  useEffect(() => {
    if (failed)
      window.location.replace(
        `/signin?next=${encodeURIComponent(
          location.pathname + location.search
        )}`
      );
  }, [failed]);
  return (
    <>
      <Prefetch pathname={pathname} />
      {AsyncResult.isSuccess(session) ? (
        <SessionProvider value={session.value}>{top(children)}</SessionProvider>
      ) : (
        <Loading />
      )}
    </>
  );
}

/**
 * The signed-in app: full-screen shell with a sidebar, the account menu, and
 * the page. Rendered in the browser only (pages are prerendered empty).
 */
export function DashboardShell({
  pathname,
  renderLink,
  children,
}: DashboardShellProps) {
  const isClient = useIsClient();
  const items = nav.map((item) => ({
    ...item,
    current:
      item.href === '/dashboard'
        ? pathname === item.href
        : pathname.startsWith(item.href),
  }));
  const shell = (top: ReactNode, page: ReactNode) => (
    <AppShell
      brand={
        <Logo asChild mark>
          <a href="/">JSON Resume</a>
        </Logo>
      }
      nav={
        <AppNav
          items={items}
          label="Dashboard"
          {...(renderLink ? { renderLink } : {})}
        />
      }
      top={top}
      footer={
        <Text as="span" size="xs">
          <Link tone="neutral" href="/">
            jsonresume.org
          </Link>
        </Text>
      }
    >
      {page}
    </AppShell>
  );
  if (!isClient) return shell(null, <Loading />);
  return (
    <RegistryProvider>
      <Gate pathname={pathname} top={(page) => shell(<Account />, page)}>
        {children}
      </Gate>
    </RegistryProvider>
  );
}
