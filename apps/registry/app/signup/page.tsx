'use client';

import { Card } from '@repo/ui';
import {
  PageHeader,
  GitHubButton,
  FormDivider,
  SignUpForm,
} from './components';
import { useSignUp } from './hooks/useSignUp';

export default function SignUpPage() {
  const {
    email,
    password,
    loading,
    error,
    setEmail,
    setPassword,
    handleSignUp,
    handleGithubLogin,
  } = useSignUp();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <PageHeader />
        <GitHubButton onClick={handleGithubLogin} />
        <FormDivider />
        <SignUpForm
          email={email}
          password={password}
          loading={loading}
          error={error}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSignUp}
        />
      </Card>
    </div>
  );
}
