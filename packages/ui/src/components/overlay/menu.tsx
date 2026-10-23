'use client';

import * as Menu from '@radix-ui/react-dropdown-menu';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import * as s from './overlay.css';

export const DropdownMenu = Menu.Root;
export const DropdownMenuTrigger = Menu.Trigger;
export const DropdownMenuGroup = Menu.Group;

export const DropdownMenuContent = forwardRef<
  ElementRef<typeof Menu.Content>,
  ComponentPropsWithoutRef<typeof Menu.Content>
>(function DropdownMenuContent(
  { className, sideOffset = 6, align = 'start', ...props },
  ref
) {
  return (
    <Menu.Portal>
      <Menu.Content
        ref={ref}
        sideOffset={sideOffset}
        align={align}
        className={cx(s.surface, className)}
        {...props}
      />
    </Menu.Portal>
  );
});

export interface DropdownMenuItemProps
  extends ComponentPropsWithoutRef<typeof Menu.Item> {
  /** Destructive actions (delete, sign out of all devices) read in red. */
  tone?: 'default' | 'danger';
  icon?: ReactNode;
  shortcut?: string;
}

export const DropdownMenuItem = forwardRef<
  ElementRef<typeof Menu.Item>,
  DropdownMenuItemProps
>(function DropdownMenuItem(
  { tone, icon, shortcut, className, children, ...props },
  ref
) {
  return (
    <Menu.Item
      ref={ref}
      className={cx(s.menuItem({ tone }), className)}
      {...props}
    >
      {icon ? (
        <span className={s.menuItemIcon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
      {shortcut ? <span className={s.menuShortcut}>{shortcut}</span> : null}
    </Menu.Item>
  );
});

export const DropdownMenuCheckboxItem = forwardRef<
  ElementRef<typeof Menu.CheckboxItem>,
  ComponentPropsWithoutRef<typeof Menu.CheckboxItem>
>(function DropdownMenuCheckboxItem({ className, children, ...props }, ref) {
  return (
    <Menu.CheckboxItem
      ref={ref}
      className={cx(s.menuItem({ inset: true }), className)}
      {...props}
    >
      <Menu.ItemIndicator className={s.menuIndicator}>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path
            d="M2.5 6.25 5 8.75l4.5-5.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </Menu.ItemIndicator>
      {children}
    </Menu.CheckboxItem>
  );
});

export const DropdownMenuLabel = forwardRef<
  ElementRef<typeof Menu.Label>,
  ComponentPropsWithoutRef<typeof Menu.Label>
>(function DropdownMenuLabel({ className, ...props }, ref) {
  return (
    <Menu.Label ref={ref} className={cx(s.menuLabel, className)} {...props} />
  );
});

export const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof Menu.Separator>,
  ComponentPropsWithoutRef<typeof Menu.Separator>
>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return (
    <Menu.Separator
      ref={ref}
      className={cx(s.menuSeparator, className)}
      {...props}
    />
  );
});
