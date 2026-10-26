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
  /** Where a theme card links, e.g. a live preview. */
  href: (theme: ThemeSummary) => string;
}

export interface ThemeGridProps extends ThemeLinks {
  themes: ReadonlyArray<ThemeSummary>;
  /** How many cards load their screenshot eagerly. */
  eagerCount?: number;
  /** Accessible name of the list. */
  label?: string;
}

export function ThemeGrid({
  themes: list,
  image,
  href,
  eagerCount = 0,
  label = 'Themes',
}: ThemeGridProps) {
  return (
    <ul className={s.grid} role="list" aria-label={label}>
      {list.map((theme, index) => (
        <li key={theme.slug}>
          <ThemeCard
            theme={theme}
            image={image(theme)}
            href={href(theme)}
            eager={index < eagerCount}
          />
        </li>
      ))}
    </ul>
  );
}
