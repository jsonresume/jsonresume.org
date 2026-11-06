import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Container } from '../layout/layout';
import * as s from './site-footer.css';

export interface SiteFooterGroup {
  title: string;
  links: ReactNode[];
}

export interface SiteFooterProps extends HTMLAttributes<HTMLElement> {
  /** Footer links, as one centred list. Use `groups` for columns. */
  links?: ReactNode[];
  /** Columns of links, each under a title. */
  groups?: SiteFooterGroup[];
  /** Beside the columns, usually <Logo />. */
  brand?: ReactNode;
  /** Small links at the very bottom: privacy, terms. */
  legal?: ReactNode[];
  note?: ReactNode;
}

/** The site's foot: a brand and columns of links, or one list of them. */
export function SiteFooter({
  links = [],
  groups = [],
  brand,
  legal = [],
  note,
  className,
  children,
  ...props
}: SiteFooterProps) {
  const list = (items: ReactNode[], className: string) => (
    <ul className={className}>
      {items.map((l, i) => (
        <li key={i}>{l}</li>
      ))}
    </ul>
  );
  if (!groups.length)
    return (
      <footer className={cx(s.footer, s.simple, className)} {...props}>
        <Container>
          {links.length ? list(links, s.footerLinks) : null}
          {children}
          {note ? <p className={s.footerNote}>{note}</p> : null}
        </Container>
      </footer>
    );
  return (
    <footer className={cx(s.footer, className)} {...props}>
      <Container className={s.columns}>
        <div className={s.about}>
          {brand}
          {note ? <p className={s.aboutNote}>{note}</p> : null}
        </div>
        {groups.map((g) => (
          <div key={g.title} className={s.group}>
            <h2 className={s.groupTitle}>{g.title}</h2>
            {list(g.links, s.groupLinks)}
          </div>
        ))}
        {children}
        {legal.length ? list(legal, s.legal) : null}
      </Container>
    </footer>
  );
}
