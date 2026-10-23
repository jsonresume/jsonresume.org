import { Heading, Prose } from '@jsonresume/ui';
import type { Metadata } from 'next';
import { DocSection, DocsLayout } from '@/components/docs-layout';
import styles from '@/components/docs.module.css';

export const metadata: Metadata = { title: 'Accessibility' };

export default function AccessibilityPage() {
  return (
    <DocsLayout>
      <article className={styles.article}>
        <header className={styles.sectionHeader}>
          <Heading level={1} size="title">
            Accessibility
          </Heading>
          <p className={styles.lede}>
            The target is WCAG 2.2 AA. The components handle the mechanics;
            pages still need good headings, labels and alt text.
          </p>
        </header>
        <DocSection id="built-in" title="Built into the components">
          <Prose>
            <ul>
              <li>
                Native elements first: buttons are buttons, links are links,
                selects are selects.
              </li>
              <li>
                Overlays, tabs, accordions, checkboxes and switches use Radix
                primitives for keyboard support and ARIA.
              </li>
              <li>A visible 2px focus ring on every interactive element.</li>
              <li>
                Field wires labels, hints and errors with for, aria-describedby
                and aria-invalid.
              </li>
              <li>Animations stop under prefers-reduced-motion.</li>
            </ul>
          </Prose>
        </DocSection>
        <DocSection id="tested" title="Tested on every change">
          <Prose>
            <ul>
              <li>
                Every text and surface pairing in both themes is checked for
                4.5:1 contrast in{' '}
                <code>packages/ui/src/tokens/tokens.test.ts</code>.
              </li>
              <li>
                Each component group is rendered and run through axe-core in
                unit tests.
              </li>
              <li>
                Keyboard behavior (dialog focus, tab arrows, accordion, tooltips
                on focus) has interaction tests.
              </li>
            </ul>
          </Prose>
        </DocSection>
        <DocSection id="checklist" title="Page checklist">
          <Prose>
            <ul>
              <li>One h1, and headings that don’t skip levels.</li>
              <li>
                A SkipLink before the header and id=&quot;main&quot; on the main
                element.
              </li>
              <li>
                Every image has alt text, or alt=&quot;&quot; if decorative.
              </li>
              <li>Link text makes sense out of context.</li>
              <li>Content reflows at 320px and at 200% zoom.</li>
              <li>
                Nothing essential is only in a tooltip, or only conveyed by
                color.
              </li>
            </ul>
          </Prose>
        </DocSection>
      </article>
    </DocsLayout>
  );
}
