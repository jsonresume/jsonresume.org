import { SignInGate } from '@jsonresume/ui';

export default function SignInGateJobs() {
  return (
    <SignInGate
      title="Track your job applications"
      description="Sign in to save jobs, mark progress and get matches from your resume."
      features={[
        'Daily matches from Hacker News hiring posts',
        'Notes and status for every application',
        'Cover letters from your resume',
      ]}
      signInHref="#login"
    />
  );
}
