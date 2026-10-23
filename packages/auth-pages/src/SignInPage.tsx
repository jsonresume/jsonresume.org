import { RegistryProvider, useAtomSet } from '@effect/atom-react';
import { AuthCard, Button, Divider, Field, Input } from '@jsonresume/ui';
import { errorTag, keys, signInAtom } from '@repo/api-client';
import { account } from '@repo/content/pages';
import { useState, type FormEvent, type ReactNode } from 'react';
import * as s from './auth.css';
import { ErrorNote, errorMessage, GithubButton, safeNext } from './shared';

export interface SignInPageProps {
  /** Where to go once signed in (a path on this site). */
  next?: string | undefined;
  /** An ?error= from a GitHub sign-in that came back. */
  error?: string | undefined;
  /** The link to the sign-up page, rendered by the app's router. */
  signUpLink: ReactNode;
}

function SignInForm({ next, error, signUpLink }: SignInPageProps) {
  const copy = account.signIn;
  const signIn = useAtomSet(signInAtom, { mode: 'promiseExit' });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(
    error ? account.githubErrors[error] : undefined
  );

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    const exit = await signIn({
      payload: {
        email: String(form.get('email')),
        password: String(form.get('password')),
      },
      reactivityKeys: keys.session,
    });
    const tag = errorTag(exit);
    if (tag === undefined)
      return window.location.assign(safeNext(next, '/dashboard'));
    setBusy(false);
    setMessage(errorMessage(tag));
  };

  return (
    <AuthCard
      title={copy.title}
      description={copy.description}
      footer={
        <>
          {copy.footer.text} {signUpLink}
        </>
      }
    >
      <ErrorNote message={message} />
      <GithubButton label={copy.github} next={next} />
      <Divider label={copy.or} />
      <form className={s.form} onSubmit={submit}>
        <Field label={copy.email} required>
          <Input name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label={copy.password} required>
          <Input
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </Field>
        <Button type="submit" variant="primary" fullWidth disabled={busy}>
          {copy.submit}
        </Button>
      </form>
    </AuthCard>
  );
}

/** Sign in with GitHub, or with email and password. */
export function SignInPage(props: SignInPageProps) {
  return (
    <RegistryProvider>
      <SignInForm {...props} />
    </RegistryProvider>
  );
}
