import { Slot } from '@radix-ui/react-slot';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import {
  container,
  divider,
  dividerLabelled,
  dividerLine,
  dividerText,
  grid,
  minColumn,
  section,
  stack,
  type ContainerVariants,
  type GridVariants,
  type SectionVariants,
  type StackVariants,
} from './layout.css';

interface AsChild {
  /** Render as the single child element instead of a <div>. */
  asChild?: boolean;
}

export interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>,
    ContainerVariants,
    AsChild {}

/** Centers content in the site column (970px by default) with responsive gutters. */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ asChild, size, className, ...props }, ref) {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        className={cx(container({ size }), className)}
        {...props}
      />
    );
  }
);

export interface SectionProps
  extends HTMLAttributes<HTMLElement>,
    SectionVariants,
    AsChild {}

/** A full-width band. Put a `Container` inside to align content. */
export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { asChild, tone, spacing, className, ...props },
  ref
) {
  const Comp = asChild ? Slot : 'section';
  return (
    <Comp
      ref={ref}
      className={cx(section({ tone, spacing }), className)}
      {...props}
    />
  );
});

export interface StackProps
  extends HTMLAttributes<HTMLDivElement>,
    StackVariants,
    AsChild {}

/** One-dimensional layout with consistent gaps. */
export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { asChild, direction, gap, align, justify, wrap, className, ...props },
  ref
) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cx(stack({ direction, gap, align, justify, wrap }), className)}
      {...props}
    />
  );
});

export interface GridProps
  extends HTMLAttributes<HTMLDivElement>,
    GridVariants,
    AsChild {
  /** Minimum column width; the grid fits as many columns as it can. Defaults to 16rem. */
  minColumnWidth?: string;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { asChild, gap, stretch, minColumnWidth, className, style, ...props },
  ref
) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cx(grid({ gap, stretch }), className)}
      style={
        minColumnWidth
          ? { ...assignInlineVars({ [minColumn]: minColumnWidth }), ...style }
          : style
      }
      {...props}
    />
  );
});

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Decorative dividers are hidden from assistive technology. Defaults to true. */
  decorative?: boolean;
  /** Text in the middle of a horizontal rule, e.g. "or" between sign-in options. */
  label?: ReactNode;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  function Divider(
    {
      orientation = 'horizontal',
      decorative = true,
      label,
      className,
      ...props
    },
    ref
  ) {
    if (label !== undefined && orientation === 'horizontal') {
      return (
        <div ref={ref} className={cx(dividerLabelled, className)} {...props}>
          <span className={dividerLine} aria-hidden="true" />
          <span className={dividerText}>{label}</span>
          <span className={dividerLine} aria-hidden="true" />
        </div>
      );
    }
    return (
      <div
        ref={ref}
        className={cx(divider({ orientation }), className)}
        {...(decorative
          ? { 'aria-hidden': true }
          : { role: 'separator', 'aria-orientation': orientation })}
        {...props}
      />
    );
  }
);
