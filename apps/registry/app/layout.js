import Header from '@jsonresume/ui/Header';
import { signOut } from 'next-auth/react';
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
  console.log('Hello, %s', { session });

  return (
    <html lang="en">
      <body>
        <Header
          left={
            <div>
              <Link href="/">JSON Resume Registry</Link>
            </div>
          }
          right={<div>{session && <Link onClick={signOut}>Logout</Link>}</div>}
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
