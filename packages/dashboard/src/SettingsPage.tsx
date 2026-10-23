import { useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  AppPage,
  Avatar,
  Badge,
  Button,
  Callout,
  DescriptionList,
} from '@jsonresume/ui';
import { accountAtom, signOutAtom } from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';
import * as s from './dashboard.css';
import { Notices } from './Notices';
import { searchParam } from './session';

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

/** The account: name, email, GitHub, signing out. */
export function SettingsPage() {
  const result = useAtomValue(accountAtom);
  const signOut = useAtomSet(signOutAtom, { mode: 'promiseExit' });
  if (!AsyncResult.isSuccess(result))
    return <AppPage title="Settings">{null}</AppPage>;
  const account = result.value;
  const items = [
    { term: 'Username', description: <>@{account.username}</> },
    {
      term: 'Email',
      description: account.email ? (
        <span className={s.row}>
          {account.email}
          {account.emailVerified ? (
            <Badge tone="success">Confirmed</Badge>
          ) : (
            <Badge tone="warning">Not confirmed</Badge>
          )}
        </span>
      ) : (
        <span className={s.muted}>None (signed up with GitHub)</span>
      ),
    },
    {
      term: 'GitHub',
      description: account.github ? (
        <span className={s.row}>
          <Avatar
            name={account.github.login}
            src={account.github.avatarUrl}
            size="sm"
            shape="circle"
            alt=""
          />
          <a href={`https://github.com/${account.github.login}`}>
            @{account.github.login}
          </a>
        </span>
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
    <AppPage title="Settings" description="Your account.">
      <div className={s.stack}>
        <GithubFlash />
        <Notices />
        <section className={s.panel} aria-labelledby="account-title">
          <h2 id="account-title" className={s.panelTitle}>
            Account
          </h2>
          <DescriptionList items={items} />
        </section>
        <div>
          <Button
            variant="secondary"
            onClick={() =>
              void signOut({}).then(() => window.location.assign('/'))
            }
          >
            Sign out
          </Button>
        </div>
      </div>
    </AppPage>
  );
}
