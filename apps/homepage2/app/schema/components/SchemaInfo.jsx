export function SchemaInfo() {
  return (
    <div className="col-md-5">
      <h4>What is it?</h4>
      <p>
        JSON Resume is a community driven open-source initiative to create
        JSON-based standard for resumes.
      </p>
      <h4>Why JSON?</h4>
      <p>
        We believe that the strengths of the JSON format makes it a good fit for
        resumes. It&apos;s lightweight, easy to use and it&apos;s perfect to
        build tools for!
      </p>
      <p>
        We also feel that the <a href="https://json-schema.org/">JSON Schema</a>
        &nbsp;is mature enough for writing usable semantics.
      </p>
      <h4>Open Source</h4>
      <p>
        The schema is{' '}
        <a href="https://github.com/jsonresume/resume-schema">open source</a>{' '}
        and community-driven. We release everything we do under the MIT license.
      </p>
      <hr />
      <p>
        We are also working on a{' '}
        <a href="/job-description-schema">Job Description schema</a>
      </p>
    </div>
  );
}
