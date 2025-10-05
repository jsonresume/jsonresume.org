import Image from 'next/image';

export function HostingSection() {
  return (
    <div className="col-sm-6">
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
          <a href="https://registry.jsonresume.org">registry.jsonresume.org</a>{' '}
          <br /> <br />
          e.g.{' '}
          <a href="https://gist.github.com/thomasdavis/c9dcfa1b37dec07fb2ee7f36d7278105">
            gist.github.com/thomasdavis/c9dcfa1b37dec07fb2ee7f36d7278105
          </a>
        </p>
        <p>
          Our hosting service will automatically detect this when you access
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
          Basically, you can just make a Github Action, that publishes your gist
          when you push to your own repo. Example below
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
          If you want to generate a QR code that links to your hosted resume,
          use{' '}
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
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </section>
    </div>
  );
}
