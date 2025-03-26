import Image from 'next/image';

export const metadata = {
  title: 'Themes — JSON Resume',
  description: 'Themes for JSON Resume',
  image: 'https://jsonresume.org/images/logo.png',
  url: 'https://jsonresume.org/themes/',
};

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
      name: 'Professional',
      slug: 'professional',
      github: 'thomasdavis',
      author: 'Thomas Davis',
      link: 'https://registry.jsonresume.org/thomasdavis',
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
      github: 'phoinixi',
      author: 'Francesco Esposito',
      link: 'https://github.com/phoinixi',
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
        <div class="row">
          <div class="col-md-6">
            <h3>Browse</h3>

            <p>
              There are over{' '}
              <a href="https://www.npmjs.com/search?ranking=maintenance&q=jsonresume-theme">
                400+ npm packages
              </a>{' '}
              of themes that we pick official themes from. They are all open
              source and built by the community.
            </p>
            <p>
              Not all themes that are available in our hosted offering are
              listed below, you can see a list at{' '}
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
          <div class="col-md-6">
            <h3>Want to develop your own?</h3>
            <p>
              Read the <a href="/theme-development">theme development guide</a>{' '}
            </p>
          </div>
        </div>
        <br />
        <div class="row">
          {themes.map((theme) => {
            // src={`https://screenshot-peach-beta.vercel.app/api?v=1&url=https://registry.jsonresume.org/thomasdavis?theme=${theme.slug}&height=720&width=1280`}

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
                          style={{ height: '100px' }}
                          height="129"
                          width="163"
                          alt={theme.name}
                          src={`/img/themes/${theme.slug}.png`}
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
      </div>
    </>
  );
}
