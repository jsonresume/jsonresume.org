import type { ReactNode } from 'react';
import * as s from './app.css';

export interface AppNavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  current?: boolean;
}

export interface AppNavLinkProps {
  className: string;
  children: ReactNode;
  'aria-current'?: 'page';
}

export interface AppNavProps {
  items: ReadonlyArray<AppNavItem>;
  /** Names the navigation landmark. Defaults to "App". */
  label?: string;
  /** Render each link with your router's link; defaults to a plain <a>. */
  renderLink?: (item: AppNavItem, props: AppNavLinkProps) => ReactNode;
}

/** The app's sections, for the sidebar (and the mobile menu). */
export function AppNav({ items, label = 'App', renderLink }: AppNavProps) {
  return (
    <nav aria-label={label}>
      <ul className={s.navList}>
        {items.map((item) => {
          const props: AppNavLinkProps = {
            className: s.navLink,
            ...(item.current ? { 'aria-current': 'page' as const } : {}),
            children: (
              <>
                {item.icon ? (
                  <span className={s.navIcon} aria-hidden="true">
                    {item.icon}
                  </span>
                ) : null}
                {item.label}
              </>
            ),
          };
          return (
            <li key={item.href}>
              {renderLink ? (
                renderLink(item, props)
              ) : (
                <a href={item.href} {...props} />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
