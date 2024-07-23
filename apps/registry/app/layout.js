// import { Octokit } from 'octokit';
import { Analytics } from '@vercel/analytics/react';

import Menu from './components/Menu';
import { auth } from '../auth';
import '@repo/ui/globals.css';
export const metadata = {
  title: 'JSON Resume Registry',
};

export const viewport = {
  initialScale: 1,
  width: 'device-width',
};

export default async function Layout({ children }) {
  const session = await auth();
  // const { username } = params;
  // let username = null;

  // if (session) {
  //   const octokit = new Octokit({ auth: session.accessToken });
  //   const { data } = await octokit.rest.users.getAuthenticated();
  //   username = data.login;
  // }

  return (
    <html lang="en">
      <body
        style={{
          'background-image': `url("data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='%23f2f2f2' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          'background-repeat': 'repeat',
        }}
      >
        <Menu session={session} />
        {children}
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Open+Sans:400,700,300,600,800&display=swap"
        />

        <Analytics />
      </body>
    </html>
  );
}
