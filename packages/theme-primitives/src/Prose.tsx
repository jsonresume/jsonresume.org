import { renderInlineMarkdown } from '@jsonresume/utils';
import type { ElementType } from 'react';

/**
 * Resume prose with its inline Markdown rendered (#600): **strong**,
 * *emphasis*, `code` and [links](https://example.com). The shared renderer
 * escapes the text first and keeps only http(s) and mailto links, so every
 * theme shows the same, safe result.
 */
export function Prose({
  as: Tag = 'p',
  text,
  className,
}: {
  as?: ElementType;
  text: string;
  className?: string;
}) {
  return (
    <Tag
      className={className}
      dir="auto"
      dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(text) }}
    />
  );
}
