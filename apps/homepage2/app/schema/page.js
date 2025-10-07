import Head from 'next/head';
import { SchemaInfo } from './components/SchemaInfo';
import { SchemaDisplay } from './components/SchemaDisplay';

export const metadata = {
  title: 'Schema — JSON Resume',
  description: 'JSON Resume schema',
  image: 'https://jsonresume.org/images/logo.png',
  url: 'https://jsonresume.org/schema/',
};

export default function Schema() {
  return (
    <>
      <Head>
        <title>Schema — JSON Resume</title>
      </Head>
      <header id="header">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h1>Schema</h1>
            </div>
          </div>
        </div>
      </header>

      <div id="schema" className="container">
        <div className="row">
          <SchemaInfo />
          <SchemaDisplay />
        </div>
      </div>
    </>
  );
}
