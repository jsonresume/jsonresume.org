import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { visuallyHidden } from '../../styles/shared.css';
import { cx } from '../../utils/cx';
import { prose } from '../typography/typography.css';

export interface MarkdownProps {
  /** Markdown source. Safe to stream: re-render with the growing text. */
  children: string;
  className?: string;
  /** Open links in a new tab (for chat and generated content). */
  externalLinks?: boolean;
  /**
   * Render links yourself, e.g. with your router's Link for same-site paths.
   * Return undefined to fall back to a plain <a>.
   */
  renderLink?: (link: { href: string; children: ReactNode }) => ReactNode;
}

/**
 * Renders Markdown (with GitHub tables, task lists and strikethrough) in the
 * brand prose style. Raw HTML is ignored, so untrusted text is safe.
 */
export function Markdown({
  children,
  className,
  externalLinks = false,
  renderLink,
}: MarkdownProps) {
  return (
    <div className={cx(prose, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Read-only task list items: a mark plus spoken status, not an
          // unlabelled disabled checkbox.
          input: ({ type, checked }) =>
            type === 'checkbox' ? (
              <>
                <span aria-hidden="true">{checked ? '☑' : '☐'} </span>
                <span className={visuallyHidden}>
                  {checked ? 'Done: ' : 'To do: '}
                </span>
              </>
            ) : null,
          a: ({ node: _node, ...props }) => {
            const custom =
              renderLink && props.href !== undefined
                ? renderLink({ href: props.href, children: props.children })
                : undefined;
            if (custom !== undefined) return custom;
            return externalLinks ? (
              <a {...props} target="_blank" rel="noreferrer noopener" />
            ) : (
              <a {...props} />
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
