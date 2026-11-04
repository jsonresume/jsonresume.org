'use client';

import { Slot } from '@radix-ui/react-slot';
import {
  forwardRef,
  useId,
  useRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { cx } from '../../utils/cx';
import { Container } from '../layout/layout';
import * as l from './site-header-links.css';
import * as s from './site-header.css';
import * as t from './site-header-toggle.css';
import { useMenu } from './use-menu';

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
 * screens they fold behind a menu button into a full-screen menu that
 * closes on Escape, on a link, or when the screen grows wide enough.
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
  const id = useId();
  const bar = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useMenu(bar, toggle);
  return (
    <header
      className={cx(s.header, className)}
      data-state={menu.state}
      {...props}
    >
      <div
        ref={bar}
        className={s.headerBar}
        onClick={menu.onClick}
        onKeyDown={menu.onKeyDown}
        onAnimationEnd={menu.onAnimationEnd}
      >
        <Container className={s.headerInner}>
          <div className={s.headerBrand}>{brand}</div>
          <button
            ref={toggle}
            type="button"
            className={t.navToggle}
            aria-expanded={menu.open}
            aria-controls={id}
            onClick={menu.toggle}
          >
            <span className={t.toggleLines} aria-hidden="true">
              <span className={t.toggleLine} />
              <span className={t.toggleLine} />
              <span className={t.toggleLine} />
            </span>
            <span className={visuallyHidden}>{menuLabel}</span>
          </button>
          <div id={id} className={s.navRegion}>
            <nav className={s.nav} aria-label={navLabel}>
              <ul className={s.navList}>{children}</ul>
            </nav>
            {actions ? <div className={l.headerActions}>{actions}</div> : null}
          </div>
        </Container>
      </div>
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
        className={cx(l.navLink, className)}
        aria-current={active ? 'page' : undefined}
        {...props}
      />
    </li>
  );
});
