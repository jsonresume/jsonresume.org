import { useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  AppPage,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Grid,
  Link,
  Stack,
  Text,
} from '@jsonresume/ui';
import type { Account } from '@repo/api';
import { accountAtom, keys, setSourceAtom } from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';
import { AtsCard } from './AtsCard';
import { StoredCard } from './StoredCard';

const formats = [
  { label: 'PDF', ext: 'pdf' },
  { label: 'JSON', ext: 'json' },
  { label: 'YAML', ext: 'yaml' },
  { label: 'Plain text', ext: 'txt' },
  { label: 'RenderCV (YAML)', ext: 'rendercv' },
  { label: 'QR code to your page', ext: 'qr' },
];

const InUse = ({ when }: { when: boolean }) =>
  when ? <Badge tone="success">In use</Badge> : null;

function GistCard({ account, use }: { account: Account; use: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle level={2}>
          GitHub gist <InUse when={account.source === 'gist'} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap={4} align="start">
          {account.github ? (
            <>
              <Text size="sm" tone="muted">
                Reads resume.json from{' '}
                <Link href={`https://gist.github.com/${account.github.login}`}>
                  @{account.github.login}’s gists
                </Link>
                . Edits there show within a minute, and saving in the editor
                writes to it.
              </Text>
              {account.gistWrite ? null : (
                <Button asChild variant="secondary">
                  <a href="/api/auth/github?intent=link&next=/dashboard/resume">
                    Allow saving to your gist
                  </a>
                </Button>
              )}
              {account.source !== 'gist' ? (
                <Button variant="secondary" onClick={use}>
                  Use the gist
                </Button>
              ) : null}
            </>
          ) : (
            <>
              <Text size="sm" tone="muted">
                Keep resume.json in a GitHub gist and your page follows it.
              </Text>
              <Button asChild variant="secondary">
                <a href="/api/auth/github?intent=link&next=/dashboard/resume">
                  Link GitHub
                </a>
              </Button>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

/** Where /@username reads the resume, and whether it is live. */
export function ResumePage() {
  const result = useAtomValue(accountAtom);
  const setSource = useAtomSet(setSourceAtom, { mode: 'promiseExit' });
  if (!AsyncResult.isSuccess(result))
    return <AppPage title="Resume">{null}</AppPage>;
  const account = result.value;
  const use = (source: 'gist' | 'stored') => () =>
    void setSource({ payload: { source }, reactivityKeys: keys.account });
  return (
    <AppPage
      title="Resume"
      description={
        <Stack asChild direction="row" wrap align="center" gap={3}>
          <span>
            <Link href={account.path}>jsonresume.org{account.path}</Link>
            {account.public ? (
              <Badge tone="success">Live</Badge>
            ) : (
              <Badge tone="warning">Not live yet</Badge>
            )}
          </span>
        </Stack>
      }
      actions={
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {formats.map((f) => (
                <DropdownMenuItem key={f.ext} asChild>
                  <a href={`${account.path}.${f.ext}`}>{f.label}</a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild size="sm" variant="ghost">
            <a href={`${account.path}/timeline`}>Timeline</a>
          </Button>
          <Button asChild size="sm" variant="primary">
            <a href="/dashboard/editor">Open the editor</a>
          </Button>
        </>
      }
    >
      <Grid gap={6} minColumnWidth="18rem" stretch>
        <GistCard account={account} use={use('gist')} />
        <StoredCard account={account} use={use('stored')} />
      </Grid>
      <AtsCard />
    </AppPage>
  );
}
