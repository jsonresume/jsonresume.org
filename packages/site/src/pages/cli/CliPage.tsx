import {
  Button,
  CodeBlock,
  CodeTabs,
  Container,
  Hero,
  LinkCard,
  OnThisPage,
  Section,
  SectionIntro,
  Table,
  Td,
  Th,
} from '@jsonresume/ui';
import { cli } from '@repo/content/pages';
import type { CliOption } from '@repo/content/pages';
import { InlineMarkdown } from '../../InlineMarkdown';
import { paths } from '../../links';
import { SiteLink } from '../../SiteLink';
import { NextSteps } from '../shared/NextSteps';
import * as l from '../shared/layout.css';
import * as s from './cli.css';

function Options({
  options,
  caption,
}: {
  options: ReadonlyArray<CliOption>;
  caption: string;
}) {
  return (
    <Table caption={caption}>
      <thead>
        <tr>
          <Th>Option</Th>
          <Th>What it does</Th>
        </tr>
      </thead>
      <tbody>
        {options.map((option) => (
          <tr key={option.flag}>
            <Td>
              <code className={s.flag}>{option.flag}</code>
            </Td>
            <Td>
              <InlineMarkdown>{option.description}</InlineMarkdown>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

const toc = [
  { id: 'at-a-glance', label: 'At a glance' },
  ...cli.commands.map((command) => ({
    id: command.name,
    label: `resume ${command.name}`,
  })),
  { id: 'options', label: 'Global options' },
  { id: 'themes', label: 'Using themes' },
];

export function CliPage() {
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow="Command line"
        title="resume, in your terminal"
        lede="Create, validate, preview and export your resume. resume-cli is maintained alongside the schema."
        actions={
          <Button asChild>
            <a href={cli.source}>Source on GitHub</a>
          </Button>
        }
        media={
          <div className={s.installPanel}>
            <CodeTabs label="Install with" tabs={cli.install} />
            <p className={l.muted}>{cli.requirements}</p>
          </div>
        }
      />
      <Section spacing="lg">
        <Container>
          <div className={l.mainAside}>
            <div className={s.commands}>
              <section id="at-a-glance" aria-labelledby="at-a-glance-title">
                <SectionIntro
                  overline="Reference"
                  title="Commands at a glance"
                  headingId="at-a-glance-title"
                />
                <Table caption="Commands">
                  <tbody>
                    {cli.commands.map((command) => (
                      <tr key={command.name}>
                        <Td>
                          <a className={s.flag} href={`#${command.name}`}>
                            resume {command.name}
                          </a>
                        </Td>
                        <Td>{command.summary}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </section>
              {cli.commands.map((command) => (
                <section
                  key={command.name}
                  id={command.name}
                  className={s.command}
                  aria-labelledby={`${command.name}-title`}
                >
                  <h2 id={`${command.name}-title`} className={s.usage}>
                    {command.usage}
                  </h2>
                  <p className={s.summary}>{command.summary}</p>
                  {command.details ? (
                    <p className={l.body}>
                      <InlineMarkdown>{command.details}</InlineMarkdown>
                    </p>
                  ) : null}
                  <CodeBlock code={command.examples} label="Examples" />
                  {command.options ? (
                    <Options
                      options={command.options}
                      caption={`Options for ${command.name}`}
                    />
                  ) : null}
                </section>
              ))}
              <section
                id="options"
                className={s.command}
                aria-labelledby="options-title"
              >
                <h2 id="options-title" className={s.usage}>
                  Global options
                </h2>
                <Options
                  options={cli.globalOptions}
                  caption="Options every command reads"
                />
              </section>
              <section
                id="themes"
                className={s.command}
                aria-labelledby="themes-title"
              >
                <h2 id="themes-title" className={s.usage}>
                  Using themes
                </h2>
                <ul className={s.tips}>
                  {cli.themeTips.map((tip) => (
                    <li key={tip}>
                      <InlineMarkdown>{tip}</InlineMarkdown>
                    </li>
                  ))}
                </ul>
                <div className={l.cardGridWide}>
                  <LinkCard
                    asChild
                    eyebrow="Gallery"
                    title="Browse the themes"
                    description="Preview every theme with a real resume."
                  >
                    <SiteLink href={paths.themes} />
                  </LinkCard>
                  <LinkCard
                    eyebrow="Alternative"
                    title={cli.alternative.name}
                    description={cli.alternative.description}
                    href={cli.alternative.href}
                  />
                </div>
              </section>
            </div>
            <OnThisPage items={toc} />
          </div>
        </Container>
      </Section>
      <NextSteps
        title="Make a theme of your own"
        items={[
          { label: 'Theme development', href: paths.themeDevelopment },
          { label: 'The schema', href: paths.schema },
        ]}
      />
    </>
  );
}
