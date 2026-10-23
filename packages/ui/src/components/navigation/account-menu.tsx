'use client';

import type { ReactNode } from 'react';
import { Avatar } from '../display/display';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../overlay/menu';
import * as s from './navigation.css';

export interface AccountMenuProps {
  name: string;
  email?: string;
  avatarUrl?: string | null;
  /** Menu items (DropdownMenuItem) between the header and sign out. */
  children?: ReactNode;
  onSignOut?: () => void;
  signOutLabel?: string;
  /** Show the name beside the avatar in the trigger. */
  showName?: boolean;
}

/** The signed-in user's menu in the site header. */
export function AccountMenu({
  name,
  email,
  avatarUrl,
  children,
  onSignOut,
  signOutLabel = 'Sign out',
  showName = false,
}: AccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={s.accountTrigger}
        aria-label={showName ? undefined : `Account: ${name}`}
      >
        <Avatar name={name} src={avatarUrl} size="sm" shape="circle" alt="" />
        {showName ? <span>{name}</span> : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className={s.accountHeader}>
          <span className={s.accountName}>{name}</span>
          {email ? <span className={s.accountEmail}>{email}</span> : null}
        </div>
        {children ? (
          <>
            <DropdownMenuSeparator />
            {children}
          </>
        ) : null}
        {onSignOut ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onSignOut}>
              {signOutLabel}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
