import { Slot } from '@radix-ui/react-slot';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import * as s from './interactive.css';

/* Breadcrumbs */

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  label?: string;
}

/** Pass <BreadcrumbItem>s; the last one should be `current`. */
export function Breadcrumbs({
  label = 'Breadcrumb',
  className,
  children,
  ...props
}: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={className} {...props}>
      <ol className={s.breadcrumbs}>{children}</ol>
    </nav>
  );
}

export interface BreadcrumbItemProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  current?: boolean;
  asChild?: boolean;
}

export function BreadcrumbItem({
  current = false,
  asChild = false,
  children,
  ...props
}: BreadcrumbItemProps) {
  const Comp = asChild ? Slot : 'a';
  return (
    <li className={s.breadcrumbItem}>
      {current ? (
        <span aria-current="page">{children}</span>
      ) : (
        <>
          <Comp {...props}>{children}</Comp>
          <span className={s.breadcrumbSeparator} aria-hidden="true">
            /
          </span>
        </>
      )}
    </li>
  );
}

/* NavList */

export interface NavListProps extends HTMLAttributes<HTMLElement> {
  label: string;
}

/** Vertical navigation for docs and settings pages. */
export function NavList({
  label,
  className,
  children,
  ...props
}: NavListProps) {
  return (
    <nav aria-label={label} className={className} {...props}>
      <ul className={s.navList}>{children}</ul>
    </nav>
  );
}

export function NavListGroup({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <li>
      <p className={s.navGroupLabel}>{label}</p>
      <ul className={s.navSubList}>{children}</ul>
    </li>
  );
}

export interface NavListItemProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  asChild?: boolean;
}

export const NavListItem = forwardRef<HTMLAnchorElement, NavListItemProps>(
  function NavListItem(
    { active = false, asChild = false, className, ...props },
    ref
  ) {
    const Comp = asChild ? Slot : 'a';
    return (
      <li className={s.navItem}>
        <Comp
          ref={ref}
          className={cx(s.navItemLink, className)}
          aria-current={active ? 'page' : undefined}
          {...props}
        />
      </li>
    );
  }
);
