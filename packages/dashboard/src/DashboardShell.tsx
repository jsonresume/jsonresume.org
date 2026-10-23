import { RegistryProvider, useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  AccountMenu,
  AppNav,
  AppShell,
  DropdownMenuItem,
  Logo,
  Skeleton,
  type AppNavProps,
} from '@jsonresume/ui';
import { sessionAtom, signOutAtom, useIsClient } from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';
import { useEffect, type ReactNode } from 'react';
import * as s from './dashboard.css';
import { ChartIcon, FileIcon, GearIcon, OpenIcon } from './icons';
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
  { label: 'Resume', href: '/dashboard/resume', icon: <FileIcon /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <GearIcon /> },
];

function Loading() {
  return (
    <div className={s.loading} aria-busy="true">
      <Skeleton height="2.25rem" width="12rem" />
      <Skeleton height="7rem" />
      <Skeleton height="16rem" />
    </div>
  );
}

function Account() {
  const user = useSession();
  const signOut = useAtomSet(signOutAtom, { mode: 'promiseExit' });
  return (
    <AccountMenu
      name={user.username}
      email={user.email ?? undefined}
      avatarUrl={user.github?.avatarUrl ?? null}
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
  top,
}: {
  children: ReactNode;
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
  if (!AsyncResult.isSuccess(session)) return <Loading />;
  return (
    <SessionProvider value={session.value}>{top(children)}</SessionProvider>
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
        <a className={s.footerLink} href="/">
          jsonresume.org
        </a>
      }
    >
      {page}
    </AppShell>
  );
  if (!isClient) return shell(null, <Loading />);
  return (
    <RegistryProvider>
      <Gate top={(page) => shell(<Account />, page)}>{children}</Gate>
    </RegistryProvider>
  );
}
