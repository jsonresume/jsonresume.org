'use client';

import { NavList, NavListGroup, NavListItem } from '@jsonresume/ui';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { navGroups } from '@/lib/nav';

export function DocsSidebar() {
  const pathname = usePathname();
  return (
    <NavList label="Documentation">
      {navGroups.map((group) => (
        <NavListGroup key={group.label} label={group.label}>
          {group.links.map((link) => (
            <NavListItem
              key={link.href}
              asChild
              active={pathname === link.href}
            >
              <NextLink href={link.href}>{link.label}</NextLink>
            </NavListItem>
          ))}
        </NavListGroup>
      ))}
    </NavList>
  );
}
