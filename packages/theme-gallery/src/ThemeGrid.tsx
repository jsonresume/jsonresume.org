import type { ThemeSummary } from '@repo/domain';
import * as s from './gallery.css';
import { ThemeCard } from './ThemeCard';

/**
 * Kept apart from ThemeGallery: the homepage shows a few themes with this,
 * and shouldn't load the gallery's atoms (Effect) to do it.
 */
export interface ThemeLinks {
  /** Screenshot URL for a theme. */
  image: (theme: ThemeSummary) => string;
  /** The live preview of a theme (the preview frame, and Full page). */
  href: (theme: ThemeSummary) => string;
  /** Where a card links when it isn't opened in place: the theme's page. */
  page?: (theme: ThemeSummary) => string;
}

export interface ThemeGridProps extends ThemeLinks {
  themes: ReadonlyArray<ThemeSummary>;
  /** How many cards load their screenshot eagerly. */
  eagerCount?: number;
  /** Accessible name of the list. */
  label?: string;
  /** Open a theme in place; cards link to href without it. */
  onOpen?: (theme: ThemeSummary) => void;
}

export function ThemeGrid({
  themes: list,
  image,
  href,
  page,
  eagerCount = 0,
  label = 'Themes',
  onOpen,
}: ThemeGridProps) {
  return (
    <ul className={s.grid} role="list" aria-label={label}>
      {list.map((theme, index) => (
        <li key={theme.slug}>
          <ThemeCard
            theme={theme}
            image={image(theme)}
            href={(page ?? href)(theme)}
            eager={index < eagerCount}
            onOpen={onOpen && (() => onOpen(theme))}
          />
        </li>
      ))}
    </ul>
  );
}
