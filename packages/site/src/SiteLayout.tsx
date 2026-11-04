import {
  Logo,
  SiteFooter,
  SiteHeader,
  SiteHeaderLink,
  SkipLink,
} from '@jsonresume/ui';
import { useRouterState } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { HeaderAuth } from './HeaderAuth';
import {
  footerGroups,
  headerNav,
  legalNav,
  paths,
  type NavItem,
} from './links';
import { isSitePath, SiteLink } from './SiteLink';
import * as s from './siteLayout.css';

const isActive = (href: string, pathname: string) =>
  isSitePath(href) && (pathname === href || pathname.startsWith(`${href}/`));

const footerLink = (item: NavItem) => (
  <SiteLink key={item.label} href={item.href}>
    {item.label}
  </SiteLink>
);

/** jsonresume.org chrome: skip link, header navigation, footer. */
export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className={s.page}>
      <SkipLink />
      <SiteHeader
        brand={
          <Logo asChild mark>
            <SiteLink href={paths.home}>JSON Resume</SiteLink>
          </Logo>
        }
        actions={<HeaderAuth />}
      >
        {headerNav.map((item) => (
          <SiteHeaderLink
            key={item.label}
            asChild
            active={isActive(item.href, pathname)}
          >
            <SiteLink href={item.href}>{item.label}</SiteLink>
          </SiteHeaderLink>
        ))}
      </SiteHeader>
      <main id="main" className={s.main}>
        {children}
      </main>
      <SiteFooter
        brand={
          <Logo asChild mark>
            <SiteLink href={paths.home}>JSON Resume</SiteLink>
          </Logo>
        }
        groups={footerGroups.map((g) => ({
          title: g.title,
          links: g.items.map(footerLink),
        }))}
        legal={legalNav.map(footerLink)}
        note="The open standard for resumes. Open source under the MIT license, built by volunteers since 2014."
      />
    </div>
  );
}
