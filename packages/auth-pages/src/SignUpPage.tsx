import { RegistryProvider, useAtomSet } from '@effect/atom-react';
import { AuthCard, Button, Divider, Field, Input } from '@jsonresume/ui';
import { errorTag, keys, signUpAtom, usernameReason } from '@repo/api-client';
import { account } from '@repo/content/pages';
import { useState, type FormEvent, type ReactNode } from 'react';
import * as s from './auth.css';
import {
  ErrorNote,
  GithubButton,
  safeNext,
  refusalMessage,
  UsernameStatus,
} from './shared';

export interface SignUpPageProps {
  next?: string | undefined;
  signInLink: ReactNode;
}

function SignUpForm({ next, signInLink }: SignUpPageProps) {
  const copy = account.signUp;
  const signUp = useAtomSet(signUpAtom, { mode: 'promiseExit' });
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    const exit = await signUp({
      payload: {
        username: name,
        email: String(form.get('email')),
        password: String(form.get('password')),
      },
      reactivityKeys: keys.session,
    });
    const tag = errorTag(exit);
    if (tag === undefined)
      return window.location.assign(safeNext(next, '/dashboard?welcome=1'));
    setBusy(false);
    setMessage(refusalMessage(usernameReason(exit), tag));
  };

  return (
    <AuthCard
      title={copy.title}
      description={copy.description}
      footer={
        <>
          {copy.footer.text} {signInLink}
        </>
      }
    >
      <ErrorNote message={message} />
      <GithubButton label={copy.github} next={next} />
      <p className={s.note}>{copy.githubNote}</p>
      <Divider label={copy.or} />
      <form className={s.form} onSubmit={submit}>
        <Field
          label={copy.username}
          hint={<UsernameHint name={name} />}
          required
        >
          <Input
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            value={name}
            onChange={(e) => setName(e.target.value.trim().toLowerCase())}
            maxLength={39}
            required
          />
        </Field>
        <Field label={copy.email} hint={copy.emailHint} required>
          <Input name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label={copy.password} hint={copy.passwordHint} required>
          <Input
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={10}
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

function UsernameHint({ name }: { name: string }) {
  return (
    <>
      {account.signUp.usernameHint(name)} <UsernameStatus name={name} />
    </>
  );
}

/** Choose a username, then GitHub or email and password. */
export function SignUpPage(props: SignUpPageProps) {
  return (
    <RegistryProvider>
      <SignUpForm {...props} />
    </RegistryProvider>
  );
}
