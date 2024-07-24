export const metadata = {
  title: 'Job Description Schema — JSON Resume',
  description: 'Job Description Schema',
  image: 'https://jsonresume.org/images/logo.png',
  url: 'https://jsonresume.org/job-description-schema/',
};

export default function Schema() {
  return (
    <>
      <header id="header">
        <div class="container">
          <div class="row">
            <div class="col-sm-12">
              <h1>Job Description Schema</h1>
            </div>
          </div>
        </div>
      </header>

      <div id="schema" class="container">
        <div class="row">
          <div class="col-md-5">
            <h4>What is it?</h4>
            <p>
              The JSONJob schema is a standardized format designed to simplify
              and streamline job descriptions. It ensures that job postings are
              clear, consistent, and easy to read, no matter where they&apos;re
              published. By using JSONJob, employers can create structured job
              listings that help candidates quickly understand the role and its
              requirements.{' '}
            </p>
            <p>
              This improves the job search experience and makes the hiring
              process more efficient, benefiting both employers and job seekers.
              Ideal for developers looking for a professional and effective way
              to manage job descriptions.
            </p>{' '}
            <h4>Open Source</h4>
            <p>
              The schema is{' '}
              <a href="https://github.com/jsonresume/resume-schema/blob/master/job-schema.json">
                open source
              </a>{' '}
              and community-driven. We release everything we do under the MIT
              license.
            </p>
            <h4>LLM&apos;s</h4>
            <p>
              Working with LLM&apos;s is also much easier, as you can ask them
              to turn your resumes or job descriptions into formatted data as
              they have trained on these schemas.
            </p>
          </div>
          <div class="col-sm-9 col-md-7">
            <div class="header">
              <div class="pull-right version">version 1.0.0</div>
              job.json
            </div>
            <pre
              class="schema"
              dangerouslySetInnerHTML={{
                __html: `{
  "title": <span>"Web Developer"</span>,
  "company": <span>"Microsoft"</span>,
  "type": <span>"Full-time"</span>,
  "date": <span>"2024-07"</span>,
  "description": <span>"We are looking for a skilled Web Developer to join our team. The role involves building and maintaining web applications."</span>,
  "location": {
    "address": <span>"1234 Glücklichkeit Straße\\nHinterhaus 5. Etage li."</span>,
    "postalCode": <span>"10115"</span>,
    "city": <span>"Berlin"</span>,
    "countryCode": <span>"DE"</span>,
    "region": <span>"Berlin"</span>
  },
  "remote": <span>"Hybrid"</span>,
  "salary": <span>"100000"</span>,
  "experience": <span>"Mid-level"</span>,
  "responsibilities": [
    <span>"Develop and maintain web applications"</span>,
    <span>"Collaborate with cross-functional teams"</span>,
    <span>"Ensure the technical feasibility of UI/UX designs"</span>,
    <span>"Optimize applications for maximum speed and scalability"</span>
  ],
  "qualifications": [
    <span>"Bachelor's degree in Computer Science or related field"</span>,
    <span>"3+ years of experience in web development"</span>,
    <span>"Strong understanding of JavaScript, HTML, and CSS"</span>
  ],
  "skills": [
    {
      "name": <span>"Web Development"</span>,
      "level": <span>"Master"</span>,
      "keywords": [
        <span>"HTML"</span>,
        <span>"CSS"</span>,
        <span>"JavaScript"</span>,
        <span>"React"</span>,
        <span>"Node.js"</span>
      ]
    },
    {
      "name": <span>"Database Management"</span>,
      "level": <span>"Intermediate"</span>,
      "keywords": [
        <span>"SQL"</span>,
        <span>"NoSQL"</span>,
        <span>"MongoDB"</span>
      ]
    }
  ],
}
`,
              }}
            ></pre>
          </div>
        </div>
      </div>
    </>
  );
}
