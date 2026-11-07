import { RegistryProvider, useAtomSet } from '@effect/atom-react';
import { Button, Callout } from '@jsonresume/ui';
import type { ThemeSummary } from '@repo/domain';
import {
  errorTag,
  keys,
  setThemeAtom,
  useSignedInHint,
} from '@repo/api-client';
import { Exit } from 'effect';
import { useState } from 'react';
import { paths } from '../../links';
import * as s from './themeUse.css';

type Outcome = { tone: 'success' | 'danger'; text: string; href?: string };

function UseThemeButton({ theme }: { theme: ThemeSummary }) {
  const set = useAtomSet(setThemeAtom, { mode: 'promiseExit' });
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>();
  const use = async () => {
    setBusy(true);
    const exit = await set({
      payload: { theme: theme.slug },
      reactivityKeys: keys.account,
    });
    setBusy(false);
    const tag = errorTag(exit);
    setOutcome(
      Exit.isSuccess(exit)
        ? {
            tone: 'success',
            text: `Done: your page uses ${theme.name} now.`,
            href: exit.value.path,
          }
        : tag === 'NoResume'
        ? {
            tone: 'danger',
            text: 'There’s no resume on your account yet.',
            href: `${paths.start}?theme=${encodeURIComponent(theme.slug)}`,
          }
        : { tone: 'danger', text: 'That didn’t save. Try again in a minute.' }
    );
  };
  return (
    <>
      <Button
        variant="primary"
        size="sm"
        className={s.action}
        loading={busy}
        onClick={() => void use()}
      >
        Use {theme.name}
      </Button>
      {outcome && (
        <Callout tone={outcome.tone}>
          {outcome.text}{' '}
          {outcome.href && (
            <a href={outcome.href}>
              {outcome.tone === 'success' ? 'See it' : 'Make one'}
            </a>
          )}
        </Callout>
      )}
    </>
  );
}

/** For people signed in: set this theme on their page in one click. */
export function UseTheme({ theme }: { theme: ThemeSummary }) {
  const signedIn = useSignedInHint();
  if (!signedIn) return null;
  return (
    <RegistryProvider>
      <UseThemeButton theme={theme} />
    </RegistryProvider>
  );
}
