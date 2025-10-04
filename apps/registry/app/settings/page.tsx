'use client';

import { Card } from '@repo/ui';
import { useSession } from './hooks/useSession';
import { getUsername } from './utils/getUsername';
import {
  getGitHubIdentity,
  isGitHubConnected,
} from './utils/getGitHubIdentity';
import {
  UserInfoSection,
  GitHubStatusSection,
  DebugSection,
} from './components';

export default function SettingsPage() {
  const { session, loading } = useSession();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in to view settings</div>;
  }

  const username = getUsername(session);
  const githubIdentity = getGitHubIdentity(session);
  const connected = isGitHubConnected(session);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Card className="p-6">
        <div className="space-y-4">
          <UserInfoSection
            email={session.user.email}
            username={username}
            userId={session.user.id}
            lastSignIn={session.user.last_sign_in_at}
          />
          <GitHubStatusSection
            isConnected={connected}
            githubIdentity={githubIdentity}
            session={session}
          />
          <DebugSection
            githubIdentity={githubIdentity}
            userMetadata={session.user.user_metadata}
            appMetadata={session.user.app_metadata}
          />
        </div>
      </Card>
    </div>
  );
}
