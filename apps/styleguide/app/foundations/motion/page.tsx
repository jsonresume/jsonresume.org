import { Heading, Table, Td, Th } from '@jsonresume/ui';
import { motion } from '@jsonresume/ui/tokens';
import type { Metadata } from 'next';
import { DocSection, DocsLayout } from '@/components/docs-layout';
import * as styles from '@/components/docs.css';
import { Example } from '@/components/example';
import { Guidelines } from '@/components/guidelines';

export const metadata: Metadata = { title: 'Motion' };

export default function MotionPage() {
  return (
    <DocsLayout>
      <article className={styles.article}>
        <header className={styles.sectionHeader}>
          <Heading level={1} size="title">
            Motion
          </Heading>
          <p className={styles.lede}>
            Motion on JSON Resume is quick and quiet. It confirms that something
            happened (a color shifts on hover, a dialog fades in) and never
            performs for its own sake. Nothing bounces, nothing slides across
            the page.
          </p>
        </header>

        <DocSection
          id="durations"
          title="Durations"
          description="Four steps. base (250ms) is the default for state changes, matching jsonresume.org's hover transitions."
        >
          <Example
            slug="motion"
            example={{
              id: 'durations',
              title: 'Every duration, side by side',
              block: true,
            }}
          />
          <Table>
            <thead>
              <tr>
                <Th>Token</Th>
                <Th>Value</Th>
                <Th>Use for</Th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  [
                    'instant',
                    'State that must not animate (toggling a selection highlight).',
                  ],
                  [
                    'fast',
                    'Small, local feedback: tooltips, focus, press states.',
                  ],
                  [
                    'base',
                    'Hover colors, borders, overlays, panels: the default.',
                  ],
                  [
                    'slow',
                    'Large surfaces entering, e.g. a full-screen sheet. Rare.',
                  ],
                ] as const
              ).map(([key, use]) => (
                <tr key={key}>
                  <Td>
                    <span className={styles.propName}>
                      motion.duration.{key}
                    </span>
                  </Td>
                  <Td>
                    <span className={styles.mono}>{motion.duration[key]}</span>
                  </Td>
                  <Td>{use}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </DocSection>

        <DocSection
          id="easing"
          title="Easing"
          description="standard for things that change in place, out for things that arrive. Linear looks mechanical, so keep it for spinners."
        >
          <Example
            slug="motion"
            example={{
              id: 'easings',
              title: 'Curves compared at a slow speed',
              block: true,
            }}
          />
          <Table>
            <tbody>
              {Object.entries(motion.easing).map(([key, value]) => (
                <tr key={key}>
                  <Td>
                    <span className={styles.propName}>motion.easing.{key}</span>
                  </Td>
                  <Td>
                    <span className={styles.mono}>{value}</span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </DocSection>

        <DocSection
          id="interaction"
          title="Hover and focus"
          description="Interactive elements change color and border over base. Focus rings appear instantly: they are never animated."
        >
          <Example
            slug="motion"
            example={{ id: 'interaction', title: 'Hover, then Tab through' }}
          />
        </DocSection>

        <DocSection
          id="enter-exit"
          title="Entering and leaving"
          description="Fade with a short rise (8px) using easing.out. Animate only opacity and transform, so the page never reflows mid-animation."
        >
          <Example
            slug="motion"
            example={{
              id: 'enter-exit',
              title: 'Show and hide a confirmation',
              block: true,
            }}
          />
        </DocSection>

        <DocSection
          id="components"
          title="Motion in components"
          description="What the components already do, so you rarely need to add motion yourself."
        >
          <Example
            slug="motion"
            example={{
              id: 'components',
              title: 'Dialog, tooltip and accordion',
              block: true,
            }}
          />
        </DocSection>

        <DocSection id="guidelines" title="Guidelines">
          <Guidelines
            do={[
              'Use base for nearly everything; reach for fast only for tiny feedback.',
              'Animate opacity, transform and color.',
              'Make motion explain cause and effect: the thing you clicked is the thing that changes.',
            ]}
            dont={[
              'Animate width, height, margins or top/left: they reflow the page.',
              'Bounce, spring, or overshoot.',
              'Animate focus rings or text.',
              'Run anything longer than slow (400ms) in response to a click.',
            ]}
          />
        </DocSection>
      </article>
    </DocsLayout>
  );
}
