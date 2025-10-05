import { Analytics } from '@vercel/analytics/react';
import Image from 'next/image';
import { fontVariables } from './components/layout/fonts';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { Footer } from './components/layout/Footer';
import { ExternalScripts } from './components/layout/ExternalScripts';
import './global.css';

export default async function Layout({ children }) {
  return (
    <html lang="en" className={fontVariables}>
      <head title="JSON Resume">
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="//static.getclicky.com" />
        {(process.env.NODE_ENV === 'development' ||
          process.env.VERCEL_ENV === 'preview') && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script
            data-project-id="3T7wRdtjOmyutEJb4CkBwQmBQqnzIsTTBh1ypGGP"
            data-is-production-environment="false"
            src="https://snippet.meticulous.ai/v1/meticulous.js"
          />
        )}
        <noscript>
          <p>
            <Image
              alt="Clicky"
              width="1"
              height="1"
              src="https://in.getclicky.com/101412017ns.gif"
            />
          </p>
        </noscript>
        <script
          async
          data-id="101412017"
          src="https://static.getclicky.com/js"
        ></script>

        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content="{{site.description}}" />
        <link rel="shortcut icon" href="/img/favicon.png" />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css"
          integrity="sha256-AIodEDkC8V/bHBkfyxzolUMw57jeQ9CauwhVW6YJ9CA="
          crossOrigin="anonymous"
          defer
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css"
          integrity="sha256-916EbMg70RQy9LHiGkXzG8hSg9EdNy97GazNG/aiY1w="
          crossOrigin="anonymous"
          defer
        />

        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"
          integrity="sha256-3Jy/GbSLrg0o9y5Z5n1uw0qxZECH7C6OQpVBgNFYa0g="
          crossOrigin="anonymous"
          defer
        ></script>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js"
          integrity="sha256-g6iAfvZp+nDQ2TdTR/VVKJf3bGro4ub5fvWSWVRi2NE="
          crossOrigin="anonymous"
          defer
        ></script>
      </head>
      <body>
        <div id="main">
          <div id="viewport">
            <Sidebar />
            <div className="inner">
              <TopNav />
              {children}
              <Footer />
            </div>
          </div>
        </div>

        <ExternalScripts />
        <Analytics />
      </body>
    </html>
  );
}
