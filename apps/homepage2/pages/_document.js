import Document, { Html, Head, Main, NextScript } from 'next/document';
import { Analytics } from '@vercel/analytics/react';
import { DocumentHead } from './_document/DocumentHead';
import { DocumentLayout } from './_document/DocumentLayout';
import { DocumentScripts } from './_document/DocumentScripts';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head title="JSON Resume">
          <DocumentHead />
        </Head>
        <body>
          <DocumentLayout>
            <Main />
          </DocumentLayout>

          <NextScript />
          <DocumentScripts />
          <Analytics />
        </body>
      </Html>
    );
  }
}
