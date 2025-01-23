import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './context/auth';
import Menu from './components/Menu';
import { ResumeProvider } from './providers/ResumeProvider';
import '@repo/ui/globals.css';

export const metadata = {
  title: 'JSON Resume Registry',
  description: 'JSON Resume Registry',
};

export const viewport = {
  initialScale: 1,
  width: 'device-width',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ResumeProvider>
          <AuthProvider>
            <Menu />
            <main>{children}</main>
            <Analytics />
          </AuthProvider>
        </ResumeProvider>
      </body>
    </html>
  );
}
