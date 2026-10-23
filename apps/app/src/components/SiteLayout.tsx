import {
  Button,
  Logo,
  SiteFooter,
  SiteHeader,
  SiteHeaderLink,
  SkipLink,
} from '@jsonresume/ui';
import type { ReactNode } from 'react';
import { links } from '../site';

const nav = [
  { label: 'Getting started', href: links.gettingStarted },
  { label: 'Schema', href: links.schema },
  { label: 'Themes', href: links.themes },
  { label: 'Docs', href: links.docs },
  { label: 'Blog', href: links.blog },
];

const footerLinks = [
  { label: 'Getting started', href: links.gettingStarted },
  { label: 'Schema', href: links.schema },
  { label: 'Themes', href: links.themes },
  { label: 'CLI', href: links.cli },
  { label: 'Docs', href: links.docs },
  { label: 'Team', href: links.team },
  { label: 'GitHub', href: links.github },
];

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <SiteHeader
        brand={<Logo href="/" mark />}
        actions={
          <Button asChild size="sm">
            <a href={links.github}>GitHub</a>
          </Button>
        }
      >
        {nav.map((item) => (
          <SiteHeaderLink key={item.label} href={item.href}>
            {item.label}
          </SiteHeaderLink>
        ))}
      </SiteHeader>
      <main id="main">{children}</main>
      <SiteFooter
        links={footerLinks.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
        note="JSON Resume is open source under the MIT license, built by volunteers since 2014."
      />
    </>
  );
}
