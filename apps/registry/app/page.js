'use server';
import SignIn from './components/SignIn';
import { auth } from '../auth';
import { Octokit } from 'octokit';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();

  console.log('Hello, %s', { session });
  if (!session) {
    return <SignIn />;
  }

  if (session) {
    const octokit = new Octokit({ auth: session.accessToken });
    const { data } = await octokit.rest.users.getAuthenticated();
    const username = data.login;
    redirect(`/${username}/editor`);
  }

  return null;
}
