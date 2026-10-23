'use client';

import { Slot } from '@radix-ui/react-slot';
import {
  forwardRef,
  useId,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { cx } from '../../utils/cx';
import { Container } from '../layout/layout';
import * as s from './site.css';

export interface SiteHeaderProps extends HTMLAttributes<HTMLElement> {
  /** The brand slot, usually <Logo />. */
  brand: ReactNode;
  /** Buttons shown after the navigation (e.g. sign in). */
  actions?: ReactNode;
  /** Accessible name of the navigation landmark. */
  navLabel?: string;
  /** Accessible name of the small-screen menu button. */
  menuLabel?: string;
}

/**
 * The yellow navigation band. Pass <SiteHeaderLink>s as children; on small
 * screens they collapse behind a menu button.
 */
export function SiteHeader({
  brand,
  actions,
  navLabel = 'Main',
  menuLabel = 'Menu',
  className,
  children,
  ...props
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <header className={cx(s.header, className)} {...props}>
      <Container className={s.headerInner}>
        <div className={s.headerBrand}>{brand}</div>
        <button
          type="button"
          className={s.navToggle}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            aria-hidden="true"
            focusable="false"
          >
            {open ? (
              <path
                d="M5 5l10 10M15 5 5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3 6h14M3 10h14M3 14h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
          <span className={visuallyHidden}>{menuLabel}</span>
        </button>
        <div id={id} className={s.navRegion} data-open={open}>
          <nav className={s.nav} aria-label={navLabel}>
            <ul className={s.navList}>{children}</ul>
          </nav>
          {actions ? <div className={s.headerActions}>{actions}</div> : null}
        </div>
      </Container>
    </header>
  );
}

export interface SiteHeaderLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Marks the link for the current page. */
  active?: boolean;
  /** Style a router link passed as the only child. */
  asChild?: boolean;
}

export const SiteHeaderLink = forwardRef<
  HTMLAnchorElement,
  SiteHeaderLinkProps
>(function SiteHeaderLink(
  { active, asChild = false, className, ...props },
  ref
) {
  const Comp = asChild ? Slot : 'a';
  return (
    <li>
      <Comp
        ref={ref}
        className={cx(s.navLink, className)}
        aria-current={active ? 'page' : undefined}
        {...props}
      />
    </li>
  );
});
