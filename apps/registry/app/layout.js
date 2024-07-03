// import { Octokit } from 'octokit';
import Menu from './components/Menu';
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
  // const { username } = params;
  // let username = null;

  // if (session) {
  //   const octokit = new Octokit({ auth: session.accessToken });
  //   const { data } = await octokit.rest.users.getAuthenticated();
  //   username = data.login;
  // }

  return (
    <html lang="en">
      <body>
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
      </body>
    </html>
  );
}
