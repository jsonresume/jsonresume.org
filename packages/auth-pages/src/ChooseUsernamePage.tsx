import { RegistryProvider, useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  Avatar,
  AuthCard,
  Button,
  Field,
  Input,
  Skeleton,
} from '@jsonresume/ui';
import {
  completeGithubAtom,
  errorTag,
  keys,
  pendingGithubAtom,
  useIsClient,
  usernameReason,
} from '@repo/api-client';
import { account } from '@repo/content/pages';
import { proxiedImage } from '@repo/images/url';
import { AsyncResult } from 'effect/reactivity';
import { useState, type FormEvent, type ReactNode } from 'react';
import {
  ErrorNote,
  errorMessage,
  refusalMessage,
  UsernameStatus,
  Form,
} from './shared';

function Choose({
  login,
  avatarUrl,
}: {
  login: string;
  avatarUrl: string | null;
}) {
  const copy = account.chooseUsername;
  const complete = useAtomSet(completeGithubAtom, { mode: 'promiseExit' });
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    const exit = await complete({
      payload: { username: name },
      reactivityKeys: keys.session,
    });
    const tag = errorTag(exit);
    if (tag === undefined)
      return window.location.assign('/dashboard?welcome=1');
    setBusy(false);
    setMessage(refusalMessage(usernameReason(exit), tag));
  };

  return (
    <AuthCard title={copy.title} description={copy.description(login)}>
      <Avatar
        name={login}
        src={proxiedImage(avatarUrl, 96)}
        size="md"
        shape="circle"
        alt=""
      />
      <ErrorNote message={message} />
      <Form onSubmit={submit}>
        <Field
          label={account.signUp.username}
          hint={
            <>
              {account.signUp.usernameHint(name)} <UsernameStatus name={name} />
            </>
          }
          required
        >
          <Input
            name="username"
            autoCapitalize="none"
            spellCheck={false}
            value={name}
            onChange={(e) => setName(e.target.value.trim().toLowerCase())}
            maxLength={39}
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

function Pending({ restart }: { restart: ReactNode }) {
  const result = useAtomValue(pendingGithubAtom);
  if (AsyncResult.isSuccess(result)) return <Choose {...result.value} />;
  if (AsyncResult.isFailure(result)) {
    return (
      <AuthCard title={account.chooseUsername.title} footer={restart}>
        <ErrorNote message={errorMessage('NoPendingSignup')} />
      </AuthCard>
    );
  }
  return <Loading />;
}

function Loading() {
  return (
    <AuthCard title={account.chooseUsername.title}>
      <Skeleton height="2.5rem" />
    </AuthCard>
  );
}

/** After GitHub sign-in, when an account here already holds the login. */
export function ChooseUsernamePage({ restart }: { restart: ReactNode }) {
  const isClient = useIsClient();
  return (
    <RegistryProvider>
      {isClient ? <Pending restart={restart} /> : <Loading />}
    </RegistryProvider>
  );
}
