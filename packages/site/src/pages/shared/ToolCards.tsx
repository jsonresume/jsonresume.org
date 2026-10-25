import { CodeBlock } from '@jsonresume/ui';
import type { Card } from '@repo/content/pages';
import * as l from './layout.css';

/**
 * Cards for external tools: the title links out, and an optional command sits
 * below it (a code block cannot live inside a link).
 */
export function ToolCards({
  tools,
}: {
  tools: ReadonlyArray<Card & { code?: string }>;
}) {
  return (
    <ul className={l.cardGridWide}>
      {tools.map((tool) => (
        <li key={tool.title} className={l.toolCard}>
          {tool.eyebrow ? <p className={l.eyebrow}>{tool.eyebrow}</p> : null}
          <h3 className={l.toolTitle}>
            <a href={tool.href}>{tool.title}</a>
          </h3>
          <p className={l.body}>{tool.description}</p>
          {tool.code ? <CodeBlock code={tool.code} /> : null}
        </li>
      ))}
    </ul>
  );
}
