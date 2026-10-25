import {
  Badge,
  Button,
  Callout,
  CodeBlock,
  Container,
  Hero,
  OnThisPage,
  Section,
  SectionIntro,
} from '@jsonresume/ui';
import { mcp } from '@repo/content/pages';
import type { McpClient } from '@repo/content/pages';
import { InlineMarkdown } from '../../InlineMarkdown';
import { paths } from '../../links';
import { SiteLink } from '../../SiteLink';
import { NextSteps } from '../shared/NextSteps';
import * as l from '../shared/layout.css';
import * as s from './mcp.css';
import { PromptList, ToolGroups } from './Tools';

const authBadge: Record<McpClient['auth'], string> = {
  oauth: 'Sign in',
  either: 'Sign in or API key',
  key: 'API key',
};

function Client({ client }: { client: McpClient }) {
  return (
    <section
      id={client.id}
      className={s.client}
      aria-labelledby={`${client.id}-title`}
    >
      <div className={s.clientHead}>
        <h3 id={`${client.id}-title`} className={s.clientName}>
          {client.name}
        </h3>
        <Badge tone={client.auth === 'key' ? 'neutral' : 'success'}>
          {authBadge[client.auth]}
        </Badge>
      </div>
      <ol className={s.steps}>
        {client.steps.map((step) => (
          <li key={step}>
            <InlineMarkdown>{step}</InlineMarkdown>
          </li>
        ))}
      </ol>
      {client.code ? (
        <CodeBlock label={client.code.label} code={client.code.code} copyable />
      ) : null}
    </section>
  );
}

const toc = [
  { id: 'connect', label: 'Connect' },
  ...mcp.clients.map((c) => ({ id: c.id, label: c.name })),
  { id: 'tools', label: 'What it can do' },
  { id: 'prompts', label: 'Prompts' },
  { id: 'ask', label: 'Things to ask' },
  { id: 'safety', label: 'Safety' },
];

/** /mcp: connect an agent to jsonresume.org, and what it can do there. */
export function McpPage() {
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow={mcp.intro.eyebrow}
        title={mcp.intro.title}
        lede={mcp.intro.lede}
        actions={
          <Button asChild variant="secondary">
            <SiteLink href={`${paths.dashboardSettings}#api-keys`}>
              Create an API key
            </SiteLink>
          </Button>
        }
        media={
          <div className={s.urlPanel}>
            <CodeBlock label="MCP server URL" code={mcp.serverUrl} copyable />
            <p className={l.muted}>
              Streamable HTTP, with OAuth or an API key.
            </p>
          </div>
        }
      />
      <Section spacing="lg">
        <Container>
          <div className={l.mainAside}>
            <div>
              <section
                id="connect"
                className={s.section}
                aria-labelledby="connect-title"
              >
                <SectionIntro
                  overline="Setup"
                  title="Connect your agent"
                  headingId="connect-title"
                />
                <p className={l.body}>
                  <InlineMarkdown>{mcp.auth.oauth}</InlineMarkdown>
                </p>
                <p className={l.body}>
                  <InlineMarkdown>{mcp.auth.key}</InlineMarkdown>
                </p>
                {mcp.clients.map((client) => (
                  <Client key={client.id} client={client} />
                ))}
              </section>
              <section
                id="tools"
                className={s.section}
                aria-labelledby="tools-title"
              >
                <SectionIntro
                  overline="Tools"
                  title="What your agent can do"
                  headingId="tools-title"
                >
                  <InlineMarkdown>{mcp.promise.text}</InlineMarkdown>
                </SectionIntro>
                <ToolGroups />
              </section>
              <section
                id="prompts"
                className={s.section}
                aria-labelledby="prompts-title"
              >
                <SectionIntro
                  overline="Prompts"
                  title="Conversations to start"
                  headingId="prompts-title"
                >
                  The registry’s AI tools, now run by your own agent: pick one
                  from your app’s prompt menu.
                </SectionIntro>
                <PromptList />
              </section>
              <section
                id="ask"
                className={s.section}
                aria-labelledby="ask-title"
              >
                <SectionIntro
                  overline="Examples"
                  title="Things to ask"
                  headingId="ask-title"
                />
                <ul className={s.examples}>
                  {mcp.examples.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </section>
              <section
                id="safety"
                className={s.section}
                aria-labelledby="safety-title"
              >
                <SectionIntro
                  overline="Safety"
                  title="Your account, your say"
                  headingId="safety-title"
                />
                <Callout tone="info">
                  <ul className={s.steps}>
                    {mcp.security.map((line) => (
                      <li key={line}>
                        <InlineMarkdown>{line}</InlineMarkdown>
                      </li>
                    ))}
                  </ul>
                </Callout>
              </section>
            </div>
            <OnThisPage items={toc} />
          </div>
        </Container>
      </Section>
      <NextSteps
        title="No account yet?"
        items={[
          { label: 'Create one', href: paths.signUp },
          {
            label: 'Host your resume from a gist',
            href: `${paths.gettingStarted}#gist`,
          },
        ]}
      />
    </>
  );
}
