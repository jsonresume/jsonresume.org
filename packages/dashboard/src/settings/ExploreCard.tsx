import { useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Link,
  Stack,
  Switch,
  Text,
} from '@jsonresume/ui';
import {
  exploreListingAtom,
  keys,
  setExploreListingAtom,
} from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';

/** Whether the resume is listed in Explore; the page stays public either way. */
export function ExploreCard() {
  const result = useAtomValue(exploreListingAtom);
  const set = useAtomSet(setExploreListingAtom, { mode: 'promiseExit' });
  const listed = AsyncResult.isSuccess(result) ? result.value.listed : true;
  return (
    <Card id="explore">
      <CardHeader>
        <CardTitle level={2}>Explore</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap={4} align="start">
          <Text size="sm" tone="muted">
            <Link href="/explore">Explore</Link> lets anyone search public
            resumes by skill, role and place. Your page stays public whether or
            not it is listed.
          </Text>
          <Switch
            label="List my resume in Explore"
            checked={listed}
            disabled={!AsyncResult.isSuccess(result)}
            onCheckedChange={(checked) =>
              void set({
                payload: { listed: checked },
                reactivityKeys: keys.explore,
              })
            }
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
