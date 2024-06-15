import Header from '@jsonresume/ui/Header';
import { signOut } from 'next-auth/react';

export const metadata = {
  title: 'JSON Resume Registry',
};

export const viewport = {
  initialScale: 1,
  width: 'device-width',
};
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header
          left={
            <div>
              <a href="/">JSON Resume Registry</a>
            </div>
          }
          right={
            <div>
              <span onClick={signOut}>Logout</span>
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
