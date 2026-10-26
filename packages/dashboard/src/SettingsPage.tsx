import { useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  AppPage,
  Avatar,
  Badge,
  Button,
  Callout,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DescriptionList,
  Link,
  Stack,
  Text,
} from '@jsonresume/ui';
import type { Account } from '@repo/api';
import { accountAtom, signOutAtom } from '@repo/api-client';
import { proxiedImage } from '@repo/images/url';
import { AsyncResult } from 'effect/reactivity';
import type { ReactNode } from 'react';
import { Notices } from './Notices';
import { searchParam } from './session';
import { DeleteAccount } from './settings/DeleteAccount';
import { ApiKeysCard } from './settings/ApiKeysCard';
import { ConnectionsCard } from './settings/ConnectionsCard';
import { OAuthAppsCard } from './settings/OAuthAppsCard';
import { ExploreCard } from './settings/ExploreCard';
import { UsernameCard } from './settings/UsernameCard';

function GithubFlash() {
  const github = searchParam('github');
  if (github === 'linked')
    return <Callout tone="success">GitHub is linked.</Callout>;
  if (github === 'taken') {
    return (
      <Callout tone="danger">
        That GitHub account is already linked to another JSON Resume account.
      </Callout>
    );
  }
  return null;
}

const Inline = ({ children }: { children: ReactNode }) => (
  <Stack asChild direction="row" wrap align="center" gap={2}>
    <span>{children}</span>
  </Stack>
);

function Details({ account }: { account: Account }) {
  const items = [
    {
      term: 'Page',
      description: (
        <Link href={account.path}>jsonresume.org{account.path}</Link>
      ),
    },
    {
      term: 'Email',
      description: account.email ? (
        <Inline>
          {account.email}
          {account.emailVerified ? (
            <Badge tone="success">Confirmed</Badge>
          ) : (
            <Badge tone="warning">Not confirmed</Badge>
          )}
        </Inline>
      ) : (
        <Text as="span" size="sm" tone="muted">
          None (signed up with GitHub)
        </Text>
      ),
    },
    {
      term: 'GitHub',
      description: account.github ? (
        <Inline>
          <Avatar
            name={account.github.login}
            src={proxiedImage(account.github.avatarUrl, 64)}
            size="sm"
            shape="circle"
            alt=""
          />
          <Link href={`https://github.com/${account.github.login}`}>
            @{account.github.login}
          </Link>
        </Inline>
      ) : (
        <Button asChild size="sm" variant="secondary">
          <a href="/api/auth/github?intent=link&next=/dashboard/settings">
            Link GitHub
          </a>
        </Button>
      ),
    },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle level={2}>Account</CardTitle>
      </CardHeader>
      <CardContent>
        <DescriptionList items={items} />
      </CardContent>
    </Card>
  );
}

/** The account: details, username, connected apps and keys, signing out, deleting. */
export function SettingsPage() {
  const result = useAtomValue(accountAtom);
  const signOut = useAtomSet(signOutAtom, { mode: 'promiseExit' });
  if (!AsyncResult.isSuccess(result))
    return <AppPage title="Settings">{null}</AppPage>;
  const account = result.value;
  return (
    <AppPage
      title="Settings"
      description="Your account."
      actions={
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            void signOut({}).then(() => window.location.assign('/'))
          }
        >
          Sign out
        </Button>
      }
    >
      <Stack gap={6}>
        <GithubFlash />
        <Notices />
        <Details account={account} />
        <UsernameCard account={account} />
        <ExploreCard />
        <ConnectionsCard />
        <ApiKeysCard />
        <OAuthAppsCard />
        <DeleteAccount username={account.username} />
      </Stack>
    </AppPage>
  );
}
