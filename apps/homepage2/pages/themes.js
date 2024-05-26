import Head from 'next/head';
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
  ];

  return (
    <>
      <Head>
        <title>Themes — JSON Resume</title>
      </Head>
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
      </div>
    </>
  );
}
