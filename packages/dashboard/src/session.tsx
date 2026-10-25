import type { SessionUser } from '@repo/api';
import { createContext, useContext } from 'react';

const SessionContext = createContext<SessionUser | null>(null);

export const SessionProvider = SessionContext.Provider;

/** The signed-in user. Only inside DashboardShell, which waits for it. */
export function useSession(): SessionUser {
  const user = useContext(SessionContext);
  if (!user) throw new Error('useSession outside DashboardShell');
  return user;
}

/** The page's ?name= value, read in the browser (dashboard pages are client-rendered). */
export const searchParam = (name: string) =>
  typeof location === 'undefined'
    ? null
    : new URLSearchParams(location.search).get(name);
