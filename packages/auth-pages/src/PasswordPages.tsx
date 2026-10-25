import { RegistryProvider, useAtomSet } from '@effect/atom-react';
import { AuthCard, Button, Callout, Field, Input } from '@jsonresume/ui';
import {
  errorTag,
  forgotPasswordAtom,
  keys,
  resetPasswordAtom,
} from '@repo/api-client';
import { account } from '@repo/content/pages';
import { useState, type FormEvent, type ReactNode } from 'react';
import { ErrorNote, errorMessage, Form } from './shared';

function Forgot({ signInLink }: { signInLink: ReactNode }) {
  const copy = account.forgotPassword;
  const send = useAtomSet(forgotPasswordAtom, { mode: 'promiseExit' });
  const [sentTo, setSentTo] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get('email'));
    setBusy(true);
    const tag = errorTag(await send({ payload: { email } }));
    setBusy(false);
    if (tag === undefined) setSentTo(email);
    else setMessage(errorMessage(tag));
  };

  return (
    <AuthCard
      title={copy.title}
      description={copy.description}
      footer={signInLink}
    >
      {sentTo ? (
        <Callout tone="success" role="status">
          {copy.sent(sentTo)}
        </Callout>
      ) : (
        <>
          <ErrorNote message={message} />
          <Form onSubmit={submit}>
            <Field label={copy.email} required>
              <Input name="email" type="email" autoComplete="email" required />
            </Field>
            <Button type="submit" variant="primary" fullWidth disabled={busy}>
              {copy.submit}
            </Button>
          </Form>
        </>
      )}
    </AuthCard>
  );
}

function Reset({
  token,
  forgotLink,
}: {
  token: string | undefined;
  forgotLink: ReactNode;
}) {
  const copy = account.resetPassword;
  const reset = useAtomSet(resetPasswordAtom, { mode: 'promiseExit' });
  const [message, setMessage] = useState<string>();
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    setBusy(true);
    const password = String(new FormData(event.currentTarget).get('password'));
    const exit = await reset({
      payload: { token, password },
      reactivityKeys: keys.session,
    });
    const tag = errorTag(exit);
    if (tag === undefined) return window.location.assign('/dashboard');
    setBusy(false);
    setMessage(errorMessage(tag));
  };

  return (
    <AuthCard
      title={copy.title}
      description={copy.description}
      footer={forgotLink}
    >
      <ErrorNote message={token ? message : copy.missing} />
      {token ? (
        <Form onSubmit={submit}>
          <Field label={copy.password} required>
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
      ) : null}
    </AuthCard>
  );
}

/** Ask for a link to choose a new password. */
export function ForgotPasswordPage(props: { signInLink: ReactNode }) {
  return (
    <RegistryProvider>
      <Forgot {...props} />
    </RegistryProvider>
  );
}

/** Choose a new password, from the emailed link (?token=). */
export function ResetPasswordPage(props: {
  token: string | undefined;
  forgotLink: ReactNode;
}) {
  return (
    <RegistryProvider>
      <Reset {...props} />
    </RegistryProvider>
  );
}
