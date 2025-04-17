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
              <h2>Maintaining and deploying multiple versions of resume</h2>
                <p>
                    This paragraph will briefly describe how I have created a somewhat manual process on my particular usecase. My usecase is that I need the possibility to maintain and deploy multiple version, based on language and for a particular position I am applying for, to the registry. Then I am able to export and create pdfs of my "current" resume, now in the registry, using any suitable existing theme.
                    <br />
                    <br />
                    In this <a target="_blank" href="https://github.com/HarrySolsem/JsonResume.git"> repo</a> you will find that this is my attack vector:
                </p>
                <p>
                    <ol>
                        <li>I keep multiple versions of my resumes in a resume folder.</li>
                        <li>In the root of my folder I have a file named resume-config. When I would like to deploy a particular version of my resume, for instance my English version of project manager resume, I replace the content of resume-config and adds the name of the file to deploy.</li>
                        <li>Now I do a commit and push. What then happens is that the Git concept of hooks steps into action. I am using a pre-push hook that will replace the content of my resume.json with the content of my project manager json, and then push it. NB! Pay attention to the part of the readme.md mentioning the need to configure the location of the hooks folder.</li>
                        <li>After this my actions in the repo will do it's thing and deploy (via my gist) to the registry.</li>
                    </ol>    
                    <br />
                    <br />
                    This is currently working for me, but this can for sure be extended and improved. Whatever your need would be, as long as you are able to put it into the pre-push hook, maybe it can be done. 
                    Already people are looking for ways to remove certain sections of their resume, and I am quite sure that this can be done with some json modification tricks. Please have a look at my repo, clone and send pr on any changes you would like to suggest.
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
