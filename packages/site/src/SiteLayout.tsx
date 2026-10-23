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
import { footerNav, headerNav, paths } from './links';
import { isSitePath, SiteLink } from './SiteLink';

const isActive = (href: string, pathname: string) =>
  isSitePath(href) && (pathname === href || pathname.startsWith(`${href}/`));

/** jsonresume.org chrome: skip link, header navigation, footer. */
export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
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
      <main id="main">{children}</main>
      <SiteFooter
        links={footerNav.map((item) => (
          <SiteLink key={item.label} href={item.href}>
            {item.label}
          </SiteLink>
        ))}
        note="JSON Resume is open source under the MIT license, built by volunteers since 2014."
      />
    </>
  );
}
