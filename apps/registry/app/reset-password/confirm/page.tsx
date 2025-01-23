'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Card } from '@repo/ui/components/ui/card';

export default function ConfirmResetPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have the recovery token in the URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (!hashParams.get('access_token')) {
      setError('Invalid or expired reset link');
    }
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      // Password updated successfully, redirect to login
      router.push('/login?message=password-updated');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Set new password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your new password below.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handlePasswordReset}>
          <div>
            <label htmlFor="password" className="sr-only">
              New password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating password...' : 'Update password'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
