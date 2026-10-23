import { Grid, Heading } from '@jsonresume/ui';
import { radius, shadow } from '@jsonresume/ui/tokens';
import type { Metadata } from 'next';
import { DocSection, DocsLayout } from '@/components/docs-layout';
import styles from '@/components/docs.module.css';

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
        <DocSection id="radius" title="Radius">
          <Grid minColumnWidth="8rem" gap={4}>
            {Object.entries(radius).map(([key, value]) => (
              <div key={key}>
                <div
                  className={`${styles.demoBox} ${styles.demoBorder}`}
                  style={{ borderRadius: value }}
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
                <div className={styles.demoBox} style={{ boxShadow: value }}>
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
