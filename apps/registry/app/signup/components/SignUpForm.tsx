import React from 'react';
import { Button, Input } from '@repo/ui';

interface SignUpFormProps {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SignUpForm = ({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: SignUpFormProps) => {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="rounded-md shadow-sm space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </div>
    </form>
  );
};
