import { Callout, Container, Section, SectionIntro } from '@jsonresume/ui';
import jobSchemaJson from '@jsonresume/schema/job-schema.json';
import sample from '@jsonresume/schema/sample.job.json';
import { schema } from '@repo/content/pages';
import {
  decodeJsonSchema,
  SchemaReference,
  schemaSections,
} from '@repo/schema-explorer';
import { paths } from '../../links';
import { NextSteps } from '../shared/NextSteps';
import * as l from '../shared/layout.css';
import { SchemaHero } from './SchemaHero';

const sections = schemaSections(decodeJsonSchema(jobSchemaJson));
const j = schema.jobSchema;

export function JobSchemaPage() {
  return (
    <>
      <SchemaHero
        eyebrow="Reference · draft"
        title="The job description schema"
        lede={j.intro}
        schemaUrl={j.schemaUrl}
        fileName="job-schema.json"
        source={j.source}
        sectionKeys={sections.map((section) => section.key)}
      />
      <Section spacing="lg" aria-labelledby="reference">
        <Container>
          <SectionIntro
            overline="Reference"
            title="Every field"
            headingId="reference"
          >
            The fields of a job.json, with the matching part of the sample
            posting.
          </SectionIntro>
          <Callout className={l.spaced} title="Works with language models">
            {j.llm}
          </Callout>
          <SchemaReference
            sections={sections}
            example={sample}
            exampleName={j.file}
          />
        </Container>
      </Section>
      <NextSteps
        title="Describe the candidate side too"
        items={[
          { label: 'The resume schema', href: paths.schema },
          { label: 'Get started', href: paths.gettingStarted },
        ]}
      />
    </>
  );
}
