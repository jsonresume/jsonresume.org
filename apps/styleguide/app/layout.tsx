import '@jsonresume/ui/fonts.css';
import '@jsonresume/ui/styles.css';
import './globals.css';

import { base, SkipLink, TooltipProvider } from '@jsonresume/ui';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DocsHeader } from '@/components/docs-header';

export const metadata: Metadata = {
  metadataBase: new URL('https://styleguide.jsonresume.org'),
  title: {
    default: 'JSON Resume Styleguide',
    template: '%s · JSON Resume Styleguide',
  },
  description:
    'The JSON Resume design system: brand, tokens, components and patterns shared by jsonresume.org and the registry.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={base}>
        <TooltipProvider>
          <SkipLink />
          <DocsHeader />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
