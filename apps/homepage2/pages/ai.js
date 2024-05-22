import Head from 'next/head';

export default function GettingStarted() {
  return (
    <>
      <Head>
        <title>AI — JSON Resume</title>
      </Head>
      <header id="header">
        <div class="container">
          <div class="row">
            <div class="col-sm-12">
              <h1>AI</h1>
            </div>
          </div>
        </div>
      </header>
      <div id="getting-started" class="container">
        <div class="row">
          <div class="col-sm-6">
            <section>
              <h2>What is this?</h2>
              <p>
                These are a bunch of AI related tools for building your resume.
                They are all fully open source but the hosted version uses a
                central API account which will be subject to usage limits.
              </p>
              <p>
                Currently they are only accessible via the registry which
                requires using the Gist hosting as explained on the{' '}
                <a href="/getting-started">getting started</a> page
              </p>
            </section>
          </div>
          <div class="col-sm-6">
            <section>
              <h2>Tooling</h2>
              <p>
                These urls are integrated with OpenAI ChatGPT, and will pass
                your resume to them with a predefined prompt to get a new
                response generated each time.
                <br />
                <br />
                <strong>Recommended Jobs </strong>(tries to match your resume to
                recent Who is Hiring? hn posts) -{' '}
                <a href="https://registry.jsonresume.org/thomasdavis/jobs">
                  https://registry.jsonresume.org/thomasdavis/jobs
                </a>
                <br />
                <br />
                <strong>Cover Letter </strong>(attempts to write a cover letter
                that matches your resume) -{' '}
                <a href="https://registry.jsonresume.org/thomasdavis/letter">
                  https://registry.jsonresume.org/thomasdavis/letter
                </a>
                <br />
                <br />
                <strong>Resume Suggestions</strong> (it asks ChatGPT to give
                precise feedback for improvements you could make to your resume)
                -{' '}
                <a href="https://registry.jsonresume.org/thomasdavis/suggestions">
                  https://registry.jsonresume.org/thomasdavis/suggestions
                </a>
                <br />
                <br />
                <strong>Interview Yourself</strong> <br />
                (using OpenAI GPT-3 your resume.json gets inserted in the prompt
                and you can talk to or at yourself) -{' '}
                <a href="https://registry.jsonresume.org/thomasdavis/interview">
                  https://registry.jsonresume.org/thomasdavis/interview
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
