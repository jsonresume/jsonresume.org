import { Badge, Card } from '@jsonresume/ui';
import type { MouseEvent } from 'react';
import type { ThemeSummary } from '@repo/domain';
import { THEME_STYLES, THEME_LAYOUTS } from '@jsonresume/theme-metadata';
import * as s from './gallery.css';

export interface ThemeCardProps {
  theme: ThemeSummary;
  /** Screenshot of the theme, 800x640. */
  image: string;
  /** Where the card links, usually a live preview. */
  href: string;
  /** Load the screenshot eagerly (above the fold). */
  eager?: boolean;
  /**
   * Open the theme in place (a preview) instead of following href. A
   * modified or middle click still follows the link.
   */
  onOpen?: () => void;
}

const plainClick = (event: MouseEvent<HTMLAnchorElement>) =>
  event.button === 0 &&
  !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey);

/**
 * A theme as a card: screenshot, name, whether it is recommended and a
 * clamped description.
 */
export function ThemeCard({
  theme,
  image,
  href,
  eager = false,
  onOpen,
}: ThemeCardProps) {
  return (
    <Card asChild interactive tone="raised">
      <a
        className={s.cardLink}
        href={href}
        onClick={(event) => {
          if (!onOpen || !plainClick(event)) return;
          event.preventDefault();
          onOpen();
        }}
      >
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
          {theme.recommended ? (
            <Badge
              tone="success"
              className={s.recommended}
              title="ATS-safe, and tested printing on A4 and Letter"
            >
              Recommended
            </Badge>
          ) : null}
          <span className={s.category}>
            {THEME_STYLES[theme.style]} · {THEME_LAYOUTS[theme.layout]}
          </span>
          <span className={s.description}>{theme.description}</span>
          <span className={s.usage}>
            {theme.usage.resumes.toLocaleString('en')} public resumes
          </span>
        </span>
      </a>
    </Card>
  );
}
