import { Resume } from './Resume';
import { renderToString } from 'react-dom/server';
import type { Resume as ResumeType } from './types';
import { I18nextProvider } from 'react-i18next';
import { createI18N, Language } from './i18n';
import styles from '!!raw-loader!../style.css';
const createRender = (language: Language) => (resume: ResumeType) =>
  `<!doctype html>${renderToString(
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{resume.basics?.name || 'Resume'}</title>
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
          integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm"
          crossOrigin="anonymous"
        />
        <style>{styles}</style>
      </head>
      <body>
        <div id="root">
          <I18nextProvider i18n={createI18N(language)}>
            <Resume {...resume} />
          </I18nextProvider>
        </div>
      </body>
    </html>
  )}`;

const marginValue = '0.8 cm';
const pdfRenderOptions = {
  margin: {
    top: marginValue,
    bottom: marginValue,
    left: marginValue,
    right: marginValue,
  },
};

export const createTheme = (language: Language = 'en') => ({
  pdfRenderOptions,
  render: createRender(language),
});
