import Document, { Html, Head, Main, NextScript } from 'next/document';
import { Analytics } from '@vercel/analytics/react';
import Image from 'next/image';
import Link from 'next/link';
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head title="JSON Resume">
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />

          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
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
            href="https://fonts.googleapis.com/css?family=Ubuntu:400,500,700&display=optional"
            defer
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Lato:300,500,700&display=optional"
            defer
          />
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
        </Head>
        <body>
          <div id="main">
            <div id="viewport">
              <aside id="sidebar">
                <Link href="/">Home</Link>
                <Link href="/getting-started/">Getting Started</Link>
                <Link href="/schema/">Schema</Link>
                <Link href="/themes/">Themes</Link>
                <Link href="/projects/">Projects</Link>
                <Link href="/ai/">AI</Link>
                <Link href="/team/">Team</Link>
                <Link href="/blog/">Blog</Link>
              </aside>
              <div className="inner">
                <nav id="nav">
                  <a href="#" className="lt">
                    <Image
                      width="18"
                      height="14"
                      src="/img/hamburger.png"
                      alt="homepage navigation"
                    />
                  </a>
                  <div className="container">
                    <div className="row">
                      <div className="col-sm-12">
                        <Link href="/">JSON Resume</Link>
                        <div className="float-right hidden-xs">
                          <Link href="/getting-started/">Getting Started</Link>
                          <Link href="/schema/">Schema</Link>
                          <Link href="/themes/">Themes</Link>
                          <Link href="/projects/">Projects</Link>
                          <Link href="/team/">Team</Link>

                          <Link
                            href="https://registry.jsonresume.org/explore"
                            target="_blank"
                          >
                            Hosting
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>
                <Main />

                <footer id="footer" className="container">
                  <div className="row">
                    <div className="col-sm-12">
                      <p>JSON Resume is open source</p>
                      <p>
                        <Link href="https://github.com/jsonresume">
                          View on GitHub
                        </Link>
                      </p>
                      <p>
                        <Link href="/ai/">AI</Link>&nbsp;|&nbsp;
                        <Link href="/blog/">Blog</Link>&nbsp;|
                      </p>
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          </div>

          <NextScript />
          <script
            src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"
            integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ="
            crossorigin="anonymous"
            defer
          ></script>
          <script
            src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min.js"
            integrity="sha256-dsOXGNHAo/syFnazt+KTBsCQeRmlcW1XKL0bCK4Baec="
            crossorigin="anonymous"
            defer
          ></script>
          <script
            src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.2/lodash.min.js"
            integrity="sha256-rKk2QnJsnOCsuS8oSzkedgInNJbYmA09J0w26nVBpss="
            crossorigin="anonymous"
            defer
          ></script>
          <script
            src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"
            integrity="sha256-U5ZEeKfGNOja007MMD3YBI0A3OSZOQbeG6z2f2Y0hu8="
            crossorigin="anonymous"
            defer
          ></script>

          <script src="/js/main.js" defer></script>
          <Analytics />
        </body>
      </Html>
    );
  }
}
