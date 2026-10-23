'use client';

import * as ToolbarPrimitive from '@radix-ui/react-toolbar';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';
import { cx } from '../../utils/cx';
import * as s from './workspace.css';

export interface ToolbarProps
  extends ComponentPropsWithoutRef<typeof ToolbarPrimitive.Root> {
  /** Names the toolbar, e.g. "Editor". */
  label: string;
}

/** A row of grouped controls. Tab enters once; arrow keys move between controls. */
export const Toolbar = forwardRef<
  ElementRef<typeof ToolbarPrimitive.Root>,
  ToolbarProps
>(function Toolbar({ label, className, ...props }, ref) {
  return (
    <ToolbarPrimitive.Root
      ref={ref}
      aria-label={label}
      className={cx(s.toolbar, className)}
      {...props}
    />
  );
});

export const ToolbarButton = forwardRef<
  ElementRef<typeof ToolbarPrimitive.Button>,
  ComponentPropsWithoutRef<typeof ToolbarPrimitive.Button>
>(function ToolbarButton({ className, ...props }, ref) {
  return (
    <ToolbarPrimitive.Button
      ref={ref}
      className={cx(s.toolbarButton, className)}
      {...props}
    />
  );
});

export const ToolbarLink = forwardRef<
  ElementRef<typeof ToolbarPrimitive.Link>,
  ComponentPropsWithoutRef<typeof ToolbarPrimitive.Link>
>(function ToolbarLink({ className, ...props }, ref) {
  return (
    <ToolbarPrimitive.Link
      ref={ref}
      className={cx(s.toolbarButton, className)}
      {...props}
    />
  );
});

export const ToolbarToggleGroup = forwardRef<
  ElementRef<typeof ToolbarPrimitive.ToggleGroup>,
  ComponentPropsWithoutRef<typeof ToolbarPrimitive.ToggleGroup>
>(function ToolbarToggleGroup({ className, ...props }, ref) {
  return (
    <ToolbarPrimitive.ToggleGroup
      ref={ref}
      className={cx(s.toolbarGroup, className)}
      {...props}
    />
  );
});

export const ToolbarToggleItem = forwardRef<
  ElementRef<typeof ToolbarPrimitive.ToggleItem>,
  ComponentPropsWithoutRef<typeof ToolbarPrimitive.ToggleItem>
>(function ToolbarToggleItem({ className, ...props }, ref) {
  return (
    <ToolbarPrimitive.ToggleItem
      ref={ref}
      className={cx(s.toolbarButton, className)}
      {...props}
    />
  );
});

export function ToolbarSeparator() {
  return <ToolbarPrimitive.Separator className={s.toolbarSeparator} />;
}
