import Image from 'next/image';
import Head from 'next/head';

export default function GettingStarted() {
  return (
    <>
      <Head>
        <title>Getting Started — JSON Resume</title>
      </Head>
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
              <h3>Import from LinkedIn</h3>
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
                  https://registry.jsonresume.org/thomasdavis
                </a>
              </p>
              <p>
                All you have to do is create a Gist on GitHub named
                <code>resume.json</code>. <br />
                <br />
                e.g.{' '}
                <a href="https://gist.github.com/thomasdavis/c9dcfa1b37dec07fb2ee7f36d7278105">
                  https://gist.github.com/thomasdavis/c9dcfa1b37dec07fb2ee7f36d7278105
                </a>
              </p>
              <p>
                Our hosting service will automatically detect this when you
                access
                <code>
                  https://registry.jsonresume.org/your_github_username
                </code>
              </p>
              <p>
                To set a theme, just add to your <code>resume.json</code>;<br />
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
                your gist when you push to your own repo. Example below;
                <br />
                <br />
                <strong>EXAMPLE</strong> -{' '}
                <a href="https://github.com/thomasdavis/resume">
                  https://github.com/thomasdavis/resume
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
                  https://registry.jsonresume.org/thomasdavis.json
                </a>
                <br />
                <strong>YAML</strong> -{' '}
                <a href="https://registry.jsonresume.org/thomasdavis.yaml">
                  https://registry.jsonresume.org/thomasdavis.yaml
                </a>
                <br />
                <strong>TEXT</strong> -{' '}
                <a href="https://registry.jsonresume.org/thomasdavis.txt">
                  https://registry.jsonresume.org/thomasdavis.txt
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
                  https://registry.jsonresume.org/thomasdavis.qr
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
