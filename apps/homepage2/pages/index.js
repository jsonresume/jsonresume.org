import Head from 'next/head';

export default function Homepage() {
  return (
    <div>
      <Head>
        <title>JSON Resume</title>
      </Head>
      <header id="header" class="yellow promo">
        <div class="container">
          <div class="row">
            <div class="col-sm-12">
              <h1>JSON Resume</h1>
              <p>
                The open source initiative to create a JSON-based standard for
                resumes. For developers, by developers.
              </p>
              <a href="/schema/" class="btn btn-red btn-big">
                Read more
              </a>
            </div>
          </div>
        </div>
      </header>
      <div id="start">
        <div class="container">
          <div class="row">
            <div class="feature col-sm-4">
              <h2>What is this?</h2>
              <p>JSON Resume is a standard created to empower developers.</p>
              <a href="/getting-started/" class="btn">
                Get started
              </a>
            </div>
            <div class="feature col-sm-4">
              <h2>Themes</h2>
              <p>Browse our gallery of resume themes made by the community.</p>
              <a href="/themes/" class="btn">
                View themes
              </a>
            </div>
            <div class="feature col-sm-4">
              <h2>Open Source</h2>
              <p>Every part of JSON Resume is open source on GitHub.</p>
              <a
                href="https://github.com/jsonresume"
                target="_blank"
                class="btn"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
