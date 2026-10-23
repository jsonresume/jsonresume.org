import { CodeBlock, Heading, Prose, Table, Td, Th } from '@jsonresume/ui';
import type { Metadata } from 'next';
import { DocSection, DocsLayout } from '@/components/docs-layout';
import styles from '@/components/docs.module.css';
import { Example } from '@/components/example';
import { Guidelines } from '@/components/guidelines';

export const metadata: Metadata = { title: 'Iconography' };

const usage = `import { Download } from 'lucide-react';

<Button variant="primary">
  <Download aria-hidden="true" /> Export PDF
</Button>`;

export default function IconographyPage() {
  return (
    <DocsLayout>
      <article className={styles.article}>
        <header className={styles.sectionHeader}>
          <Heading level={1} size="title">
            Iconography
          </Heading>
          <p className={styles.lede}>
            Icons are rare on jsonresume.org: words do most of the work. When an
            icon helps (a download, a search, an external link), use Lucide
            outline icons at a 1.75 stroke, in the color of the text beside
            them.
          </p>
        </header>

        <DocSection
          id="sizes"
          title="Sizes"
          description="16px inline and in small controls, 20px in buttons and navigation, 24px on their own."
        >
          <Example
            slug="icons"
            example={{ id: 'sizes', title: 'Sizes', block: true }}
          />
          <Table>
            <thead>
              <tr>
                <Th>Size</Th>
                <Th>Where</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>16px</Td>
                <Td>Inline with body text, badges, small buttons</Td>
              </tr>
              <tr>
                <Td>20px</Td>
                <Td>Navigation, standard controls</Td>
              </tr>
              <tr>
                <Td>24px</Td>
                <Td>Empty states and standalone icons</Td>
              </tr>
            </tbody>
          </Table>
        </DocSection>

        <DocSection
          id="in-components"
          title="In components"
          description="Inside a Button, icons scale with the label automatically (1em)."
        >
          <Example
            slug="icons"
            example={{
              id: 'in-components',
              title: 'Buttons, icon buttons and links',
            }}
          />
          <CodeBlock label="usage" code={usage} />
        </DocSection>

        <DocSection id="accessibility" title="Accessibility">
          <Prose>
            <ul>
              <li>
                Decorative icons next to text get{' '}
                <code>aria-hidden=&quot;true&quot;</code>.
              </li>
              <li>
                Icon-only controls need an <code>aria-label</code> naming the
                action, plus a Tooltip with the same words.
              </li>
              <li>
                Never use an icon alone to convey status; say it in words too.
              </li>
            </ul>
          </Prose>
        </DocSection>

        <DocSection id="guidelines" title="Guidelines">
          <Guidelines
            do={[
              'Use Lucide, outline style, strokeWidth 1.75.',
              'Let icons inherit color from their text.',
              'Pair icons with labels.',
            ]}
            dont={[
              'Mix icon sets or filled and outline styles.',
              'Color icons for decoration.',
              'Use an icon where a word is clearer.',
            ]}
          />
        </DocSection>
      </article>
    </DocsLayout>
  );
}
