import '@jsonresume/ui/fonts.css';
import '@jsonresume/ui/styles.css';
import './global.css';

import { base, SkipLink, Toaster, TooltipProvider } from '@jsonresume/ui';
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

/** Applies a saved theme before first paint, so dark readers never see a light flash. */
const THEME_SCRIPT = `try{var t=localStorage.getItem('jr-styleguide-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="system" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={base}>
        <TooltipProvider>
          <SkipLink />
          <DocsHeader />
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
