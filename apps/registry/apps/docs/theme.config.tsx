import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: (
    <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>JSON Resume</span>
  ),
  project: {
    link: 'https://github.com/jsonresume/jsonresume.org',
  },
  docsRepositoryBase:
    'https://github.com/jsonresume/jsonresume.org/tree/master/apps/docs',
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{' '}
        <a href="https://jsonresume.org" target="_blank">
          JSON Resume
        </a>
        .
      </span>
    ),
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – JSON Resume',
    };
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="JSON Resume Documentation" />
      <meta
        property="og:description"
        content="The open source initiative to create a JSON-based standard for resumes"
      />
      <link rel="icon" href="/favicon.ico" />
    </>
  ),
  primaryHue: 200,
  darkMode: true,
  nextThemes: {
    defaultTheme: 'dark',
  },
};

export default config;
