import { useAtomSet } from '@effect/atom-react';
import { Button, Callout, Stack } from '@jsonresume/ui';
import type { JobPreferences, PreferenceSuggestion } from '@repo/api';
import { keys, saveJobPreferencesAtom } from '@repo/api-client';
import { useState } from 'react';
import * as css from './wants.css';
import { jobsEvent } from './labels';

/**
 * What their marks point to, one card each: accepting saves the change,
 * dismissing remembers not to ask again.
 */
export function Suggestions({
  suggestions,
  preferences,
}: {
  suggestions: ReadonlyArray<PreferenceSuggestion>;
  preferences: JobPreferences;
}) {
  const save = useAtomSet(saveJobPreferencesAtom, { mode: 'promiseExit' });
  const [answered, setAnswered] = useState(new Set<string>());
  const answer = (s: PreferenceSuggestion, accepted: boolean) => {
    setAnswered((prev) => new Set(prev).add(s.id));
    jobsEvent('job_suggestion_answered', { id: s.id, accepted });
    void save({
      payload: accepted
        ? s.preferences
        : { ...preferences, dismissed: [...preferences.dismissed, s.id] },
      query: { source: accepted ? 'suggestion' : 'you' },
      reactivityKeys: keys.jobs,
    });
  };
  const open = suggestions.filter((x) => !answered.has(x.id));
  if (open.length === 0) return null;
  return (
    <Stack gap={2}>
      {open.map((x) => (
        <Callout key={x.id} tone="info" title="From your marks">
          <div className={css.wants}>
            <span className={css.grow}>{x.text}</span>
            <Button size="sm" variant="primary" onClick={() => answer(x, true)}>
              Yes
            </Button>
            <Button size="sm" variant="ghost" onClick={() => answer(x, false)}>
              No thanks
            </Button>
          </div>
        </Callout>
      ))}
    </Stack>
  );
}
