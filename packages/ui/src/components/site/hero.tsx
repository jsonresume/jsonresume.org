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
  /** 'compact' for inner pages: less height, smaller title. */
  size?: 'default' | 'compact';
  /** 'start' left-aligns the copy at every width; by default it is centred (with media: until lg).*/
  align?: 'center' | 'start';
}

/** The yellow promo band: centered or split with media; compact for inner pages. */
export function Hero({
  title,
  lede,
  actions,
  eyebrow,
  media,
  size = 'default',
  align = 'center',
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
      <section
        className={cx(
          s.hero,
          s.onBrand,
          size === 'compact' && s.compact,
          align === 'start' && s.start,
          className
        )}
        {...props}
      >
        <Container>{copy}</Container>
      </section>
    );
  }

  return (
    <section
      className={cx(
        s.hero,
        s.split,
        size === 'compact' && s.compact,
        align === 'start' && s.start,
        className
      )}
      {...props}
    >
      <Container className={s.splitGrid}>
        <div className={s.onBrand}>{copy}</div>
        <div className={s.heroMedia}>{media}</div>
      </Container>
    </section>
  );
}
