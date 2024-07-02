import Header from '@jsonresume/ui/Header';
import { signOut } from 'next-auth/react';
import { Octokit } from 'octokit';
import Link from '@jsonresume/ui/Link';
import { auth } from '../auth';
import './global.css';

export const metadata = {
  title: 'JSON Resume Registry',
};

export const viewport = {
  initialScale: 1,
  width: 'device-width',
};

export default async function Layout({ children }) {
  const session = await auth();

  let username = null;

  if (session) {
    const octokit = new Octokit({ auth: session.accessToken });
    const { data } = await octokit.rest.users.getAuthenticated();
    username = data.login;
  }
  console.log('Hello, %s', { session });
  console.log(JSON.stringify({ session }));
  return (
    <html lang="en">
      <body>
        <Header
          left={
            <div>
              <Link href="/">JSON Resume Registry</Link>
            </div>
          }
          right={
            <div>
              {session && <Link href={`/${username}/editor`}>Editor</Link>}
              {session && <Link href={`/${username}/jobs`}>Jobs</Link>}
              {session && (
                <Link href={`/${username}/suggestions`}>Suggestions</Link>
              )}
              {session && (
                <Link href={`/${username}/interview`}>Interview</Link>
              )}
              {session && <Link href={`/${username}/letter`}>Letter</Link>}
              {session && <Link onClick={signOut}>Logout</Link>}
            </div>
          }
        />
        {children}
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Open+Sans:400,700,300,600,800&display=swap"
        />
      </body>
    </html>
  );
}
