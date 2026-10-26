import { Link, Stack, Text } from '@jsonresume/ui';
import { SCOPES, type ConsentClient, type Scope } from '@repo/api';
import { groups } from '@repo/mcp/catalog';

const isScope = (name: string): name is Scope => name in SCOPES;

/**
 * What the app may do once allowed: an agent asking for `mcp` gets every
 * tool group spelled out; other apps their scopes, one line each.
 */
export function ConsentScopes({ scopes }: { scopes: ReadonlyArray<string> }) {
  const lines = scopes.includes('mcp')
    ? Object.values(groups).map((g) => ({
        key: g.title,
        title: g.title,
        text: g.description,
      }))
    : scopes
        .filter(isScope)
        .map((s) => ({ key: s, title: undefined, text: SCOPES[s] }));
  return (
    <Stack asChild gap={2}>
      <ul>
        {lines.map((line) => (
          <li key={line.key}>
            <Text size="sm">
              {line.title ? <strong>{line.title}: </strong> : null}
              {line.text}
            </Text>
          </li>
        ))}
      </ul>
    </Stack>
  );
}

/** Who made the app, for apps a person registered; others registered themselves. */
export function ConsentMaker({ client }: { client: ConsentClient }) {
  if (!client.owner) return null;
  return (
    <Text size="xs" tone="muted">
      Registered by @{client.owner}
      {client.homepage ? (
        <>
          {' · '}
          <Link
            href={client.homepage}
            target="_blank"
            rel="noopener noreferrer"
          >
            {new URL(client.homepage).host}
          </Link>
        </>
      ) : null}
    </Text>
  );
}
