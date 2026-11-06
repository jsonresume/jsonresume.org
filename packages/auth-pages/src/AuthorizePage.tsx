import { RegistryProvider, useAtomSet, useAtomValue } from '@effect/atom-react';
import { AuthCard, Button, Callout, Skeleton, Text } from '@jsonresume/ui';
import {
  oauthClientAtom,
  oauthDecideAtom,
  sessionAtom,
  useIsClient,
} from '@repo/api-client';
import { Exit } from 'effect';
import { AsyncResult } from 'effect/reactivity';
import { useState } from 'react';
import { ConsentMaker, ConsentScopes } from './ConsentScopes';
import { Form } from './shared';

/** What /oauth/authorize was asked, from its query string. */
export interface AuthorizeRequest {
  responseType?: string;
  clientId?: string;
  redirectUri?: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
  scope?: string;
  state?: string;
  nonce?: string;
}

const TITLE = 'Connect an app';
const UNSUPPORTED =
  'This app asked in a way jsonresume.org doesn’t support (it needs the authorization code flow, with PKCE S256 unless it has a client secret).';

function Problem({ text }: { text: string }) {
  return (
    <AuthCard title={TITLE}>
      <Callout tone="danger" role="alert">
        {text}
      </Callout>
    </AuthCard>
  );
}

function Consent({
  request,
  clientId,
  redirectUri,
  codeChallenge,
}: {
  request: AuthorizeRequest;
  clientId: string;
  redirectUri: string;
  codeChallenge: string | undefined;
}) {
  const client = useAtomValue(
    oauthClientAtom(`${clientId}\n${redirectUri}\n${request.scope ?? ''}`)
  );
  const session = useAtomValue(sessionAtom);
  const decide = useAtomSet(oauthDecideAtom, { mode: 'promiseExit' });
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  if (AsyncResult.isFailure(client)) {
    return (
      <Problem text="This app isn’t registered with jsonresume.org, asked to be sent somewhere it didn’t register, or asked for something jsonresume.org doesn’t offer. Start connecting again from the app." />
    );
  }
  // Only apps with a secret may leave out PKCE.
  if (
    AsyncResult.isSuccess(client) &&
    !codeChallenge &&
    !client.value.confidential
  ) {
    return <Problem text={UNSUPPORTED} />;
  }
  if (!AsyncResult.isSuccess(client) || AsyncResult.isInitial(session)) {
    return (
      <AuthCard title={TITLE}>
        <Skeleton height="8rem" />
      </AuthCard>
    );
  }
  const here = `${window.location.pathname}${window.location.search}`;
  if (AsyncResult.isFailure(session)) {
    return (
      <AuthCard
        title={TITLE}
        description={`Sign in to let ${client.value.name} use your JSON Resume.`}
      >
        <Button asChild variant="primary" fullWidth>
          <a href={`/signin?next=${encodeURIComponent(here)}`}>Sign in</a>
        </Button>
        <Button asChild variant="secondary" fullWidth>
          <a href={`/signup?next=${encodeURIComponent(here)}`}>
            Create an account
          </a>
        </Button>
      </AuthCard>
    );
  }

  const answer = async (approve: boolean) => {
    setBusy(true);
    const exit = await decide({
      payload: {
        client_id: clientId,
        redirect_uri: redirectUri,
        ...(codeChallenge !== undefined && { code_challenge: codeChallenge }),
        ...(request.scope !== undefined && { scope: request.scope }),
        ...(request.state !== undefined && { state: request.state }),
        ...(request.nonce !== undefined && { nonce: request.nonce }),
        approve,
      },
    });
    if (Exit.isSuccess(exit))
      return window.location.assign(exit.value.redirect);
    setBusy(false);
    setFailed(true);
  };

  return (
    <AuthCard
      title={TITLE}
      description={
        <>
          <strong>{client.value.name}</strong> wants to use your JSON Resume as{' '}
          <strong>@{session.value.username}</strong>. It will be able to:
        </>
      }
      footer={
        <Text size="xs" tone="muted">
          After you allow it, you’ll go back to {client.value.redirectHost}.
          Disconnect it any time in Settings.
        </Text>
      }
    >
      <ConsentScopes scopes={client.value.scopes} />
      <ConsentMaker client={client.value} />
      {failed ? (
        <Callout tone="danger" role="alert">
          That didn’t work. Start connecting again from the app.
        </Callout>
      ) : null}
      <Form onSubmit={(e) => (e.preventDefault(), void answer(true))}>
        <Button type="submit" variant="primary" fullWidth disabled={busy}>
          Allow
        </Button>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          disabled={busy}
          onClick={() => void answer(false)}
        >
          Deny
        </Button>
      </Form>
    </AuthCard>
  );
}

function Authorize({ request }: { request: AuthorizeRequest }) {
  const { clientId, redirectUri, codeChallenge } = request;
  if (!clientId || !redirectUri) {
    return (
      <Problem text="This link is missing who is asking. Start connecting again from the app." />
    );
  }
  if (
    request.responseType !== 'code' ||
    (codeChallenge !== undefined && request.codeChallengeMethod !== 'S256')
  ) {
    return <Problem text={UNSUPPORTED} />;
  }
  return (
    <Consent
      request={request}
      clientId={clientId}
      redirectUri={redirectUri}
      codeChallenge={codeChallenge}
    />
  );
}

/** /oauth/authorize: an app (an MCP client, an HR tool) asks to use the user's resume. */
export function AuthorizePage({ request }: { request: AuthorizeRequest }) {
  const isClient = useIsClient();
  return (
    <RegistryProvider>
      {isClient ? (
        <Authorize request={request} />
      ) : (
        <AuthCard title={TITLE}>
          <Skeleton height="8rem" />
        </AuthCard>
      )}
    </RegistryProvider>
  );
}
