// import Header from '@jsonresume/ui/Header';
import Head from 'next/head';
import StyledComponentsRegistry from './lib/registry';

/*
@todo
 - make ui components to reuse with homepage

*/

export default function Layout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>JSON Resume Registry</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Open+Sans:400,700,300,600,800&display=swap"
        />
      </Head>
      <body>
        <StyledComponentsRegistry>
          {/* <Header
            left={
              <div>
                <a href="/">JSON Resume Registry</a>
              </div>
            }
            right={
              <div>
                <a href="/logout">About</a>
                <a href="/logout">Logout</a>
              </div>
            }
          /> */}
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
