import { Fragment, type ReactNode } from 'react';
import { isSitePath, SiteLink } from './SiteLink';

// [label](href) or `code`. Nothing else: page copy is short, and this keeps
// the full Markdown parser off pages that only need a link or two.
const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`/g;

/** Render one line of page copy with links and inline code. No HTML is parsed. */
export function InlineMarkdown({ children }: { children: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of children.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(children.slice(last, index));
    const [, label, href, code] = match;
    if (code !== undefined) {
      parts.push(<code key={index}>{code}</code>);
    } else if (label !== undefined && href !== undefined) {
      parts.push(
        isSitePath(href) || href.startsWith('#') ? (
          <SiteLink key={index} href={href}>
            {label}
          </SiteLink>
        ) : (
          <a key={index} href={href}>
            {label}
          </a>
        )
      );
    }
    last = index + match[0].length;
  }
  if (last < children.length) parts.push(children.slice(last));
  return (
    <>
      {parts.map((part, i) =>
        typeof part === 'string' ? (
          <Fragment key={`t${i}`}>{part}</Fragment>
        ) : (
          part
        )
      )}
    </>
  );
}

/** Paragraphs separated by blank lines, each rendered inline. */
export function InlineParagraphs({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <>
      {children.split(/\n\s*\n/).map((paragraph, i) => (
        <p key={i} className={className}>
          <InlineMarkdown>{paragraph.trim()}</InlineMarkdown>
        </p>
      ))}
    </>
  );
}
