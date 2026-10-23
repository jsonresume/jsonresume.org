import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import {
  button,
  hiddenLabel,
  spinner,
  spinnerSlot,
  type ButtonVariants,
} from './button.css';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  /**
   * Render the single child (e.g. a link) with button styles instead of a
   * <button>. `loading` is not available in this mode.
   */
  asChild?: boolean;
  /** Shows a spinner, keeps the button's width, and disables it. */
  loading?: boolean;
}

/**
 * The brand button: uppercase, letter-spaced labels on a 2px border.
 * `primary` (red) is for the one main action on a page; `secondary` is the
 * everyday button; `ink` is a solid dark alternative.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      asChild = false,
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      disabled,
      children,
      type,
      ...props
    },
    ref
  ) {
    const classes = cx(button({ variant, size, fullWidth }), className);

    if (asChild) {
      return (
        <Slot ref={ref} className={classes} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        type={type ?? 'button'}
        {...props}
      >
        {loading ? (
          <>
            <span className={spinnerSlot} aria-hidden="true">
              <span className={spinner} />
            </span>
            <span className={hiddenLabel}>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
