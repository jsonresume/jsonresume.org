import { Badge, Heading, Link, Stack, Text } from '@jsonresume/ui';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocSection, DocsLayout } from '@/components/docs-layout';
import * as styles from '@/components/docs.css';
import { Example } from '@/components/example';
import { Guidelines } from '@/components/guidelines';
import { Playground } from '@/components/playground';
import { playgroundSlugs } from '@/lib/playgrounds';
import { PropsTable } from '@/components/props-table';
import props from '@/generated/props.json';
import { componentDocs, getComponentDoc } from '@/lib/components';

export const dynamicParams = false;

export function generateStaticParams() {
  return componentDocs.map((d) => ({ slug: d.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const doc = getComponentDoc((await params).slug);
  return doc ? { title: doc.name, description: doc.summary } : {};
}

const source = (component: string) =>
  (props as Record<string, { file: string }>)[component]?.file ??
  'src/index.ts';

export default async function ComponentPage({ params }: Params) {
  const doc = getComponentDoc((await params).slug);
  if (!doc) notFound();
  const file = source(doc.components[0] ?? '');

  return (
    <DocsLayout>
      <article className={styles.article}>
        <header className={styles.sectionHeader}>
          <Text caps tone="muted">
            {doc.group}
          </Text>
          <Heading level={1} size="title">
            {doc.name}
          </Heading>
          <p className={styles.lede}>{doc.summary}</p>
          <Stack direction="row" gap={2} wrap align="center">
            <Badge tone="outline">
              import {'{'} {doc.components.join(', ')} {'}'} from
              &apos;@jsonresume/ui&apos;
            </Badge>
            <Link
              href={`https://github.com/jsonresume/jsonresume.org/blob/master/packages/ui/${file}`}
              external
            >
              Source
            </Link>
          </Stack>
        </header>

        {playgroundSlugs.includes(doc.slug) ? (
          <DocSection
            id="playground"
            title="Playground"
            description="Change the props and copy the result."
          >
            <Playground slug={doc.slug} />
          </DocSection>
        ) : null}

        <DocSection id="examples" title="Examples">
          {doc.examples.map((example) => (
            <Example key={example.id} slug={doc.slug} example={example} />
          ))}
        </DocSection>

        {doc.guidelines ? (
          <DocSection id="usage" title="Usage">
            <Guidelines do={doc.guidelines.do} dont={doc.guidelines.dont} />
          </DocSection>
        ) : null}

        <DocSection id="accessibility" title="Accessibility">
          <ul className={styles.lede}>
            {doc.accessibility.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </DocSection>

        <DocSection id="props" title="Props">
          <Stack gap={8}>
            {doc.components.map((c) => (
              <PropsTable key={c} component={c} defaults={doc.defaults} />
            ))}
          </Stack>
        </DocSection>
      </article>
    </DocsLayout>
  );
}
