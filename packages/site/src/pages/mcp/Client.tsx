import { Badge, CodeBlock } from '@jsonresume/ui';
import type { McpClient } from '@repo/content/pages';
import { InlineMarkdown } from '../../InlineMarkdown';
import * as s from './mcp.css';

const authBadge: Record<McpClient['auth'], string> = {
  oauth: 'Sign in',
  either: 'Sign in or API key',
  key: 'API key',
};

/** One client's setup: its name, how it signs in, the steps and the config. */
export function Client({
  client,
  heading: Heading = 'h3',
}: {
  client: McpClient;
  heading?: 'h3' | 'h4';
}) {
  return (
    <section
      id={client.id}
      className={s.client}
      aria-labelledby={`${client.id}-title`}
    >
      <div className={s.clientHead}>
        <Heading id={`${client.id}-title`} className={s.clientName}>
          {client.name}
        </Heading>
        <Badge tone={client.auth === 'key' ? 'neutral' : 'success'}>
          {authBadge[client.auth]}
        </Badge>
      </div>
      <ol className={s.steps}>
        {client.steps.map((step) => (
          <li key={step}>
            <InlineMarkdown>{step}</InlineMarkdown>
          </li>
        ))}
      </ol>
      {client.code ? (
        <CodeBlock label={client.code.label} code={client.code.code} copyable />
      ) : null}
    </section>
  );
}
