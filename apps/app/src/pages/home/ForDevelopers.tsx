import { Button, CodeBlock, Container, Section } from '@jsonresume/ui';
import { links } from '../../site';
import * as s from './home.css';
import { SectionIntro } from './SectionIntro';

const commands = `npm install -g resume-cli

resume init                  # start a resume.json
resume validate              # check it against the schema
resume serve                 # preview it with a theme
resume export resume.pdf     # or .html, .md, .txt`;

const points = [
  'A JSON Schema you can validate in any language, in your editor or in CI.',
  'A CLI to start, check, preview and export your resume.',
  'A theme is an npm package with one render function: resume in, HTML out.',
  'A Rust crate and a RenderCV converter for tools built on top.',
];

export function ForDevelopers() {
  return (
    <Section spacing="xl" aria-labelledby="developers">
      <Container>
        <div className={s.split}>
          <div>
            <SectionIntro
              id="developers"
              overline="For developers, by developers"
              title="Plain JSON, real tools"
            />
            <ul className={s.checklist}>
              {points.map((point) => (
                <li key={point} className={s.checkItem}>
                  {point}
                </li>
              ))}
            </ul>
            <div className={s.devActions}>
              <Button asChild variant="ink">
                <a href={links.schema}>Read the schema</a>
              </Button>
              <Button asChild>
                <a href={links.cli}>CLI reference</a>
              </Button>
            </div>
          </div>
          <CodeBlock code={commands} label="Terminal" />
        </div>
      </Container>
    </Section>
  );
}
