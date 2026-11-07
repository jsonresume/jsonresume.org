import { useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  Button,
  Callout,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Stack,
  Text,
} from '@jsonresume/ui';
import {
  acceptProposalAtom,
  errorTag,
  keys,
  proposalsAtom,
  rejectProposalAtom,
} from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';
import { useState } from 'react';
import { date } from './format';

const words = { added: 'adds', removed: 'removes', changed: 'changes' };

/**
 * Changes an app or assistant suggested instead of saving: accept one to
 * save it (a version credited to them), or reject it. Hidden when none wait.
 */
export function ProposalsCard() {
  const result = useAtomValue(proposalsAtom);
  const accept = useAtomSet(acceptProposalAtom, { mode: 'promiseExit' });
  const reject = useAtomSet(rejectProposalAtom, { mode: 'promiseExit' });
  const [failed, setFailed] = useState<string>();
  const list = AsyncResult.isSuccess(result) ? result.value : [];
  if (list.length === 0) return null;
  return (
    <Card id="proposals">
      <CardHeader>
        <CardTitle level={2}>Suggested changes</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap={4} align="stretch">
          {failed ? <Callout tone="danger">{failed}</Callout> : null}
          {list.map((p) => (
            <Stack key={p.id} gap={2} align="stretch">
              <Text weight="semibold">
                {p.by.name ?? 'An app'} · {date(p.createdAt)}
              </Text>
              {p.note ? <Text size="sm">{p.note}</Text> : null}
              <Text size="sm" tone="muted">
                {p.changes.length === 0
                  ? 'Nothing differs from your resume now.'
                  : p.changes
                      .slice(0, 6)
                      .map((c) => `${words[c.kind]} ${c.path}`)
                      .join(' · ') +
                    (p.changes.length > 6
                      ? ` and ${p.changes.length - 6} more`
                      : '')}
              </Text>
              <Stack direction="row" gap={2} wrap>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={async () => {
                    setFailed(undefined);
                    const exit = await accept({
                      params: { id: p.id },
                      reactivityKeys: [...keys.account, ...keys.versions],
                    });
                    if (errorTag(exit))
                      setFailed('That didn’t save. Try again in a minute.');
                  }}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    void reject({
                      params: { id: p.id },
                      reactivityKeys: keys.account,
                    })
                  }
                >
                  Reject
                </Button>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
