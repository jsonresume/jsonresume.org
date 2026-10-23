'use client';

import {
  AccountMenu,
  DropdownMenuItem,
  Logo,
  SiteHeader,
  SiteHeaderLink,
} from '@jsonresume/ui';
import { LayoutDashboard, Settings } from 'lucide-react';

export default function AccountMenuHeader() {
  return (
    <SiteHeader
      brand={<Logo />}
      navLabel="Account example"
      actions={
        <AccountMenu
          name="Thomas Davis"
          email="thomas@example.com"
          avatarUrl="https://avatars.githubusercontent.com/u/416209?v=4"
          onSignOut={() => {}}
        >
          <DropdownMenuItem icon={<LayoutDashboard />}>
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem icon={<Settings />}>Settings</DropdownMenuItem>
        </AccountMenu>
      }
    >
      <SiteHeaderLink href="#jobs">Jobs</SiteHeaderLink>
    </SiteHeader>
  );
}
