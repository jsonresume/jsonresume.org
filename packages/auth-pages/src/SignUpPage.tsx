import { RegistryProvider, useAtomSet } from '@effect/atom-react';
import { AuthCard, Button, Divider, Field, Input, Text } from '@jsonresume/ui';
import { errorTag, keys, signUpAtom, usernameReason } from '@repo/api-client';
import { track } from '@repo/posthog/browser';
import { account } from '@repo/content/pages';
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import {
  ErrorNote,
  GithubButton,
  safeNext,
  refusalMessage,
  UsernameStatus,
  Form,
} from './shared';

export interface SignUpPageProps {
  next?: string | undefined;
  signInLink: ReactNode;
}

/** Where a new email account goes after signing up, unless `next` says. */
export const NEW_ACCOUNT_HOME = '/dashboard/editor?welcome=1';

function SignUpForm({ next, signInLink }: SignUpPageProps) {
  const copy = account.signUp;
  const signUp = useAtomSet(signUpAtom, { mode: 'promiseExit' });
  const [name, setName] = useState('');
  // Uncontrolled, so a name typed (or filled in) before the page hydrates
  // survives it; picked up here once it has.
  const nameInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const typed = nameInput.current?.value.trim().toLowerCase();
    if (typed) setName(typed);
  }, []);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    const exit = await signUp({
      payload: {
        username:
          String(form.get('username') ?? '')
            .trim()
            .toLowerCase() || name,
        email: String(form.get('email')),
        password: String(form.get('password')),
      },
      reactivityKeys: keys.session,
    });
    const tag = errorTag(exit);
    // A new email account has no resume yet: land where one is made (import,
    // blank or example). From the overview, 21 of 22 such accounts in 30
    // days to 2026-11-23 never made one.
    if (tag === undefined)
      return window.location.assign(safeNext(next, NEW_ACCOUNT_HOME));
    setBusy(false);
    const reason = usernameReason(exit);
    track('sign_up_failed', { reason: reason ?? tag ?? 'default' });
    setMessage(refusalMessage(reason, tag));
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
      <Text size="xs" tone="muted">
        {copy.githubNote}
      </Text>
      <Divider label={copy.or} />
      <Form onSubmit={submit}>
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
            ref={nameInput}
            onChange={(e) => {
              const next = e.target.value.trim().toLowerCase();
              if (next !== e.target.value) e.target.value = next;
              setName(next);
            }}
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
      </Form>
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
