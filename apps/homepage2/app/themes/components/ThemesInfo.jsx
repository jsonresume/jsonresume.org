export function ThemesInfo() {
  return (
    <div className="row">
      <div className="col-md-6">
        <h3>Browse</h3>

        <p>
          There are over{' '}
          <a href="https://www.npmjs.com/search?ranking=maintenance&q=jsonresume-theme">
            400+ npm packages
          </a>{' '}
          of themes that we pick official themes from. They are all open source
          and built by the community.
        </p>
        <p>
          Not all themes that are available in our hosted offering are listed
          below, you can see a list at{' '}
          <a href="https://registry.jsonresume.org/themes">
            https://registry.jsonresume.org/themes
          </a>
        </p>
        <p>
          Preview them by just editing the query string{' '}
          <a href="https://registry.jsonresume.org/thomasdavis?theme=kendall">
            https://registry.jsonresume.org/thomasdavis?theme=flat
          </a>
        </p>
      </div>
      <div className="col-md-6">
        <h3>Want to develop your own?</h3>
        <p>
          Read the <a href="/theme-development">theme development guide</a>{' '}
        </p>
      </div>
    </div>
  );
}
