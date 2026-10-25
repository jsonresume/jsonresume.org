import {
  DashboardShell,
  JobsPage,
  OverviewPage,
  PathwaysPage,
  ResumePage,
  SettingsPage,
} from '@repo/dashboard';
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

export const OverviewRoute = createLazyRoute('/dashboard/')({
  component: OverviewPage,
});
export const ResumeRoute = createLazyRoute('/dashboard/resume')({
  component: ResumePage,
});
export const SettingsRoute = createLazyRoute('/dashboard/settings')({
  component: SettingsPage,
});
export const JobsRoute = createLazyRoute('/dashboard/jobs')({
  component: JobsPage,
});
export const PathwaysRoute = createLazyRoute('/dashboard/pathways')({
  component: PathwaysPage,
});
