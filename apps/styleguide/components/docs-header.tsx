'use client';

import { Button, Logo, SiteHeader, SiteHeaderLink } from '@jsonresume/ui';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { headerLinks } from '@/lib/nav';
import { ThemeToggle } from './theme-toggle';

const section = (path: string) => path.split('/')[1] ?? '';

export function DocsHeader() {
  const pathname = usePathname();
  return (
    <SiteHeader
      navLabel="Styleguide"
      brand={
        <Logo asChild mark>
          <NextLink href="/">JSON Resume Styleguide</NextLink>
        </Logo>
      }
      actions={
        <>
          <ThemeToggle />
          <Button asChild size="sm">
            <a href="https://github.com/jsonresume/jsonresume.org/tree/master/packages/ui">
              GitHub
            </a>
          </Button>
        </>
      }
    >
      {headerLinks.map((link) => (
        <SiteHeaderLink
          key={link.href}
          asChild
          active={section(pathname) === section(link.href)}
        >
          <NextLink href={link.href}>{link.label}</NextLink>
        </SiteHeaderLink>
      ))}
    </SiteHeader>
  );
}
