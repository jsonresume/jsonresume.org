export function CLISection() {
  return (
    <div className="col-sm-6">
      <section>
        <h2>Command Line Tool</h2>
        <p>
          We&apos;ve built a CLI (Command Line Interface) which is supported by
          OSX, Linux and Windows. To create your own resume, install
          <code>resume-cli</code> from <b>npm</b>:
        </p>
        <p>
          <code>npm install -g resume-cli</code>
        </p>
        <p>
          <strong>Note:</strong> The official CLI tool isn&apos;t that actively
          maintained. There is an alternative that you might have more success
          with{' '}
          <a href="https://github.com/rbardini/resumed">@rbardini/resumed</a>
        </p>
        <h3>Exporting</h3>
        <p>
          The command line tool uses an ecosystem of modules that we&apos;ve
          open sourced to convert your resume to different formats:
        </p>
        <p>
          <code>resume export resume.pdf</code>
        </p>
        <p>
          <code>resume export resume.html</code>
        </p>
        <h2>Import from LinkedIn</h2>
        <p>
          One of our community members wrote a great Chrome extension to import
          your LinkedIn Profile.
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
          If you want to render a Latex resume there is very well put together
          project called{' '}
          <a target="_blank" href="https://github.com/sinaatalay/rendercv">
            RenderCV
          </a>
          . It has it&apos;s own data format for resumes but we have tools to
          convert your <code>resume.json</code> to their format.
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
          If you use the registry hosting service, you can access your resume in
          the RenderCV format e.g.
          <a href="https://registry.jsonresume.org/thomasdavis.rendercv">
            https://registry.jsonresume.org/thomasdavis.rendercv
          </a>
        </p>
        <h2>Maintaining and Deploying Multiple Versions</h2>
        <p>
          The registry supports multiple resume files via the{' '}
          <code>?gistname=</code> parameter. Store alternate versions (e.g.{' '}
          <code>resume-en.json</code>, <code>resume-fr.json</code>) in your
          GitHub Gist and access them with:
        </p>
        <p>
          <code>
            https://registry.jsonresume.org/yourusername?gistname=resume-fr
          </code>
        </p>
        <p>
          For automated deployments, you can use GitHub Actions to publish
          specific resume versions to the registry on push.
        </p>
      </section>
    </div>
  );
}
