import { useAtom, useAtomValue } from '@effect/atom-react';
import { Field, Input } from '@jsonresume/ui';
import { textParam, useAtomsInUrl } from '@repo/url-state';
import { Atom } from 'effect/reactivity';
import * as s from './githubUser.css';

/** Whose registry links to show; the example user until someone types theirs. */
export const githubUserAtom = Atom.make('');

export const EXAMPLE_USER = 'thomasdavis';

/** The username links should use: what was typed, or the example. */
export const useGithubUser = () =>
  useAtomValue(githubUserAtom).trim() || EXAMPLE_USER;

const bindings = [textParam('user', githubUserAtom)];

// GitHub usernames: letters, digits and single hyphens, up to 39 characters.
const clean = (value: string) =>
  value.replace(/[^A-Za-z0-9-]/g, '').slice(0, 39);

/**
 * "Your GitHub username": rewrites every registry link on the page to yours,
 * and keeps it in ?user= so the personalised page can be shared.
 */
export function GithubUserField({ hint }: { hint?: string }) {
  useAtomsInUrl(bindings);
  const [user, setUser] = useAtom(githubUserAtom);
  return (
    <div className={s.field}>
      <Field
        label="Your GitHub username"
        hint={hint ?? `Links below use ${EXAMPLE_USER} until you enter yours.`}
      >
        <Input
          value={user}
          onChange={(event) => setUser(clean(event.target.value))}
          placeholder={EXAMPLE_USER}
          autoComplete="username"
          spellCheck={false}
        />
      </Field>
    </div>
  );
}
