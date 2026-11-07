import { useAtom } from '@effect/atom-react';
import type { ThemeSummary } from '@repo/domain';
import { themeOpenAtom } from './atoms';
import { themes as all } from './catalog';
import { ThemePreview, type ThemePreviewProps } from './ThemePreview';

type Props = Omit<ThemePreviewProps, 'slug' | 'onSlug'>;

/**
 * The gallery's preview, on its own so that flipping themes re-renders only
 * this, not every card. A theme the filters hide (a shared ?theme= link,
 * say) still opens, and then flips through every theme.
 */
export function GalleryPreview({ themes, ...props }: Props) {
  const [open, setOpen] = useAtom(themeOpenAtom);
  const list: ReadonlyArray<ThemeSummary> = themes.some((t) => t.slug === open)
    ? themes
    : all;
  return <ThemePreview themes={list} slug={open} onSlug={setOpen} {...props} />;
}
