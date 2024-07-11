import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export const metadata = {
  title: 'Theme Development — JSON Resume',
  description: 'Theme Development for JSON Resume',
  image: 'https://jsonresume.org/images/logo.png',
  url: 'https://jsonresume.org/theme-development/',
};

export default function ThemeDevelopment() {
  const codeString = `
  const render = (resume) => {
    return '<h1>' + resume.basics.name + '</h1>'
  }

  export { render }
    `;

  return (
    <>
      <header id="header">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h1>Theme Development</h1>
            </div>
          </div>
        </div>
      </header>
      <div id="themes" className="container">
        <div className="row">
          <div className="col-md-3">
            <p>
              Remember JSON Resume is just a schema. Our method of theming is
              purely recommended if you wish to be compatibable with the
              official tooling and hosting.
            </p>
          </div>
          <div className="col-md-9">
            <h3>Getting started</h3>
            <p>
              The basic philosophy is that you create a new NPM module that
              follows the naming convention of{' '}
              <code>jsonresume-theme-&#123;name&#125;</code>
            </p>
            <p>
              The module should export a function called <code>render</code>{' '}
              that takes a <code>resume.json</code>
            </p>
            <p>
              The <code>render</code> function should return a{' '}
              <code>string</code> which is generally in the format of{' '}
              <code>html</code>
            </p>
            <p>In its most basic form it should look like this</p>
            <SyntaxHighlighter language="javascript" style={solarizedlight}>
              {codeString}
            </SyntaxHighlighter>
            <br />
            <h3>Considerations</h3>
            <p>
              <ul>
                <li>All assets and css has to be inline the output</li>
                <li>Gotta base64 encoding your images and other assets</li>
                <li>
                  The <code>render</code> function should be pure, as in, it
                  should have no side effects. Which means to say it
                  shouldn&apos;t read or write from disk or the network. So do
                  not import <code>fs</code>
                  or <code>http</code>(or any modules that depend on those) into
                  your theme.
                </li>
                <li>
                  Your theme is in control of the build process so do whatever
                  you may there
                </li>
                <li>
                  Feel free to share any opinions on this process in the
                  repoistory
                </li>
              </ul>
            </p>
            <br />

            <h3>Examples</h3>
            <p>
              Here are some good example repositories to see how others have
              built themes
            </p>
            <ul>
              <ol>
                <a href="https://github.com/jsonresume/jsonresume.org/tree/master/themes/stackoverflow">
                  https://github.com/jsonresume/jsonresume.org/tree/master/themes/stackoverflow
                </a>
              </ol>
              <ol>
                <a href="https://github.com/kelyvin/jsonresume-theme-caffeine">
                  https://github.com/kelyvin/jsonresume-theme-caffeine
                </a>
              </ol>
              <ol>
                <a href="https://github.com/davcd/jsonresume-theme-actual">
                  https://github.com/davcd/jsonresume-theme-actual
                </a>
              </ol>
              <ol>
                <a href="https://github.com/jsonresume/jsonresume-theme-boilerplate">
                  https://github.com/jsonresume/jsonresume-theme-boilerplate
                </a>
              </ol>
            </ul>
            <p>
              If there are any official themes you like, find their source and
              see if you can learn from them
            </p>
            <br />
            <p>
              <h3>Publishing / Hosting</h3>
              If you want to add a theme to the official list, you need to
              publish an NPM module named
              <code>jsonresume-theme-&#123;name&#125;</code>. That module needs
              to export a function called `render` that takes a `resume.json`
              and returns a plain HTML string.
            </p>
          </div>
        </div>
        <div className="row"></div>
      </div>
    </>
  );
}
