import { Slot, Slottable } from '@radix-ui/react-slot';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { Container } from '../layout/layout';
import { heading } from '../typography/typography.css';
import * as s from './site.css';

/* Logo */

export interface LogoProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: 'sm' | 'md' | 'lg';
  /** Show the document mark beside the wordmark. */
  mark?: boolean;
  asChild?: boolean;
}

/** The "JSON Resume" wordmark, set in Ubuntu Bold. Links home by default. */
export const Logo = forwardRef<HTMLAnchorElement, LogoProps>(function Logo(
  {
    size,
    mark = false,
    asChild = false,
    className,
    children,
    href = '/',
    ...props
  },
  ref
) {
  const Comp = asChild ? Slot : 'a';
  return (
    <Comp
      ref={ref}
      href={asChild ? undefined : href}
      className={cx(s.logo({ size }), className)}
      {...props}
    >
      {mark ? <LogoMark /> : null}
      {asChild ? <Slottable>{children}</Slottable> : children ?? 'JSON Resume'}
    </Comp>
  );
});

/** A document with braces: the JSON Resume mark. Decorative. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={cx(s.logoMark, className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6 2.75h8.5L19.25 7.5v13.75H6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M14.25 2.75V7.75h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10.25 11c-1 0-1.25.5-1.25 1.25v.6c0 .55-.3.9-.9.9.6 0 .9.35.9.9v.6c0 .75.25 1.25 1.25 1.25M14.75 11c1 0 1.25.5 1.25 1.25v.6c0 .55.3.9.9.9-.6 0-.9.35-.9.9v.6c0 .75-.25 1.25-1.25 1.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* PageHeader */

export interface PageHeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  /** Small uppercase label above the title. */
  eyebrow?: ReactNode;
  actions?: ReactNode;
  tone?: 'subtle' | 'brand' | 'page';
}

/** The title band at the top of inner pages: light 40px title on gray. */
export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  tone,
  className,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <header className={cx(s.pageHeader({ tone }), className)} {...props}>
      <Container className={s.pageHeaderInner}>
        <div className={s.pageHeaderText}>
          {eyebrow ? <p className={s.eyebrow}>{eyebrow}</p> : null}
          <h1 className={heading({ size: 'title' })}>{title}</h1>
          {description ? (
            <p className={s.pageHeaderDescription}>{description}</p>
          ) : null}
          {children}
        </div>
        {actions ? <div className={s.pageHeaderActions}>{actions}</div> : null}
      </Container>
    </header>
  );
}

/* Feature */

export interface FeatureProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  /** Heading level for the title. Defaults to 2. */
  level?: 2 | 3 | 4;
  action?: ReactNode;
}

/** A centered teaser column: light title, short text, one action. */
export function Feature({
  title,
  level = 2,
  action,
  className,
  children,
  ...props
}: FeatureProps) {
  const Tag = `h${level}` as const;
  return (
    <div className={cx(s.feature, className)} {...props}>
      <Tag className={heading({ size: 'section' })}>{title}</Tag>
      {children ? <div className={s.featureText}>{children}</div> : null}
      {action}
    </div>
  );
}

/* SiteFooter */

export interface SiteFooterProps extends HTMLAttributes<HTMLElement> {
  /** Footer links; rendered as a centered list. */
  links?: ReactNode[];
  note?: ReactNode;
}

export function SiteFooter({
  links = [],
  note,
  className,
  children,
  ...props
}: SiteFooterProps) {
  return (
    <footer className={cx(s.footer, className)} {...props}>
      <Container>
        {links.length ? (
          <ul className={s.footerLinks}>
            {links.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        ) : null}
        {children}
        {note ? <p className={s.footerNote}>{note}</p> : null}
      </Container>
    </footer>
  );
}

/* SkipLink */

export function SkipLink({
  href = '#main',
  children = 'Skip to content',
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} className={cx(s.skipLink, className)} {...props}>
      {children}
    </a>
  );
}
