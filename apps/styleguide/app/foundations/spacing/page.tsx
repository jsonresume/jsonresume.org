import { Heading, Table, Td, Th } from '@jsonresume/ui';
import { space } from '@jsonresume/ui/tokens';
import type { Metadata } from 'next';
import { DocSection, DocsLayout } from '@/components/docs-layout';
import styles from '@/components/docs.module.css';

export const metadata: Metadata = { title: 'Spacing' };

export default function SpacingPage() {
  return (
    <DocsLayout>
      <article className={styles.article}>
        <header className={styles.sectionHeader}>
          <Heading level={1} size="title">
            Spacing
          </Heading>
          <p className={styles.lede}>
            A 4px grid. Small steps space things inside a component; large steps
            separate sections. jsonresume.org is generous: when in doubt, add
            space between sections, not inside them.
          </p>
        </header>
        <DocSection id="scale" title="Scale">
          <Table>
            <thead>
              <tr>
                <Th>Token</Th>
                <Th>Value</Th>
                <Th>Visual</Th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(space).map(([key, value]) => (
                <tr key={key}>
                  <Td>
                    <span className={styles.propName}>space.{key}</span>
                    <div className={styles.mono}>--jr-space-{key}</div>
                  </Td>
                  <Td>
                    <span className={styles.mono}>{value}</span>
                  </Td>
                  <Td>
                    <div
                      className={styles.scaleBar}
                      style={{ width: value === '0' ? '1px' : value }}
                    />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </DocSection>
      </article>
    </DocsLayout>
  );
}
