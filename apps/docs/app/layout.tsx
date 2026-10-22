import './global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    default: 'JSON Resume Docs',
    template: '%s | JSON Resume Docs',
  },
  description: 'Documentation for the JSON Resume standard, CLI, and themes.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* The static export is also reachable at the GitHub Pages project
            URL, where its /docs asset paths don't resolve. Send visitors to
            the canonical jsonresume.org/docs URL. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if (location.hostname === 'jsonresume.github.io') location.replace('https://jsonresume.org/docs' + location.pathname.replace(/^\\/jsonresume\\.org/, '').replace(/\\/$/, '') + location.search + location.hash);`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
