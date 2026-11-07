import {
  Button,
  Kbd,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@jsonresume/ui';
import { THEME_LAYOUTS, THEME_STYLES } from '@jsonresume/theme-metadata';
import type { ThemeSummary } from '@repo/domain';
import { useRef, type ReactNode } from 'react';
import { ThemeFrame } from './ThemeFrame';
import type { ThemeLinks } from './ThemeGrid';
import * as s from './preview.css';

export interface ThemePreviewProps extends ThemeLinks {
  /** The themes the arrows move through, in order. */
  themes: ReadonlyArray<ThemeSummary>;
  /** The open theme, or null when closed. */
  slug: string | null;
  onSlug: (slug: string | null) => void;
  /** More about a theme, under its description: how to use it, say. */
  details?: (theme: ThemeSummary) => ReactNode;
}

/** Keys the preview answers, wherever focus is inside it (or its frame). */
export const previewKey = (
  event: Pick<KeyboardEvent, 'key' | 'altKey' | 'ctrlKey' | 'metaKey'>
): -1 | 1 | 'close' | null => {
  if (event.altKey || event.ctrlKey || event.metaKey) return null;
  if (event.key === 'ArrowLeft') return -1;
  if (event.key === 'ArrowRight') return 1;
  return event.key === 'Escape' ? 'close' : null;
};

const typing = (target: EventTarget | null) =>
  target instanceof Element &&
  target.closest('input, textarea, select, [contenteditable="true"]') !== null;

/**
 * One theme at a time, live on a real resume, with Previous and Next (or the
 * arrow keys) to flip through the rest.
 */
export function ThemePreview({
  themes: list,
  slug,
  onSlug,
  image,
  href,
  details,
}: ThemePreviewProps) {
  const index = list.findIndex((theme) => theme.slug === slug);
  const open = index !== -1 ? list[index] : undefined;
  // Keep the last theme rendered while the sheet animates closed.
  const last = useRef(open);
  if (open) last.current = open;
  const theme = open ?? last.current;

  // Where the arrows step from: updated as they step, so presses quicker
  // than a render don't all start from the same theme.
  const at = useRef(slug);
  at.current = slug;
  const step = (by: number) => {
    const from = list.findIndex((t) => t.slug === at.current);
    const next = list[(from + by + list.length) % list.length];
    if (!next) return;
    at.current = next.slug;
    onSlug(next.slug);
  };
  const onKey = (event: KeyboardEvent) => {
    if (typing(event.target)) return;
    const action = previewKey(event);
    if (action === null) return;
    event.preventDefault();
    if (action === 'close') onSlug(null);
    else step(action);
  };

  return (
    <Sheet
      open={open !== undefined}
      onOpenChange={(isOpen) => {
        if (!isOpen) onSlug(null);
      }}
    >
      {theme && (
        <SheetContent
          side="full"
          closeLabel="Close preview"
          onKeyDown={(event) => onKey(event.nativeEvent)}
        >
          <SheetHeader>
            <SheetTitle>{theme.name}</SheetTitle>
            <SheetDescription>
              {THEME_STYLES[theme.style]} · {THEME_LAYOUTS[theme.layout]} ·{' '}
              {index + 1} of {list.length}
            </SheetDescription>
          </SheetHeader>
          <div className={s.main}>
            <ThemeFrame
              key={theme.slug}
              src={href(theme)}
              image={image(theme)}
              title={`${theme.name} theme, previewed on a resume`}
              onKey={onKey}
            />
            <div className={s.aside}>
              <p className={s.description}>{theme.description}</p>
              {details?.(theme)}
            </div>
          </div>
          <SheetFooter className={s.footer}>
            <span className={s.keys}>
              <Kbd>←</Kbd> <Kbd>→</Kbd> to flip through
            </span>
            <Button variant="secondary" onClick={() => step(-1)}>
              Previous
            </Button>
            <Button variant="secondary" onClick={() => step(1)}>
              Next
            </Button>
            <Button asChild>
              <a href={href(theme)} target="_blank" rel="noopener">
                Full page
              </a>
            </Button>
          </SheetFooter>
        </SheetContent>
      )}
    </Sheet>
  );
}
