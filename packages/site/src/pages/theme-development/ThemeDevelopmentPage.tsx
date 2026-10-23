import {
  CodeBlock,
  Container,
  Hero,
  LinkCard,
  Section,
  SectionIntro,
  Step,
  Steps,
} from '@jsonresume/ui';
import { themeDevelopment as t } from '@repo/content/pages';
import { InlineMarkdown } from '../../InlineMarkdown';
import { paths } from '../../links';
import { NextSteps } from '../shared/NextSteps';
import * as l from '../shared/layout.css';
import * as s from './themeDevelopment.css';

export function ThemeDevelopmentPage() {
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow="Theme development"
        title="A theme is one function"
        lede="It takes a resume and returns HTML. Publish it as jsonresume-theme-{name} and the CLI and the registry can render any resume with it."
        media={<CodeBlock code={t.contract} label="index.js" />}
      />
      <Section spacing="lg" aria-labelledby="build">
        <Container>
          <SectionIntro
            overline="Build"
            title="From empty folder to npm"
            headingId="build"
          />
          <div className={l.twoCol}>
            <Steps layout="vertical">
              {t.themeSteps.map((step) => (
                <Step key={step.title} title={step.title}>
                  <InlineMarkdown>{step.body}</InlineMarkdown>
                  {step.code ? (
                    <CodeBlock className={l.stepCode} code={step.code} />
                  ) : null}
                </Step>
              ))}
            </Steps>
            <div className={l.stack}>
              <h3 className={l.panelTitle}>Learn from these</h3>
              {t.exampleThemes.map((card) => (
                <LinkCard
                  key={card.title}
                  href={card.href}
                  eyebrow={card.eyebrow}
                  title={card.title}
                  description={card.description}
                />
              ))}
            </div>
          </div>
        </Container>
      </Section>
      <Section tone="subtle" spacing="lg" aria-labelledby="rules">
        <Container>
          <SectionIntro
            overline="Rules"
            title="What every theme does"
            headingId="rules"
          >
            So it works in the CLI, on the registry and anywhere else themes
            run.
          </SectionIntro>
          <ul className={s.rules}>
            {t.rules.map((rule) => (
              <li key={rule.label} className={s.rule}>
                <strong className={s.ruleLabel}>{rule.label}</strong>
                <span className={l.body}>{rule.detail}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <NextSteps
        title="Then add it to the gallery"
        items={[
          { label: 'Browse the themes', href: paths.themes },
          { label: 'CLI reference', href: paths.cli },
        ]}
      />
    </>
  );
}
