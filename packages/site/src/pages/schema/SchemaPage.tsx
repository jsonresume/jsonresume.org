import { CodeTabs, Container, Section, SectionIntro } from '@jsonresume/ui';
import schemaJson from '@jsonresume/schema/schema.json';
import sample from '@jsonresume/schema/sample.resume.json';
import { facts } from '@repo/content/facts';
import { schema } from '@repo/content/pages';
import {
  decodeJsonSchema,
  SchemaReference,
  schemaSections,
} from '@repo/schema-explorer';
import { InlineMarkdown } from '../../InlineMarkdown';
import { paths } from '../../links';
import { NextSteps } from '../shared/NextSteps';
import * as l from '../shared/layout.css';
import { SchemaHero } from './SchemaHero';
import * as s from './schema.css';

const sections = schemaSections(decodeJsonSchema(schemaJson));
const r = schema.resumeSchema;

export function SchemaPage() {
  return (
    <>
      <SchemaHero
        eyebrow={`Reference · version ${facts.schemaVersion}`}
        title="The resume schema"
        lede={`${facts.schemaSectionCount} sections, every one optional. Describe your career once in resume.json and any compatible tool can read it.`}
        schemaUrl={r.schemaUrl}
        fileName="schema.json"
        source={r.source}
        sectionKeys={sections.map((section) => section.key)}
      />
      <Section spacing="lg" aria-label="Principles">
        <Container>
          <ul className={l.cardGrid}>
            {r.principles.map((principle) => (
              <li key={principle.title} className={s.principle}>
                <h2 className={s.principleTitle}>{principle.title}</h2>
                <p className={l.body}>
                  <InlineMarkdown>{principle.body}</InlineMarkdown>
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <Section tone="subtle" spacing="lg" aria-labelledby="validate">
        <Container>
          <div className={l.twoCol}>
            <SectionIntro
              overline="Check your file"
              title="Validate it"
              headingId="validate"
            >
              From the terminal, in code, or as you type: editors that read
              $schema check your resume live.
            </SectionIntro>
            <CodeTabs label="Validate with" tabs={r.validate} />
          </div>
        </Container>
      </Section>
      <Section spacing="lg" aria-labelledby="reference">
        <Container>
          <SectionIntro
            overline="Reference"
            title="Every section and field"
            headingId="reference"
          >
            Each section with its fields and types, and the matching part of the
            sample resume.
          </SectionIntro>
          <SchemaReference
            sections={sections}
            example={sample}
            exampleName={r.file}
          />
        </Container>
      </Section>
      <NextSteps
        title="Ready to write yours?"
        items={[
          { label: 'Get started', href: paths.gettingStarted },
          { label: 'Job description schema', href: paths.jobDescriptionSchema },
          { label: 'Browse themes', href: paths.themes },
        ]}
      />
    </>
  );
}
