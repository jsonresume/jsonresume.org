import { supabase } from '../../lib/supabase';
import { Button } from '@repo/ui';
import logger from '@/lib/logger';

interface GitHubStatusSectionProps {
  isConnected: boolean;
  githubIdentity: any;
  session: any;
}

export const GitHubStatusSection = ({
  isConnected,
  githubIdentity,
  session,
}: GitHubStatusSectionProps) => {
  const handleReconnect = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        scopes: 'gist',
        redirectTo: window.location.origin + '/settings',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) {
      logger.error({ error: error.message }, 'OAuth reconnection error');
    }
  };

  if (!isConnected) {
    return (
      <div>
        <h2 className="font-semibold">GitHub Connection Status</h2>
        <p className="text-red-600">Not connected to GitHub</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-semibold">GitHub Connection Status</h2>
      <div className="space-y-2">
        <p className="text-green-600">✓ Connected to GitHub</p>
        <p className="text-sm text-gray-600">
          Access Token Available: {githubIdentity?.access_token ? 'Yes' : 'No'}
        </p>
        <div className="text-sm text-gray-600">
          <p>Provider Token: {session.provider_token ? 'Yes' : 'No'}</p>
          {session.provider_token && (
            <p className="text-xs">
              Token: {session.provider_token.substring(0, 8)}...
              {session.provider_token.substring(
                session.provider_token.length - 8
              )}
            </p>
          )}
          <p>
            App Metadata Token:{' '}
            {session.user.app_metadata?.provider_token ? 'Yes' : 'No'}
          </p>
          <p>Identity Token: {githubIdentity?.provider_token ? 'Yes' : 'No'}</p>
        </div>
        {!githubIdentity?.access_token && (
          <Button onClick={handleReconnect}>
            Reconnect GitHub with Gist Access
          </Button>
        )}
      </div>
    </div>
  );
};
