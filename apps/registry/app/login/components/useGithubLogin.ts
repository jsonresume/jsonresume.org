'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

// Get the app URL from environment, fallback to window.location.origin
const getAppUrl = () => {
  if (typeof window === 'undefined') return '';
  return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
};

export const useGithubLogin = () => {
  const [error, setError] = useState<string | null>(null);

  const handleGithubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          scopes: 'read:user gist',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${getAppUrl()}/editor`,
        },
      });

      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return { error, handleGithubLogin };
};
