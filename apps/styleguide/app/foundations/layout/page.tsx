import { Heading, Prose, Table, Td, Th } from '@jsonresume/ui';
import { breakpoints, layout, zIndex } from '@jsonresume/ui/tokens';
import type { Metadata } from 'next';
import { DocSection, DocsLayout } from '@/components/docs-layout';
import * as styles from '@/components/docs.css';
import { Example } from '@/components/example';

export const metadata: Metadata = { title: 'Layout' };

function TokenRows({
  prefix,
  values,
}: {
  prefix: string;
  values: Record<string, string | number>;
}) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Token</Th>
          <Th>Value</Th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(values).map(([k, v]) => (
          <tr key={k}>
            <Td>
              <span className={styles.propName}>
                {prefix}.{k}
              </span>
            </Td>
            <Td>
              <span className={styles.mono}>{v}</span>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default function LayoutPage() {
  return (
    <DocsLayout>
      <article className={styles.article}>
        <header className={styles.sectionHeader}>
          <Heading level={1} size="title">
            Layout
          </Heading>
          <p className={styles.lede}>
            A single 970px column with 30px gutters carries most pages, inside
            full-width bands. Long text keeps a 72-character measure.
          </p>
        </header>

        <DocSection
          id="structure"
          title="Page structure"
          description="Every page follows the same skeleton."
        >
          <Example
            slug="layout"
            example={{
              id: 'page-structure',
              title: 'Header, title band, content, footer',
              bleed: true,
            }}
          />
        </DocSection>

        <DocSection
          id="reflow"
          title="Intrinsic grids"
          description="Grids decide their own column count from a minimum width, so most layouts need no breakpoints at all."
        >
          <Example
            slug="layout"
            example={{
              id: 'responsive-grid',
              title: 'Resize the container',
              block: true,
            }}
          />
        </DocSection>

        <DocSection id="widths" title="Widths and gutters">
          <TokenRows prefix="layout" values={layout} />
        </DocSection>
        <DocSection
          id="breakpoints"
          title="Breakpoints"
          description="Mobile first: styles apply from each width up. Exported as numbers and media query strings."
        >
          <TokenRows prefix="breakpoints" values={breakpoints} />
          <Prose>
            <p>
              Prefer intrinsic layouts (<code>Grid</code> with a minimum column
              width, wrapping <code>Stack</code>s) over breakpoints. Everything
              must reflow at 320px without horizontal scrolling.
            </p>
          </Prose>
        </DocSection>
        <DocSection id="z" title="Layers">
          <TokenRows prefix="zIndex" values={zIndex} />
        </DocSection>
      </article>
    </DocsLayout>
  );
}
