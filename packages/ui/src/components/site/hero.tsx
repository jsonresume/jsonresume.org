import { type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Container } from '../layout/layout';
import * as s from './hero.css';

export interface HeroProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  /** A short overline above the title. */
  eyebrow?: ReactNode;
  /**
   * Something to show beside the copy (a code sample, a screenshot). The
   * band then splits into two columns from the lg breakpoint, left-aligned,
   * and stacks below it.
   */
  media?: ReactNode;
}

/** The yellow promo band used on the home page; centered, or split with media. */
export function Hero({
  title,
  lede,
  actions,
  eyebrow,
  media,
  className,
  children,
  ...props
}: HeroProps) {
  const copy = (
    <>
      {eyebrow ? <p className={s.eyebrow}>{eyebrow}</p> : null}
      <h1 className={s.heroTitle}>{title}</h1>
      {lede ? <p className={s.heroLede}>{lede}</p> : null}
      {children}
      {actions ? <div className={s.heroActions}>{actions}</div> : null}
    </>
  );

  if (!media) {
    return (
      <section className={cx(s.hero, s.onBrand, className)} {...props}>
        <Container>{copy}</Container>
      </section>
    );
  }

  return (
    <section className={cx(s.hero, s.split, className)} {...props}>
      <Container className={s.splitGrid}>
        <div className={s.onBrand}>{copy}</div>
        <div className={s.heroMedia}>{media}</div>
      </Container>
    </section>
  );
}
