import { useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Stack,
  Text,
} from '@jsonresume/ui';
import type { HiddenField } from '@repo/api';
import { keys, privacyAtom, setPrivacyAtom } from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';

const FIELDS: ReadonlyArray<{ field: HiddenField; label: string }> = [
  { field: 'email', label: 'Hide my email' },
  { field: 'phone', label: 'Hide my phone number' },
  { field: 'address', label: 'Hide my street address and postcode' },
];

/** Contact details kept off the public page, its downloads and feeds. */
export function PrivacyCard() {
  const result = useAtomValue(privacyAtom);
  const set = useAtomSet(setPrivacyAtom, { mode: 'promiseExit' });
  const hidden = AsyncResult.isSuccess(result) ? result.value.hidden : [];
  const toggle = (field: HiddenField, hide: boolean) =>
    void set({
      payload: {
        hidden: hide ? [...hidden, field] : hidden.filter((f) => f !== field),
      },
      reactivityKeys: keys.account,
    });
  return (
    <Card id="privacy">
      <CardHeader>
        <CardTitle level={2}>Contact details on your page</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap={4} align="start">
          <Text size="sm" tone="muted">
            Your page, its PDF, Word and JSON downloads, and anything that reads
            them leave out what you hide here. Your resume keeps them, and you
            still see them in the editor. Your town always shows.
          </Text>
          {FIELDS.map(({ field, label }) => (
            <Checkbox
              key={field}
              label={label}
              checked={hidden.includes(field)}
              disabled={!AsyncResult.isSuccess(result)}
              onCheckedChange={(checked) => toggle(field, checked === true)}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
