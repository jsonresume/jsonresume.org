'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Card } from '@repo/ui';

export default function SettingsPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
      }
      setLoading(false);
    };

    fetchSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in to view settings</div>;
  }

  const username =
    session.user.user_metadata?.user_name ||
    session.user.user_metadata?.preferred_username;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Email</h2>
            <p>{session.user.email}</p>
          </div>
          {username && (
            <div>
              <h2 className="font-semibold">GitHub Username</h2>
              <p>{username}</p>
            </div>
          )}
          <div>
            <h2 className="font-semibold">GitHub Connection Status</h2>
            {session.user.identities?.some(
              (identity: any) => identity.provider === 'github'
            ) ? (
              <div className="space-y-2">
                <p className="text-green-600">✓ Connected to GitHub</p>
                <p className="text-sm text-gray-600">
                  Access Token Available:{' '}
                  {session.user.identities?.find(
                    (identity: any) => identity.provider === 'github'
                  )?.access_token
                    ? 'Yes'
                    : 'No'}
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
                  <p>
                    Identity Token:{' '}
                    {session.user.identities?.find(
                      (identity: any) => identity.provider === 'github'
                    )?.provider_token
                      ? 'Yes'
                      : 'No'}
                  </p>
                </div>
                {!session.user.identities?.find(
                  (identity: any) => identity.provider === 'github'
                )?.access_token && (
                  <button
                    onClick={async () => {
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
                        console.error('OAuth error:', error);
                      }
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Reconnect GitHub with Gist Access
                  </button>
                )}
              </div>
            ) : (
              <p className="text-red-600">Not connected to GitHub</p>
            )}
          </div>
          <div>
            <h2 className="font-semibold">User ID</h2>
            <p>{session.user.id}</p>
          </div>
          <div>
            <h2 className="font-semibold">Last Sign In</h2>
            <p>{new Date(session.user.last_sign_in_at).toLocaleString()}</p>
          </div>
          <div className="mt-8">
            <h2 className="font-semibold mb-2">Debug Information</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium">GitHub Identity</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(
                  session.user.identities?.find(
                    (identity: any) => identity.provider === 'github'
                  ),
                  null,
                  2
                )}
              </pre>
              <h3 className="font-medium mt-2">User Metadata</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(session.user.user_metadata, null, 2)}
              </pre>
              <h3 className="font-medium mt-2">App Metadata</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(session.user.app_metadata, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
