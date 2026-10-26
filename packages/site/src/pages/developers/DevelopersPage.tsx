import {
  Button,
  CodeBlock,
  CodeTabs,
  Container,
  Hero,
  OnThisPage,
  Section,
  SectionIntro,
  Step,
  Steps,
  Table,
  Td,
  Th,
} from '@jsonresume/ui';
import { developers as d } from '@repo/content/pages';
import { InlineMarkdown } from '../../InlineMarkdown';
import { paths } from '../../links';
import { SiteLink } from '../../SiteLink';
import { NextSteps } from '../shared/NextSteps';
import * as l from '../shared/layout.css';

const toc = [
  { id: 'how-it-works', label: 'How it works' },
  { id: 'scopes', label: 'Scopes' },
  { id: 'endpoints', label: 'Endpoints' },
  { id: 'notes', label: 'Good to know' },
];

/** /developers: OAuth for HR tools ("Sign in with JSON Resume"). */
export function DevelopersPage() {
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow={d.intro.eyebrow}
        title={d.intro.title}
        lede={d.intro.lede}
        actions={
          <Button asChild>
            <SiteLink href={`${paths.dashboard}/settings#oauth-apps`}>
              Register an app
            </SiteLink>
          </Button>
        }
        media={<CodeTabs label="Example" tabs={d.examples} />}
      />
      <Section spacing="lg">
        <Container>
          <div className={l.mainAside}>
            <div className={l.stack}>
              <section id="how-it-works" aria-labelledby="how-title">
                <SectionIntro
                  overline="OAuth 2.1"
                  title="How it works"
                  headingId="how-title"
                />
                <Steps layout="vertical">
                  {d.steps.map((step) => (
                    <Step key={step.title} title={step.title}>
                      <InlineMarkdown>{step.body}</InlineMarkdown>
                      {step.code ? (
                        <CodeBlock className={l.stepCode} code={step.code} />
                      ) : null}
                    </Step>
                  ))}
                </Steps>
              </section>
              <section id="scopes" aria-labelledby="scopes-title">
                <SectionIntro
                  overline="Ask for what you need"
                  title="Scopes"
                  headingId="scopes-title"
                />
                <Table caption="Scopes, space-separated in scope=">
                  <thead>
                    <tr>
                      <Th>Scope</Th>
                      <Th>Lets your app</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.scopes.map((s) => (
                      <tr key={s.scope}>
                        <Td>
                          <code>{s.scope}</code>
                        </Td>
                        <Td>
                          <InlineMarkdown>{s.allows}</InlineMarkdown>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </section>
              <section id="endpoints" aria-labelledby="endpoints-title">
                <SectionIntro
                  overline="Reference"
                  title="Endpoints"
                  headingId="endpoints-title"
                />
                <Table caption="Endpoints">
                  <tbody>
                    {d.endpoints.map((e) => (
                      <tr key={e.name}>
                        <Td>{e.name}</Td>
                        <Td>
                          <code className={l.url}>{e.url}</code>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </section>
              <section id="notes" aria-labelledby="notes-title">
                <SectionIntro
                  overline="Details"
                  title="Good to know"
                  headingId="notes-title"
                />
                <ul className={l.stackTight}>
                  {d.notes.map((note) => (
                    <li key={note} className={l.body}>
                      <InlineMarkdown>{note}</InlineMarkdown>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
            <OnThisPage items={toc} />
          </div>
        </Container>
      </Section>
      <NextSteps
        title="Building for agents instead?"
        items={[
          { label: 'The MCP server', href: paths.mcp },
          { label: 'The schema', href: paths.schema },
        ]}
      />
    </>
  );
}
