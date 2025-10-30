/* eslint-disable */
import { jobDescriptionJsonSchema, JOB_DESCRIPTION_SCHEMA_VERSION, sampleJobDescription } from '@jsonresume/job-schema';

export const metadata = {
  title: 'Job Description Schema — JSON Resume',
  description: 'Explore the JSON Resume job description schema and helpers.',
  image: 'https://jsonresume.org/images/logo.png',
  url: 'https://jsonresume.org/job-description-schema/',
};

const schemaJson = JSON.stringify(jobDescriptionJsonSchema, null, 2);
const sampleJson = JSON.stringify(sampleJobDescription, null, 2);

export default function Schema() {
  return (
    <>
      <header id="header">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h1>Job Description Schema</h1>
            </div>
          </div>
        </div>
      </header>

      <div id="schema" className="container">
        <div className="row">
          <div className="col-md-5">
            <h4>What is it?</h4>
            <p>
              The JSON Resume Job Description schema provides a standardized
              structure for describing roles, responsibilities, and
              requirements. It keeps job postings clear, consistent, and easy to
              transform into other formats.
            </p>
            <p>
              Structured jobs improve candidate experience, power richer search,
              and give LLM-powered tooling a reliable contract to work with.
            </p>

            <h4>Open Source</h4>
            <p>
              The schema is{' '}
              <a href="https://github.com/jsonresume/jsonresume.org/tree/master/packages/job-schema">
                open source
              </a>{' '}
              and community-driven. Everything ships under the MIT license.
            </p>

            <h4>Version</h4>
            <p>
              Current schema version: <strong>{JOB_DESCRIPTION_SCHEMA_VERSION}</strong>
            </p>
          </div>
          <div className="col-sm-9 col-md-7">
            <section className="schema-section">
              <div className="header">
                <div className="pull-right version">
                  schema.json · v{JOB_DESCRIPTION_SCHEMA_VERSION}
                </div>
                JSON Schema
              </div>
              <pre className="schema">{schemaJson}</pre>
            </section>

            <section className="schema-section">
              <div className="header">
                <div className="pull-right version">example.json</div>
                Example payload
              </div>
              <pre className="schema">{sampleJson}</pre>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
