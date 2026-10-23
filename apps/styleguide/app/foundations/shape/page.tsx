import { assignInlineVars } from '@vanilla-extract/dynamic';
import { Grid, Heading } from '@jsonresume/ui';
import { radius, shadow } from '@jsonresume/ui/tokens';
import type { Metadata } from 'next';
import { DocSection, DocsLayout } from '@/components/docs-layout';
import * as styles from '@/components/docs.css';
import { Example } from '@/components/example';
import { Guidelines } from '@/components/guidelines';

export const metadata: Metadata = { title: 'Radius and elevation' };

export default function ShapePage() {
  return (
    <DocsLayout>
      <article className={styles.article}>
        <header className={styles.sectionHeader}>
          <Heading level={1} size="title">
            Radius and elevation
          </Heading>
          <p className={styles.lede}>
            Nearly square corners (2–3px) and almost no shadow. Structure comes
            from borders and gray bands; shadows are for things that float above
            the page.
          </p>
        </header>

        <DocSection
          id="in-use"
          title="Elevation in use"
          description="Three card tones cover nearly every case."
        >
          <Example
            slug="shape"
            example={{
              id: 'elevation',
              title: 'On the page, grouped, floating',
              block: true,
            }}
          />
        </DocSection>

        <DocSection id="guidelines" title="Guidelines">
          <Guidelines
            do={[
              'Use radius.sm (2px) for cards and inputs, radius.md (3px) for buttons.',
              'Use borders to separate, shadows only to lift things off the page.',
            ]}
            dont={[
              'Round cards or buttons into pills; jsonresume.org is nearly square.',
              'Stack shadows, or put a shadow on something that does not float.',
            ]}
          />
        </DocSection>

        <DocSection id="radius" title="Radius">
          <Grid minColumnWidth="8rem" gap={4}>
            {Object.entries(radius).map(([key, value]) => (
              <div key={key}>
                <div
                  className={`${styles.demoBox} ${styles.demoBorder}`}
                  style={assignInlineVars({ [styles.demoRadius]: value })}
                >
                  {value}
                </div>
                <p className={styles.mono}>radius.{key}</p>
              </div>
            ))}
          </Grid>
        </DocSection>
        <DocSection
          id="shadow"
          title="Elevation"
          description="md for popovers and raised cards, lg for dialogs."
        >
          <Grid minColumnWidth="8rem" gap={6}>
            {Object.entries(shadow).map(([key, value]) => (
              <div key={key}>
                <div
                  className={styles.demoBox}
                  style={assignInlineVars({ [styles.demoShadow]: value })}
                >
                  {key}
                </div>
                <p className={styles.mono}>shadow.{key}</p>
              </div>
            ))}
          </Grid>
        </DocSection>
      </article>
    </DocsLayout>
  );
}
