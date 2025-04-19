import Image from 'next/image';

export const metadata = {
  title: 'Getting Started - JSON Resume',
  description: 'Getting started with JSON Resume',
  image: 'https://jsonresume.org/images/logo.png',
  url: 'https://jsonresume.org/getting-started/',
};

export default function GettingStarted() {
  return (
    <>
      <header id="header">
        <div class="container">
          <div class="row">
            <div class="col-sm-12">
              <h1>Getting Started</h1>
            </div>
          </div>
        </div>
      </header>
      <div id="getting-started" class="container">
        <div class="row">
          <div class="col-sm-6">
            <section>
              <h2>Command Line Tool</h2>
              <p>
                We&apos;ve built a CLI (Command Line Interface) which is
                supported by OSX, Linux and Windows. To create your own resume,
                install
                <code>resume-cli</code> from <b>npm</b>:
              </p>
              <p>
                <code>npm install -g resume-cli</code>
              </p>
              <p>
                <strong>Note:</strong> The official CLI tool isn&apos;t that
                actively maintained. There is an alternative that you might have
                more success with{' '}
                <a href="https://github.com/rbardini/resumed">
                  @rbardini/resumed
                </a>
              </p>
              <h3>Exporting</h3>
              <p>
                The command line tool uses an ecosystem of modules that
                we&apos;ve open sourced to convert your resume to different
                formats:
              </p>
              <p>
                <code>resume export resume.pdf</code>
              </p>
              <p>
                <code>resume export resume.html</code>
              </p>
              <h2>Import from LinkedIn</h2>
              <p>
                One of our community members wrote a great Chrome extension to
                import your LinkedIn Profile.
                <br />
                <br />{' '}
                <a
                  target="_blank"
                  href="https://chrome.google.com/webstore/detail/json-resume-exporter/caobgmmcpklomkcckaenhjlokpmfbdec"
                >
                  Download here
                </a>
              </p>
              <h2>Latex</h2>
              <p>
                If you want to render a Latex resume there is very well put
                together project called{' '}
                <a
                  target="_blank"
                  href="https://github.com/sinaatalay/rendercv"
                >
                  RenderCV
                </a>
                . It has it&apos;s own data format for resumes but we have tools
                to convert your <code>resume.json</code> to their format.
              </p>
              <p>
                To convert your resume.json
                <br />
                <br />
                <code>npx @jsonresume/jsonresume-to-rendercv resume.json</code>
                <br />
                <br />
                Then simply
                <br />
                <br />
                <code>rendercv render resume.yaml</code>
                <br />
                <br />
                If you use the registry hosting service, you can access your
                resume in the RenderCV format e.g.
                <a href="https://registry.jsonresume.org/thomasdavis.rendercv">
                  https://registry.jsonresume.org/thomasdavis.rendercv
                </a>
              </p>
              <h2>Maintaining and Deploying Multiple Versions of Resumes</h2> 
              <p>
                This section describes a manual workflow for maintaining and deploying multiple resume versions by language and position. You can export and publish a "current" resume JSON to the registry using any compatible theme.
              </p>
              <p>
                In this <a target="_blank" rel="noopener noreferrer" href="https://github.com/HarrySolsem/JsonResume.git">repo</a>, you will find my approach:
              </p>
              <ol>
                <li>Store multiple resume JSON files in a dedicated folder.</li>
                <li>Use a root-level <code>resume-config</code> file to select which resume to deploy.</li>
                <li>Commit and push; a pre-push Git hook replaces <code>resume.json</code> with the chosen version.</li>
                <li>GitHub Actions then deploy the selected resume to the registry.</li>
              </ol>
              <p>
                This workflow is working well for me and can be easily extended. Feel free to clone the repo and submit pull requests with improvements.
              </p>            
            </section>
          </div>
          <div class="col-sm-6">
            <section>
              <h2>Hosting</h2>
              <p>
                JSON Resume offers a hosting service that renders your
                <code>resume.json</code> to any theme you would like. <br />
                <br />
                e.g.{' '}
                <a href="https://registry.jsonresume.org/thomasdavis">
                  registry.jsonresume.org/thomasdavis
                </a>
              </p>
              <p>
                All you have to do is create a Gist on GitHub named
                <code>resume.json</code>. <br /> <br />
                <strong>Alternatively</strong>, you can use the Editor at{' '}
                <a href="https://registry.jsonresume.org">
                  registry.jsonresume.org
                </a>{' '}
                <br /> <br />
                e.g.{' '}
                <a href="https://gist.github.com/thomasdavis/c9dcfa1b37dec07fb2ee7f36d7278105">
                  gist.github.com/thomasdavis/c9dcfa1b37dec07fb2ee7f36d7278105
                </a>
              </p>
              <p>
                Our hosting service will automatically detect this when you
                access
                <code>registry.jsonresume.org/your_github_username</code>
              </p>
              <p>
                To set a theme, just add to your <code>resume.json</code>
                <br />
                <code>
                  &#123; &quot;meta&quot;: &#123; &quot;theme&quot;:
                  &quot;elegant&quot; &#125; &#125;
                </code>
              </p>
              <hr />
              <p>
                <strong>Use your own repository (instead of a gist)</strong>
                <br />
                <br />
                Basically, you can just make a Github Action, that publishes
                your gist when you push to your own repo. Example below
                <br />
                <br />
                <strong>EXAMPLE</strong> -{' '}
                <a href="https://github.com/thomasdavis/resume">
                  github.com/thomasdavis/resume
                </a>
              </p>
              <hr />
              <p>
                <strong>Raw Formats</strong>
                <br />
                <br />
                You can access more raw formats of your resume too!
                <br />
                <br />
                <strong>JSON</strong> -{' '}
                <a href="https://registry.jsonresume.org/thomasdavis.json">
                  registry.jsonresume.org/thomasdavis.json
                </a>
                <br />
                <strong>YAML</strong> -{' '}
                <a href="https://registry.jsonresume.org/thomasdavis.yaml">
                  registry.jsonresume.org/thomasdavis.yaml
                </a>
                <br />
                <strong>TEXT</strong> -{' '}
                <a href="https://registry.jsonresume.org/thomasdavis.txt">
                  registry.jsonresume.org/thomasdavis.txt
                </a>
              </p>
              <hr />
              <p>
                <strong>QR Service</strong>
                <br />
                <br />
                If you want to generate a QR code that links to your hosted
                resume, use{' '}
                <a href="https://registry.jsonresume.org/thomasdavis.qr">
                  registry.jsonresume.org/thomasdavis.qr
                </a>
                <br />
                e.g. <br />
                <Image
                  src="https://registry.jsonresume.org/thomasdavis.qr"
                  width="120"
                  height="120"
                  alt="Thomas Davis"
                />
              </p>
              <br />
              <iframe
                width="560"
                height="315"
                src="https://www.youtube-nocookie.com/embed/BxpHgNM0clE"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
