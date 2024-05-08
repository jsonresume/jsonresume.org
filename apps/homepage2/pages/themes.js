import Image from 'next/image';

export default function GettingStarted() {
  // convert themes above into js array
  const themes = [
    {
      name: 'Elegant',
      slug: 'elegant',
      github: 'mudassir0909',
      author: 'Mudassir',
      link: 'https://github.com/mudassir0909',
    },
    {
      name: 'Kendall',
      slug: 'kendall',
      github: 'LinuxBozo',
      author: 'M. Adam Kendall',
      link: 'https://registry.jsonresume.org/linuxbozo',
    },
    {
      name: 'Macchiato',
      slug: 'macchiato',
      github: 'biosan',
      author: 'Alessandro Biondi',
      link: 'https://registry.jsonresume.org/biosan',
    },
    {
      name: 'Relaxed',
      slug: 'relaxed',
      github: 'ObserverOfTime',
      author: 'ObserverOfTime',
      link: 'https://github.com/ObserverOfTime',
    },
    {
      name: 'Stack Overflow',
      slug: 'stackoverflow',
      github: '',
      author: '',
      link: '',
    },
    {
      name: 'Rickosborne',
      slug: 'rickosborne',
      github: '',
      author: '',
      link: '',
    },
    {
      name: 'Flat',
      slug: 'flat',
      github: 'erming',
      author: 'Mattias Erming',
      link: 'https://github.com/erming',
    },
    {
      name: 'One Page Plus',
      slug: 'onepage-plus',
      github: '',
      author: '',
      link: '',
    },
    {
      name: 'Paper',
      slug: 'paper-plus-plus',
      github: '',
      author: '',
      link: '',
    },
  ];

  return (
    <>
      <header id="header">
        <div class="container">
          <div class="row">
            <div class="col-sm-12">
              <h1>Themes</h1>
            </div>
          </div>
        </div>
      </header>
      <div id="themes" class="container">
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
        <div class="row">
          {themes.map((theme) => {
            return (
              <div class="col-sm-4 col-md-3" key={theme.slug}>
                <div class="theme">
                  <div class="row">
                    <div class="col-sm-12 col-xs-6">
                      {' '}
                      <a
                        href={`https://registry.jsonresume.org/thomasdavis?theme=${theme.slug}`}
                      >
                        <Image
                          style={{ height: '129px' }}
                          height="129"
                          width="163"
                          alt={theme.name}
                          src={`https://screenshot-peach-beta.vercel.app/api?v=1&url=https://registry.jsonresume.org/thomasdavis?theme=${theme.slug}&height=720&width=1280`}
                        />
                      </a>
                    </div>
                    <div class="col-sm-12 col-xs-6 meta">
                      <div class="name">{theme.name}</div>
                      <div class="author">
                        by{' '}
                        <a href={`${theme.link}`} target="_blank">
                          {theme.author}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-12">
                      {' '}
                      <a
                        href={`https://registry.jsonresume.org/thomasdavis?theme=${theme.slug}`}
                        class="btn"
                      >
                        Preview theme
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div class="row">
          <div class="clear: both;"></div>

          <h2>Want to develop your own?</h2>
          <p>
            Check out an example boilerplate theme{' '}
            <a href="https://github.com/jsonresume/jsonresume-theme-boilerplate">
              https://github.com/jsonresume/jsonresume-theme-boilerplate
            </a>
            .
            <br />
            <br />
            Here is an example of a more well done and modern theme{' '}
            <a href="https://github.com/davcd/jsonresume-theme-actual">
              https://github.com/davcd/jsonresume-theme-actual
            </a>
            .
            <br />
            <br />
            For an even better theme development environment, try this{' '}
            <a href="https://github.com/kelyvin/jsonresume-theme-caffeine">
              https://github.com/kelyvin/jsonresume-theme-caffeine
            </a>
            .
            <br />
            <br />
            In short, if you want to add a theme to the official list, you need
            to publish an NPM module named
            <code>jsonresume-theme-&#123;name&#125;</code>. That module needs to
            export a function called `render` that takes a `resume.json` and
            returns a plain HTML string.
          </p>
          <h3>Getting started</h3>
          <p>
            If you are using the registry to host your resume, you can easily
            test different themes by appending a query string e.g.
          </p>
          <a href="https://registry.jsonresume.org/thomasdavis?theme=flat">
            https://registry.jsonresume.org/thomasdavis?theme=flat
          </a>
          <p>
            Or you can set the default theme for your resume on the registry by
            using the <code>--theme</code> option in the CLI tool e.g.
          </p>
          <code>resume publish --theme flat</code>
        </div>
      </div>
    </>
  );
}
