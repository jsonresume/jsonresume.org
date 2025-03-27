'use server';

export default async function Page() {
  return (
    <div>
      <header id="header" className="yellow promo">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h1>JSON Resume</h1>
              <p>
                The open-source initiative to create a JSON-based standard for
                resumes. For developers, by developers.
              </p>
              <a href="/schema/" className="btn btn-red btn-big">
                Read more
              </a>
            </div>
          </div>
        </div>
      </header>
      <div id="start">
        <div className="container">
          <div className="row">
            <div className="feature col-sm-4">
              <h2>What is this?</h2>
              <p>JSON Resume is a standard created to empower developers.</p>
              <a href="/getting-started/" className="btn">
                Get started
              </a>
            </div>
            <div className="feature col-sm-4">
              <h2>Themes</h2>
              <p>Browse our gallery of resume themes made by the community.</p>
              <a href="/themes/" className="btn">
                View themes
              </a>
            </div>
            <div className="feature col-sm-4">
              <h2>Open Source</h2>
              <p>Every part of JSON Resume is open source on GitHub.</p>
              <a
                href="https://github.com/jsonresume"
                target="_blank"
                className="btn"
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
