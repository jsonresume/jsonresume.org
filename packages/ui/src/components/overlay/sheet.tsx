'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { cx } from '../../utils/cx';
import * as s from './overlay.css';

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export interface SheetContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Edge the sheet slides in from. */
  side?: 'right' | 'left' | 'bottom';
  closeLabel?: string;
}

/**
 * A modal panel that slides over the page: details, filters or forms that
 * shouldn't take the reader away from the list behind them.
 */
export const SheetContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(function SheetContent(
  { side, closeLabel = 'Close', className, children, ...props },
  ref
) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={s.sheetOverlay} />
      <DialogPrimitive.Content
        ref={ref}
        className={cx(s.sheet({ side }), className)}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className={s.closeButton}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="m4 4 8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <span className={visuallyHidden}>{closeLabel}</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export function SheetHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(s.sheetHeader, className)} {...props} />;
}

export function SheetBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(s.sheetBody, className)} {...props} />;
}

export function SheetFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(s.sheetFooter, className)} {...props} />;
}

export const SheetTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function SheetTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cx(s.sheetTitle, className)}
      {...props}
    />
  );
});

export const SheetDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function SheetDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cx(s.sheetDescription, className)}
      {...props}
    />
  );
});
