// pages/_document.tsx file
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />

          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
          <link rel="dns-prefetch" href="//static.getclicky.com" />

          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="description" content="{{site.description}}" />

          <title>asdasd</title>

          <link rel="shortcut icon" href="/favicon.png" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Ubuntu:400,500,700"
            defer
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Lato:300,500,700"
            defer
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css"
            integrity="sha256-AIodEDkC8V/bHBkfyxzolUMw57jeQ9CauwhVW6YJ9CA="
            crossorigin="anonymous"
            defer
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css"
            integrity="sha256-916EbMg70RQy9LHiGkXzG8hSg9EdNy97GazNG/aiY1w="
            crossorigin="anonymous"
            defer
          />

          <script
            src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"
            integrity="sha256-3Jy/GbSLrg0o9y5Z5n1uw0qxZECH7C6OQpVBgNFYa0g="
            crossorigin="anonymous"
            defer
          ></script>
          <script
            src="https://cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js"
            integrity="sha256-g6iAfvZp+nDQ2TdTR/VVKJf3bGro4ub5fvWSWVRi2NE="
            crossorigin="anonymous"
            defer
          ></script>
        </Head>
        <body>
          <div id="main">
            <div id="viewport">
              <aside id="sidebar">
                <a href="/">Home</a>
                <a href="/getting-started/">Getting Started</a>
                <a href="/schema/">Schema</a>
                <a href="/themes/">Themes</a>
                <a href="/projects/">Projects</a>
                <a href="/team/">Team</a>
                <a href="/blog/">Blog</a>
              </aside>
              <div class="inner">
                <nav id="nav">
                  <a href="#" class="lt">
                    <img src="/img/hamburger.png" />
                  </a>
                  <div class="container">
                    <div class="row">
                      <div class="col-sm-12">
                        <a href="/">JSON Resume</a>
                        <div class="float-right hidden-xs">
                          <a href="/getting-started/">Getting Started</a>
                          <a href="/schema/">Schema</a>
                          <a href="/themes/">Themes</a>
                          <a href="/projects/">Projects</a>
                          <a href="/team/">Team</a>
                          <a href="/blog/">Blog</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>
                <Main />

                <footer id="footer" class="container">
                  <div class="row">
                    <div class="col-sm-12">
                      <p>JSON Resume is open source</p>
                      <p>
                        <a href="//github.com/jsonresume">View on GitHub</a>
                      </p>
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          </div>

          <NextScript />
        </body>
      </Html>
    );
  }
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />), //gets the styles from all the components inside <App>
        });
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
}
