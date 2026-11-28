import { useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Stack,
  Switch,
  Text,
} from '@jsonresume/ui';
import type { HiddenField, Privacy } from '@repo/api';
import { keys, privacyAtom, setPrivacyAtom } from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';
import { usePending } from './usePending';

const FIELDS: ReadonlyArray<{ field: HiddenField; label: string }> = [
  { field: 'email', label: 'Hide my email' },
  { field: 'phone', label: 'Hide my phone number' },
  { field: 'address', label: 'Hide my street address and postcode' },
];

const NONE: typeof Privacy.Type = { hidden: [], pagePrivate: false };

/**
 * Who sees the page at all, and the contact details kept off it, its
 * downloads and feeds. Each switch moves at once (see usePending).
 */
export function PrivacyCard() {
  const result = useAtomValue(privacyAtom);
  const set = useAtomSet(setPrivacyAtom, { mode: 'promiseExit' });
  const server = AsyncResult.isSuccess(result) ? result.value : NONE;
  const [pagePrivate, setPagePrivate] = usePending(server.pagePrivate);
  const [hidden, setHidden] = usePending(server.hidden.join(','));
  const ready = AsyncResult.isSuccess(result);
  const save = (payload: Partial<typeof Privacy.Type>) => () =>
    set({ payload, reactivityKeys: keys.account });
  const toggle = (field: HiddenField, hide: boolean) => {
    const was = hidden.split(',').filter((f): f is HiddenField => f !== '');
    const next = hide ? [...was, field] : was.filter((f) => f !== field);
    void setHidden(next.join(','), save({ hidden: next }));
  };
  return (
    <Card id="privacy">
      <CardHeader>
        <CardTitle level={2}>Privacy</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap={4} align="start">
          <Switch
            label="Keep my page private"
            checked={pagePrivate}
            disabled={!ready}
            onCheckedChange={(checked) =>
              void setPagePrivate(checked, save({ pagePrivate: checked }))
            }
          />
          <Text size="sm" tone="muted">
            {pagePrivate
              ? 'Only you see your page and its downloads, when signed in. It is out of Explore and search engines. Everything else here keeps working.'
              : 'Anyone with the link sees your page. Make it private to keep it to yourself while you use the editor, jobs and your agents.'}
          </Text>
          <Text size="sm" tone="muted">
            Your page, its PDF, Word and JSON downloads, and anything that reads
            them leave out what you hide here. Your resume keeps them, and you
            still see them in the editor. Your town always shows.
          </Text>
          {FIELDS.map(({ field, label }) => (
            <Checkbox
              key={field}
              label={label}
              checked={hidden.split(',').includes(field)}
              disabled={!ready}
              onCheckedChange={(checked) => toggle(field, checked === true)}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
