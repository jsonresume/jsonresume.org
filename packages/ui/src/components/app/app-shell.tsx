'use client';

import { useState, type MouseEvent, type ReactNode } from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { cx } from '../../utils/cx';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '../overlay/sheet';
import { SkipLink } from '../site/site';
import * as s from './app.css';

export interface AppShellProps {
  /** The product mark, at the top of the sidebar (and the mobile top bar). */
  brand: ReactNode;
  /** Usually an <AppNav>. */
  nav: ReactNode;
  /** The end of the top bar: account menu, actions. */
  top?: ReactNode;
  /** The bottom of the sidebar: help links, plan, version. */
  footer?: ReactNode;
  /** Extra class for the shell, e.g. a fixed height when embedded in docs. */
  className?: string;
  children: ReactNode;
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M2 4.5h14M2 9h14M2 13.5h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * The signed-in layout: fills the viewport, a sidebar from lg up, a top bar
 * with the account menu, and a menu button that opens the same navigation
 * in a sheet on small screens. Put one <AppPage> inside.
 */
export function AppShell({
  brand,
  nav,
  top,
  footer,
  className,
  children,
}: AppShellProps) {
  const [open, setOpen] = useState(false);
  // Following a link in the sheet closes it.
  const closeOnLink = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest('a'))
      setOpen(false);
  };
  return (
    <div className={cx(s.shell, className)}>
      <SkipLink href="#app-main" />
      <aside className={s.sidebar}>
        {brand}
        <div className={s.sidebarNav}>{nav}</div>
        {footer ? <div className={s.sidebarFooter}>{footer}</div> : null}
      </aside>
      <div className={s.body}>
        <header className={s.topbar}>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className={s.menuButton} aria-label="Open navigation">
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetTitle className={visuallyHidden}>Navigation</SheetTitle>
              <div className={s.sheetPanel} onClick={closeOnLink}>
                {brand}
                <div className={s.sidebarNav}>{nav}</div>
                {footer ? (
                  <div className={s.sidebarFooter}>{footer}</div>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
          <div className={s.topbarBrand}>{brand}</div>
          {top ? <div className={s.topbarEnd}>{top}</div> : null}
        </header>
        <main id="app-main" className={s.main} tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
