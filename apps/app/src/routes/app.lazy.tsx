import { DashboardShell } from '@repo/dashboard';
import {
  createLazyRoute,
  Link,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';

export const DashboardRoute = createLazyRoute('/dashboard')({
  component: function DashboardLayout() {
    const pathname = useRouterState({ select: (s) => s.location.pathname });
    return (
      <DashboardShell
        pathname={pathname.replace(/\/$/, '') || '/'}
        renderLink={(item, props) => (
          <Link
            to={item.href}
            // /dashboard is a prefix of every dashboard page: match it exactly.
            activeOptions={{ exact: item.href === '/dashboard' }}
            className={props.className}
            aria-current={props['aria-current']}
          >
            {props.children}
          </Link>
        )}
      >
        <Outlet />
      </DashboardShell>
    );
  },
});
