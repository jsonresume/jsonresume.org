import { useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Link,
  Stack,
  Table,
  Td,
  Text,
  Th,
  visuallyHidden,
} from '@jsonresume/ui';
import { connectionsAtom, disconnectAtom, keys } from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';
import { date } from '../format';

const SHORT: Readonly<Record<string, string>> = {
  mcp: 'Everything (MCP)',
  openid: 'Sign in',
  profile: 'Profile',
  email: 'Email',
  'resume:read': 'Read resume',
  'resume:write': 'Change resume',
};
/** What a connection may do, briefly. */
const can = (scopes: ReadonlyArray<string>) =>
  scopes.includes('mcp')
    ? SHORT['mcp']
    : scopes.map((s) => SHORT[s] ?? s).join(', ');

/** Apps connected with OAuth (ChatGPT, Claude, an ATS…), and disconnecting them. */
export function ConnectionsCard() {
  const result = useAtomValue(connectionsAtom);
  const disconnect = useAtomSet(disconnectAtom, { mode: 'promiseExit' });
  const list = AsyncResult.isSuccess(result) ? result.value : [];

  return (
    <Card id="connected-apps">
      <CardHeader>
        <CardTitle level={2}>Connected apps</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap={4} align="stretch">
          <Text size="sm" tone="muted">
            Agents and apps you’ve let use your resume. See how to{' '}
            <Link href="/mcp">connect an agent</Link>.
          </Text>
          {list.length > 0 ? (
            <Table aria-label="Connected apps">
              <thead>
                <tr>
                  <Th>App</Th>
                  <Th>Can</Th>
                  <Th>Connected</Th>
                  <Th>Last used</Th>
                  <Th>
                    <span className={visuallyHidden}>Disconnect</span>
                  </Th>
                </tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.clientId}>
                    <Td>{c.name}</Td>
                    <Td>{can(c.scopes)}</Td>
                    <Td>{date(c.connectedAt)}</Td>
                    <Td>{c.lastUsedAt ? date(c.lastUsedAt) : 'Never'}</Td>
                    <Td>
                      <Button
                        size="sm"
                        variant="secondary"
                        aria-label={`Disconnect ${c.name}`}
                        onClick={() =>
                          void disconnect({
                            params: { clientId: c.clientId },
                            reactivityKeys: keys.connections,
                          })
                        }
                      >
                        Disconnect
                      </Button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Text size="sm">No apps connected yet.</Text>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
