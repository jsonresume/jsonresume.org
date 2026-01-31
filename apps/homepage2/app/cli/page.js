import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export const metadata = {
  title: 'CLI Tools — JSON Resume',
  description:
    'Command-line tools for rendering JSON Resume to HTML, PDF, and more',
  image: 'https://jsonresume.org/images/logo.png',
  url: 'https://jsonresume.org/cli/',
};

function CodeBlock({ children, language = 'bash' }) {
  return (
    <SyntaxHighlighter
      language={language}
      style={solarizedlight}
      customStyle={{ borderRadius: '4px', fontSize: '14px' }}
    >
      {children.trim()}
    </SyntaxHighlighter>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function CLIPage() {
  return (
    <>
      <header id="header">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h1>CLI Tools</h1>
              <p className="lead">
                Render your JSON Resume to HTML, PDF, and more from the command
                line
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <nav
              style={{
                position: 'sticky',
                top: '20px',
                padding: '1rem',
                background: '#f8f9fa',
                borderRadius: '4px',
              }}
            >
              <strong>On this page</strong>
              <ul style={{ listStyle: 'none', padding: '0.5rem 0', margin: 0 }}>
                <li>
                  <a href="#resumed">resumed CLI</a>
                </li>
                <li>
                  <a href="#installation">Installation</a>
                </li>
                <li>
                  <a href="#basic-usage">Basic Usage</a>
                </li>
                <li>
                  <a href="#themes">Using Themes</a>
                </li>
                <li>
                  <a href="#official-themes">Official Themes</a>
                </li>
                <li>
                  <a href="#pdf-export">PDF Export</a>
                </li>
                <li>
                  <a href="#validation">Validation</a>
                </li>
                <li>
                  <a href="#programmatic">Programmatic API</a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="col-md-9">
            <Section title="Overview">
              <p>
                JSON Resume can be rendered to HTML using command-line tools.
                The recommended CLI is{' '}
                <a
                  href="https://github.com/rbardini/resumed"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <strong>resumed</strong>
                </a>
                , a lightweight, fully-tested Node.js tool that renders your
                resume using any compatible theme.
              </p>
              <p>
                All official JSON Resume themes are compatible with{' '}
                <code>resumed</code> and can be used to generate beautiful HTML
                resumes from your <code>resume.json</code> file.
              </p>
            </Section>

            <Section title="Installation">
              <div id="installation"></div>
              <p>
                Install <code>resumed</code> globally using npm:
              </p>
              <CodeBlock>npm install -g resumed</CodeBlock>
              <p>Or use it directly with npx (no installation required):</p>
              <CodeBlock>npx resumed --help</CodeBlock>
            </Section>

            <Section title="Basic Usage">
              <div id="basic-usage"></div>
              <p>
                The basic command to render a resume requires a{' '}
                <code>resume.json</code> file and a theme:
              </p>
              <CodeBlock>
                {`# Render to HTML (outputs to stdout)
resumed render resume.json --theme jsonresume-theme-even

# Save to a file
resumed render resume.json --theme jsonresume-theme-even > resume.html

# Or use the --output flag
resumed render resume.json --theme jsonresume-theme-even --output resume.html`}
              </CodeBlock>
            </Section>

            <Section title="Using Themes">
              <div id="themes"></div>
              <p>
                Themes are npm packages that transform your JSON Resume into
                HTML. To use a theme, first install it:
              </p>
              <CodeBlock>
                {`# Install a theme
npm install jsonresume-theme-even

# Then render with it
resumed render resume.json --theme jsonresume-theme-even`}
              </CodeBlock>

              <h4>Theme Naming Convention</h4>
              <p>
                All JSON Resume themes follow the naming pattern{' '}
                <code>jsonresume-theme-&#123;name&#125;</code>. When specifying
                a theme, you can use either the full package name or just the
                theme name:
              </p>
              <CodeBlock>
                {`# These are equivalent
resumed render resume.json --theme jsonresume-theme-even
resumed render resume.json --theme even`}
              </CodeBlock>

              <h4>Using Local Themes</h4>
              <p>
                You can also use themes from a local directory, which is useful
                during theme development:
              </p>
              <CodeBlock>
                {`# Use a local theme
resumed render resume.json --theme ./path/to/my-theme

# For themes with a build step, use the dist directory
resumed render resume.json --theme ./my-theme/dist`}
              </CodeBlock>
            </Section>

            <Section title="Official Themes">
              <div id="official-themes"></div>
              <p>
                JSON Resume provides many official themes that are tested and
                maintained. Here are some popular ones:
              </p>

              <h4>Scoped Themes (@jsonresume)</h4>
              <p>
                These themes are published under the <code>@jsonresume</code>{' '}
                scope on npm:
              </p>
              <CodeBlock>
                {`# Install scoped themes
npm install @jsonresume/jsonresume-theme-professional
npm install @jsonresume/jsonresume-theme-creative-studio
npm install @jsonresume/jsonresume-theme-consultant-polished
npm install @jsonresume/jsonresume-theme-tokyo-modernist

# Use them
resumed render resume.json --theme @jsonresume/jsonresume-theme-professional`}
              </CodeBlock>

              <h4>Community Themes</h4>
              <p>
                Many community-maintained themes are available on npm. Search
                for{' '}
                <a
                  href="https://www.npmjs.com/search?q=jsonresume-theme"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  jsonresume-theme on npm
                </a>{' '}
                to discover more:
              </p>
              <CodeBlock>
                {`# Popular community themes
npm install jsonresume-theme-even
npm install jsonresume-theme-elegant
npm install jsonresume-theme-kendall
npm install jsonresume-theme-stackoverflow
npm install jsonresume-theme-macchiato`}
              </CodeBlock>

              <h4>Preview Themes Online</h4>
              <p>
                You can preview how your resume looks with different themes on
                the{' '}
                <a href="https://registry.jsonresume.org" target="_blank">
                  JSON Resume Registry
                </a>
                . Just host your resume and append{' '}
                <code>?theme=&#123;name&#125;</code> to the URL.
              </p>
            </Section>

            <Section title="PDF Export">
              <div id="pdf-export"></div>
              <p>
                To generate a PDF, you can use browser-based tools or Puppeteer.
                The <code>resumed</code> CLI supports PDF generation with
                Puppeteer:
              </p>
              <CodeBlock>
                {`# Install Puppeteer (required for PDF)
npm install puppeteer

# Generate PDF
resumed render resume.json --theme jsonresume-theme-even --type pdf --output resume.pdf`}
              </CodeBlock>
              <p>
                Alternatively, you can render to HTML and use any HTML-to-PDF
                tool:
              </p>
              <CodeBlock>
                {`# Using wkhtmltopdf
resumed render resume.json --theme jsonresume-theme-even | wkhtmltopdf - resume.pdf

# Using Chrome headless
resumed render resume.json --theme jsonresume-theme-even > resume.html
google-chrome --headless --print-to-pdf=resume.pdf resume.html`}
              </CodeBlock>
            </Section>

            <Section title="Validation">
              <div id="validation"></div>
              <p>
                Before rendering, you can validate your <code>resume.json</code>{' '}
                against the official JSON Resume schema:
              </p>
              <CodeBlock>
                {`# Validate your resume
resumed validate resume.json

# The command exits with code 0 if valid, non-zero otherwise
resumed validate resume.json && echo "Valid!" || echo "Invalid!"`}
              </CodeBlock>
            </Section>

            <Section title="Programmatic API">
              <div id="programmatic"></div>
              <p>
                You can also use <code>resumed</code> programmatically in your
                Node.js applications:
              </p>
              <CodeBlock language="javascript">
                {`import { render } from 'resumed';
import * as theme from 'jsonresume-theme-even';
import { readFileSync } from 'fs';

// Load your resume
const resume = JSON.parse(readFileSync('resume.json', 'utf-8'));

// Render to HTML
const html = await render(resume, theme);

console.log(html);`}
              </CodeBlock>

              <h4>Using Themes Directly</h4>
              <p>
                Each theme exports a <code>render</code> function that you can
                call directly:
              </p>
              <CodeBlock language="javascript">
                {`import { render } from 'jsonresume-theme-even';
import { readFileSync } from 'fs';

const resume = JSON.parse(readFileSync('resume.json', 'utf-8'));
const html = render(resume);

// Write to file
import { writeFileSync } from 'fs';
writeFileSync('resume.html', html);`}
              </CodeBlock>
            </Section>

            <Section title="Creating Your Own Theme">
              <p>
                Want to create a custom theme? Check out our{' '}
                <a href="/theme-development/">Theme Development Guide</a> to
                learn how to build themes that work with <code>resumed</code>{' '}
                and the JSON Resume ecosystem.
              </p>
              <p>The basic requirements for a theme are:</p>
              <ul>
                <li>
                  Export a <code>render(resume)</code> function that returns
                  HTML
                </li>
                <li>
                  Name your package{' '}
                  <code>jsonresume-theme-&#123;name&#125;</code>
                </li>
                <li>Publish to npm for others to use</li>
              </ul>
              <CodeBlock language="javascript">
                {`// Minimal theme example
export function render(resume) {
  return \`
    <!DOCTYPE html>
    <html>
      <head>
        <title>\${resume.basics?.name || 'Resume'}</title>
      </head>
      <body>
        <h1>\${resume.basics?.name}</h1>
        <p>\${resume.basics?.label}</p>
        <!-- Add more sections... -->
      </body>
    </html>
  \`;
}`}
              </CodeBlock>
            </Section>

            <Section title="Troubleshooting">
              <h4>Theme Not Found</h4>
              <p>
                Make sure the theme is installed in your project or globally:
              </p>
              <CodeBlock>
                {`# Install locally
npm install jsonresume-theme-even

# Or globally
npm install -g jsonresume-theme-even`}
              </CodeBlock>

              <h4>Module Errors</h4>
              <p>
                Some themes require peer dependencies. Install them if you see
                module errors:
              </p>
              <CodeBlock>
                {`# Common peer dependencies
npm install react react-dom styled-components`}
              </CodeBlock>

              <h4>Getting Help</h4>
              <p>
                If you encounter issues, check the{' '}
                <a
                  href="https://github.com/rbardini/resumed/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  resumed GitHub issues
                </a>{' '}
                or the{' '}
                <a
                  href="https://github.com/jsonresume/jsonresume.org/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  JSON Resume repository
                </a>
                .
              </p>
            </Section>

            <Section title="Quick Reference">
              <CodeBlock>
                {`# Install resumed
npm install -g resumed

# Validate resume
resumed validate resume.json

# Render to HTML
resumed render resume.json --theme jsonresume-theme-even --output resume.html

# Render to PDF (requires puppeteer)
resumed render resume.json --theme jsonresume-theme-even --type pdf --output resume.pdf

# List available options
resumed --help
resumed render --help`}
              </CodeBlock>
            </Section>
          </div>
        </div>
      </div>
    </>
  );
}
