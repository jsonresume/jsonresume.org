import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { generateDisplayName } from '../utils/generateDisplayName';

export const useSignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First create the user
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: generateDisplayName(),
          },
        },
      });

      if (signUpError) throw signUpError;

      // Then sign them in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      router.push('/');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          scopes: 'read:user gist',
        },
      });

      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return {
    email,
    password,
    loading,
    error,
    setEmail,
    setPassword,
    handleSignUp,
    handleGithubLogin,
  };
};
