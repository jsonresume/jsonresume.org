import { Slot } from '@radix-ui/react-slot';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx';
import * as s from './navigation.css';

/* TabNav */

export interface TabNavProps extends HTMLAttributes<HTMLElement> {
  /** Names the navigation, e.g. "Profile". */
  label: string;
}

/**
 * Navigation between sibling pages of one area, styled as tabs. Each item
 * is a real link; use Tabs instead for panels within a single page.
 */
export function TabNav({ label, className, children, ...props }: TabNavProps) {
  return (
    <nav aria-label={label} className={className} {...props}>
      <ul className={s.tabNav}>{children}</ul>
    </nav>
  );
}

export interface TabNavLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  asChild?: boolean;
}

export const TabNavLink = forwardRef<HTMLAnchorElement, TabNavLinkProps>(
  function TabNavLink(
    { active = false, asChild = false, className, ...props },
    ref
  ) {
    const Comp = asChild ? Slot : 'a';
    return (
      <li>
        <Comp
          ref={ref}
          className={cx(s.tabLink, className)}
          aria-current={active ? 'page' : undefined}
          {...props}
        />
      </li>
    );
  }
);

/* BackLink */

export interface BackLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
}

/** Return to the parent list or page. Name it after the destination: "Back to jobs". */
export const BackLink = forwardRef<HTMLAnchorElement, BackLinkProps>(
  function BackLink({ asChild = false, className, children, ...props }, ref) {
    const Comp = asChild ? Slot : 'a';
    return (
      <Comp ref={ref} className={cx(s.backLink, className)} {...props}>
        {asChild ? (
          children
        ) : (
          <>
            <span aria-hidden="true">←</span>
            {children}
          </>
        )}
      </Comp>
    );
  }
);
