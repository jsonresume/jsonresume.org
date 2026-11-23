import { Callout, Container, Section, SectionIntro } from '@jsonresume/ui';
import companySchemaJson from '@jsonresume/schema/company-schema.json';
import sample from '@jsonresume/schema/sample.company.json';
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

const sections = schemaSections(decodeJsonSchema(companySchemaJson));
const c = schema.companySchema;

export function CompanySchemaPage() {
  return (
    <>
      <SchemaHero
        eyebrow="Reference · draft"
        title="The company schema"
        lede={c.intro}
        schemaUrl={c.schemaUrl}
        fileName="company-schema.json"
        source={c.source}
        sectionKeys={sections.map((section) => section.key)}
      />
      <Section spacing="lg" aria-labelledby="reference">
        <Container>
          <SectionIntro
            overline="Reference"
            title="Every field"
            headingId="reference"
          >
            The fields of a company.json, with the matching part of the sample
            company.
          </SectionIntro>
          <Callout className={l.spaced} title="From the job board">
            {c.board}
          </Callout>
          <SchemaReference
            sections={sections}
            example={sample}
            exampleName={c.file}
          />
        </Container>
      </Section>
      <NextSteps
        title="The other formats"
        items={[
          { label: 'Read the specification', href: paths.specCompany },
          { label: 'Job description schema', href: paths.jobDescriptionSchema },
          { label: 'The resume schema', href: paths.schema },
        ]}
      />
    </>
  );
}
