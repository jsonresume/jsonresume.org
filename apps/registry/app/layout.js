import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './context/auth';
import Menu from './components/Menu';
import '@repo/ui/globals.css';

export const metadata = {
  title: 'JSON Resume Registry',
};

export const viewport = {
  initialScale: 1,
  width: 'device-width',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Menu />
          <main>{children}</main>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
