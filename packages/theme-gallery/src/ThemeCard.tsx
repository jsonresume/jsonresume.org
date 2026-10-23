import { Card } from '@jsonresume/ui';
import type { ThemeSummary } from '@repo/domain';
import * as s from './gallery.css';

export interface ThemeCardProps {
  theme: ThemeSummary;
  /** Screenshot of the theme, 800x640. */
  image: string;
  /** Where the card links, usually a live preview. */
  href: string;
  /** Load the screenshot eagerly (above the fold). */
  eager?: boolean;
}

/** A theme as a card: screenshot, name and a clamped description. */
export function ThemeCard({
  theme,
  image,
  href,
  eager = false,
}: ThemeCardProps) {
  return (
    <Card asChild interactive tone="raised">
      <a className={s.cardLink} href={href}>
        <img
          className={s.shot}
          src={image}
          alt=""
          width={800}
          height={640}
          loading={eager ? 'eager' : 'lazy'}
        />
        <span className={s.body}>
          <span className={s.name}>{theme.name}</span>
          <span className={s.description}>{theme.description}</span>
        </span>
      </a>
    </Card>
  );
}
