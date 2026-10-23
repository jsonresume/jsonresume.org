import { Callout, Heading, Prose } from '@jsonresume/ui';
import { palette } from '@jsonresume/ui/tokens';
import type { Metadata } from 'next';
import { DocSection, DocsLayout } from '@/components/docs-layout';
import styles from '@/components/docs.module.css';
import { ContrastMatrix } from '@/components/contrast-matrix';
import { Example } from '@/components/example';
import { Guidelines } from '@/components/guidelines';
import { ColorTokenTable } from '@/components/swatches';

export const metadata: Metadata = { title: 'Color' };

const ramps = Object.entries(palette).filter(
  ([, v]) => typeof v === 'object'
) as Array<[string, Record<string, string>]>;

export default function ColorPage() {
  return (
    <DocsLayout>
      <article className={styles.article}>
        <header className={styles.sectionHeader}>
          <Heading level={1} size="title">
            Color
          </Heading>
          <p className={styles.lede}>
            Components use semantic tokens (what a color is for), never the raw
            palette. Each semantic token has a light and a dark value, and every
            text pairing is tested to meet WCAG AA.
          </p>
        </header>

        <DocSection
          id="in-use"
          title="In use"
          description="A page is mostly white, with light gray bands for grouping and one yellow band at the top. Red appears only on the main action."
        >
          <Example
            slug="color"
            example={{
              id: 'surfaces',
              title: 'Surfaces and their text',
              bleed: true,
            }}
          />
        </DocSection>

        <DocSection
          id="on-brand"
          title="Text on yellow"
          description="Brand yellow is identical in both themes, so components placed on it switch to ink-on-yellow tokens automatically."
        >
          <Example
            slug="color"
            example={{
              id: 'on-brand',
              title: 'Section tone="brand"',
              bleed: true,
            }}
          />
        </DocSection>

        <DocSection
          id="themes"
          title="Light and dark"
          description='data-theme="dark" on any element re-themes everything inside it. Pages are light unless they opt in.'
        >
          <Example
            slug="color"
            example={{
              id: 'light-dark',
              title: 'The same components in both themes',
              bleed: true,
            }}
          />
        </DocSection>

        <DocSection
          id="contrast"
          title="Contrast"
          description="Computed from the tokens on every build. The same pairs are enforced by unit tests, so a token change that breaks AA fails CI."
        >
          <ContrastMatrix theme="light" />
          <ContrastMatrix theme="dark" />
        </DocSection>

        <DocSection id="guidelines" title="Guidelines">
          <Guidelines
            do={[
              'Use semantic tokens (text.muted, surface.subtle), never palette values, in components.',
              'Keep one yellow band per page, at the top.',
              'Reserve red for the single primary action and for links.',
              'Pair every status color with an icon or words.',
            ]}
            dont={[
              'Put body text in brand yellow, or yellow on white.',
              'Use red for decoration or headings.',
              'Invent a new gray: add a token if one is genuinely missing.',
              'Rely on color alone to show state.',
            ]}
          />
        </DocSection>

        <DocSection
          id="surface"
          title="Surfaces"
          description="Backgrounds, from the page to the yellow brand band."
        >
          <ColorTokenTable group="surface" />
        </DocSection>
        <DocSection
          id="text"
          title="Text"
          description="Contrast is measured against the page surface."
        >
          <ColorTokenTable group="text" against="page" />
        </DocSection>
        <DocSection id="border" title="Borders">
          <ColorTokenTable group="border" />
        </DocSection>
        <DocSection
          id="action"
          title="Actions"
          description="Button fills, borders and labels."
        >
          <ColorTokenTable group="action" />
        </DocSection>
        <DocSection
          id="status"
          title="Status"
          description="Info, success, warning and danger, each with a tinted surface."
        >
          <ColorTokenTable group="status" />
        </DocSection>
        <DocSection id="focus" title="Focus and overlay">
          <ColorTokenTable group="focus" />
          <ColorTokenTable group="overlay" />
          <Callout title="Focus">
            Focus is ink in light mode and brand yellow in dark mode, drawn as a
            2px outline with a 2px offset. It is never removed.
          </Callout>
        </DocSection>

        <DocSection
          id="palette"
          title="Palette"
          description="The raw ramps the semantic tokens are built from. Reach for these only when adding a token."
        >
          {ramps.map(([name, ramp]) => (
            <div key={name}>
              <Heading level={3} size="label">
                {name}
              </Heading>
              <div
                className={styles.swatchGrid}
                style={{ marginTop: 'var(--jr-space-3)' }}
              >
                {Object.entries(ramp).map(([step, hex]) => (
                  <div key={step} className={styles.swatch}>
                    <div
                      className={styles.swatchColor}
                      style={{ background: hex }}
                    />
                    <div className={styles.swatchMeta}>
                      <span className={styles.swatchName}>
                        {name}.{step}
                      </span>
                      <span className={styles.mono}>{hex}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Prose>
            <p>
              Brand yellow is <code>yellow.200</code>, action red{' '}
              <code>red.500</code> and link red <code>red.700</code>: the exact
              values from jsonresume.org.
            </p>
          </Prose>
        </DocSection>
      </article>
    </DocsLayout>
  );
}
