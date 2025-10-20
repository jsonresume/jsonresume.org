import { Layout, Navbar, Footer } from 'nextra-theme-docs';
import { Banner, Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import 'nextra-theme-docs/style.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageMap = await getPageMap();

  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="JSON Resume Documentation" />
        <meta
          property="og:description"
          content="The open source initiative to create a JSON-based standard for resumes"
        />
      </Head>
      <body>
        <Layout
          navbar={
            <Navbar
              logo={
                <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>
                  JSON Resume
                </span>
              }
              projectLink="https://github.com/jsonresume/jsonresume.org"
            />
          }
          footer={
            <Footer>
              <span>
                MIT {new Date().getFullYear()} ©{' '}
                <a
                  href="https://jsonresume.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  JSON Resume
                </a>
                .
              </span>
            </Footer>
          }
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/jsonresume/jsonresume.org/tree/master/apps/docs"
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
