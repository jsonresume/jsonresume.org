import { RegistryProvider } from '@effect/atom-react';
import {
  CodeBlock,
  CodeTabs,
  Container,
  Hero,
  LinkCard,
  Section,
  SectionIntro,
  Step,
  Steps,
} from '@jsonresume/ui';
import { cli, gettingStarted as g } from '@repo/content/pages';
import { InlineMarkdown } from '../../InlineMarkdown';
import { paths } from '../../links';
import { SiteLink } from '../../SiteLink';
import { NextSteps } from '../shared/NextSteps';
import * as l from '../shared/layout.css';
import { ToolCards } from '../shared/ToolCards';
import { YourRegistry } from './YourRegistry';

function StepList({ steps }: { steps: typeof g.gistSteps }) {
  return (
    <Steps layout="vertical">
      {steps.map((step) => (
        <Step key={step.title} title={step.title}>
          <InlineMarkdown>{step.body}</InlineMarkdown>
          {step.code ? (
            <CodeBlock className={l.stepCode} code={step.code} />
          ) : null}
        </Step>
      ))}
    </Steps>
  );
}

export function GettingStartedPage() {
  return (
    <RegistryProvider>
      <Hero
        size="compact"
        align="start"
        eyebrow="Getting started"
        title="Your resume, live in minutes"
        lede="Pick a way in. All three use the same resume.json, so you can switch at any time."
      />
      <Section spacing="lg">
        <Container>
          <ul className={l.pathCards} aria-label="Ways to start">
            {g.paths.map((path) => (
              <li key={path.title}>
                <LinkCard
                  href={path.href}
                  eyebrow={path.eyebrow}
                  title={path.title}
                  description={path.description}
                />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section spacing="lg" id="gist" aria-labelledby="gist-title">
        <Container>
          <SectionIntro
            overline="No install"
            title="Host it from a Gist"
            headingId="gist-title"
          >
            The registry renders any public Gist named resume.json, in any
            theme.
          </SectionIntro>
          <div className={l.twoCol}>
            <StepList steps={g.gistSteps} />
            <YourRegistry />
          </div>
        </Container>
      </Section>

      <Section tone="subtle" spacing="lg" id="cli" aria-labelledby="cli-title">
        <Container>
          <SectionIntro
            overline="Terminal"
            title="Use the CLI"
            headingId="cli-title"
          >
            Work offline, keep resume.json in Git, and export with any theme.
          </SectionIntro>
          <div className={l.twoCol}>
            <StepList steps={g.cliSteps} />
            <div className={l.stack}>
              <div className={l.panel}>
                <h3 className={l.panelTitle}>Install</h3>
                <CodeTabs label="Install with" tabs={cli.install} />
                <p className={l.muted}>{cli.requirements}</p>
              </div>
              <LinkCard
                asChild
                eyebrow="Reference"
                title="Every command and option"
                description="init, validate, export, serve, themes and audit."
              >
                <SiteLink href={paths.cli} />
              </LinkCard>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" id="import" aria-labelledby="import-title">
        <Container>
          <SectionIntro
            overline="Bring your data"
            title="Import what you have"
            headingId="import-title"
          >
            Community tools to start from an existing profile, or take your
            resume to LaTeX and YAML.
          </SectionIntro>
          <ToolCards tools={g.importTools} />
        </Container>
      </Section>

      <NextSteps
        title="Next: make it yours"
        items={[
          { label: 'Choose a theme', href: paths.themes },
          { label: 'Read the schema', href: paths.schema },
          { label: g.video.title, href: g.video.href },
        ]}
      />
    </RegistryProvider>
  );
}
