import { assignInlineVars } from '@vanilla-extract/dynamic';
import { Heading, Table, Td, Th } from '@jsonresume/ui';
import { space } from '@jsonresume/ui/tokens';
import type { Metadata } from 'next';
import { DocSection, DocsLayout } from '@/components/docs-layout';
import * as styles from '@/components/docs.css';
import { Example } from '@/components/example';
import { Guidelines } from '@/components/guidelines';

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

        <DocSection
          id="in-use"
          title="Inside and between"
          description="Group related things tightly and separate groups generously: the space between groups should always be larger than the space within them."
        >
          <Example
            slug="spacing"
            example={{
              id: 'inside-between',
              title: 'Cards in a grid',
              block: true,
            }}
          />
        </DocSection>

        <DocSection
          id="rhythm"
          title="Page rhythm"
          description="Sections set the vertical rhythm of a page."
        >
          <Example
            slug="spacing"
            example={{ id: 'rhythm', title: 'Section spacing', bleed: true }}
          />
        </DocSection>

        <DocSection id="guidelines" title="Guidelines">
          <Guidelines
            do={[
              'Use Stack and Grid gaps instead of margins on children.',
              'Step up the scale as elements get bigger: 2 for labels, 4 inside cards, 6 to 8 between cards, 12 to 16 between sections.',
            ]}
            dont={[
              'Use values off the scale (13px, 18px).',
              'Space groups more tightly than the items inside them.',
            ]}
          />
        </DocSection>

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
                      style={assignInlineVars({
                        [styles.barWidth]: value === '0' ? '1px' : value,
                      })}
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
