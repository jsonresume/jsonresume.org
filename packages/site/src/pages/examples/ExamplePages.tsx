import {
  Button,
  Card,
  Container,
  Heading,
  Hero,
  Link,
  Section,
  Text,
} from '@jsonresume/ui';
import type { Doc, ExampleResume } from '@repo/domain';
import { paths } from '../../links';
import * as s from './examples.css';
import { ResumeText } from './ResumeText';

const start = (slug: string) => `${paths.start}?example=${slug}`;

/** /examples/<slug>: a strong resume for one job title, and what to copy. */
export function ExamplePage({ example }: { example: ExampleResume }) {
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow={`${example.field} resume example`}
        title={`${example.role} resume example`}
        lede={example.intro}
        actions={
          <Button asChild variant="primary" size="lg">
            <a href={start(example.slug)}>Start with this example</a>
          </Button>
        }
      />
      <Section spacing="lg">
        <Container>
          <div className={s.layout}>
            <ResumeText resume={example.resume} />
            <aside className={s.tips}>
              <h2>What makes it work</h2>
              <ol>
                {example.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ol>
              <Text size="sm" tone="muted">
                A fictional person, written to show the shape. Start with it,
                replace every line with yours, and pick a theme.
              </Text>
              <a href={paths.examples}>All examples</a>
              <a href={paths.guides}>How to write each part</a>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}

/** /examples: an example resume for each common job title. */
const slugify = (field: string) => field.toLowerCase().replace(/\W+/g, '-');

/** Examples under their field, in the order they come (by field, then role). */
const byField = (examples: ReadonlyArray<ExampleResume>) => {
  const groups = new Map<string, ExampleResume[]>();
  for (const e of examples)
    groups.set(e.field, [...(groups.get(e.field) ?? []), e]);
  return [...groups];
};

export function ExamplesPage({
  examples,
}: {
  examples: ReadonlyArray<ExampleResume>;
}) {
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow="Resume examples"
        title="Resume examples by job"
        lede="A strong resume for each role, with what makes it work. Start from one and make it yours."
      />
      <Section spacing="lg">
        <Container>
          <div className={s.fields}>
            {byField(examples).map(([field, group]) => (
              <section key={field} aria-labelledby={`field-${slugify(field)}`}>
                <Heading
                  level={2}
                  size="group"
                  id={`field-${slugify(field)}`}
                  className={s.fieldName}
                >
                  {field}
                </Heading>
                <ul className={s.roles}>
                  {group.map((e) => (
                    <li key={e.slug}>
                      <Link href={paths.example(e.slug)}>{e.role}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

/** /guides: short practical guides to each part of a resume. */
export function GuidesPage({ guides }: { guides: ReadonlyArray<Doc> }) {
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow="Resume guides"
        title="How to write a resume, part by part"
        lede="Short, practical guides with examples to copy."
      />
      <Section spacing="lg">
        <Container>
          <ul className={s.list} aria-label="Guides">
            {guides.map((g) => (
              <li key={g.slug}>
                <Card asChild interactive tone="raised">
                  <a className={s.card} href={paths.guide(g.slug)}>
                    <span className={s.cardRole}>{g.title}</span>
                    <Text as="span" size="sm" tone="muted">
                      {g.description}
                    </Text>
                  </a>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
