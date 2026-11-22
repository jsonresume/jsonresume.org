import React from 'react';
import { renderInlineMarkdown } from '@jsonresume/utils/markdown';

/**
 * InlineMarkdown Component
 * Resume text with its inline Markdown rendered (#600): **strong**,
 * *emphasis*, `code` and [links](https://example.com), the subset the
 * schema allows in summaries, work and project highlights and project
 * descriptions. Every theme that uses it shows the same thing. The text is
 * escaped first and links keep only http(s) and mailto addresses, so it is
 * safe with resume text from anyone.
 *
 * @component
 * @example
 * <InlineMarkdown text={work.summary} />
 * <InlineMarkdown as="li" text={highlight} />
 *
 * @param {string} text - The resume text
 * @param {React.ElementType} [as='span'] - HTML element to render as
 */
export function InlineMarkdown({ text, as: Tag = 'span', ...rest }) {
  return (
    <Tag
      {...rest}
      dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(text) }}
    />
  );
}

export default InlineMarkdown;
