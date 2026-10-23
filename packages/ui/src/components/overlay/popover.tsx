'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';
import { cx } from '../../utils/cx';
import * as s from './overlay.css';

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverClose = PopoverPrimitive.Close;
export const PopoverAnchor = PopoverPrimitive.Anchor;

export interface PopoverContentProps
  extends ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  /** Show a small arrow pointing at the trigger. */
  arrow?: boolean;
}

/** An anchored panel for rich content. Tooltips are for short text only. */
export const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(function PopoverContent(
  { className, sideOffset = 8, arrow = false, children, ...props },
  ref
) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cx(s.popover, className)}
        {...props}
      >
        {children}
        {arrow ? (
          <PopoverPrimitive.Arrow className={s.arrow} width={12} height={6} />
        ) : null}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});
