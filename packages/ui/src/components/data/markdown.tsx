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
}

/**
 * Renders Markdown (with GitHub tables, task lists and strikethrough) in the
 * brand prose style. Raw HTML is ignored, so untrusted text is safe.
 */
export function Markdown({
  children,
  className,
  externalLinks = false,
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
          ...(externalLinks
            ? {
                a: ({ node: _node, ...props }) => (
                  <a {...props} target="_blank" rel="noreferrer noopener" />
                ),
              }
            : {}),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
