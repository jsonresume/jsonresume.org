import { CodeBlock, Heading, Prose } from '@jsonresume/ui';
import type { Metadata } from 'next';
import { DocSection, DocsLayout } from '@/components/docs-layout';
import styles from '@/components/docs.module.css';
import { Example } from '@/components/example';

export const metadata: Metadata = { title: 'Patterns' };

const anatomy = `<SkipLink />
<SiteHeader brand={<Logo />}>…</SiteHeader>
<main id="main">
  <PageHeader title="Themes" description="…" />
  <Section>
    <Container>…content…</Container>
  </Section>
  <Section tone="subtle">
    <Container>…related content…</Container>
  </Section>
</main>
<SiteFooter links={[…]} />`;

export default function PatternsPage() {
  return (
    <DocsLayout>
      <article className={styles.article}>
        <header className={styles.sectionHeader}>
          <Heading level={1} size="title">
            Patterns
          </Heading>
          <p className={styles.lede}>
            How the components combine into jsonresume.org pages.
          </p>
        </header>

        <DocSection
          id="page"
          title="Page anatomy"
          description="Yellow header, gray title band, white content, alternating bands, quiet footer."
        >
          <CodeBlock label="page structure" code={anatomy} />
        </DocSection>

        <DocSection
          id="landing"
          title="Landing page"
          description="A Hero followed by a row of Features on a gray band."
        >
          <Example
            slug="hero"
            example={{ id: 'promo', title: 'Hero', bleed: true }}
          />
          <Example
            slug="feature"
            example={{ id: 'row', title: 'Feature row', bleed: true }}
          />
        </DocSection>

        <DocSection
          id="docs"
          title="Documentation page"
          description="A NavList beside Prose, inside a wide Container."
        >
          <Prose>
            <p>
              This styleguide is the reference implementation: a sticky{' '}
              <code>NavList</code> in a 14rem column and the article in the
              rest, collapsing to a single column below 992px.
            </p>
          </Prose>
        </DocSection>

        <DocSection id="forms" title="Forms">
          <Example
            slug="field"
            example={{ id: 'basic', title: 'Fields', block: true }}
          />
          <Prose>
            <ul>
              <li>
                One column, labels above controls, hints above the control.
              </li>
              <li>
                Validate on submit, then on change for fields that have shown an
                error.
              </li>
              <li>One primary button, on the end, named for the outcome.</li>
            </ul>
          </Prose>
        </DocSection>

        <DocSection id="destructive" title="Destructive actions">
          <Example
            slug="dialog"
            example={{ id: 'confirm', title: 'Confirm before deleting' }}
          />
        </DocSection>
      </article>
    </DocsLayout>
  );
}
