import { Heading, Prose, Table, Td, Th } from '@jsonresume/ui';
import { motion } from '@jsonresume/ui/tokens';
import type { Metadata } from 'next';
import { DocSection, DocsLayout } from '@/components/docs-layout';
import styles from '@/components/docs.module.css';

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
            Motion is quick and quiet: color changes on hover, overlays fading
            in. Nothing bounces, and nothing moves when the reader has asked for
            reduced motion.
          </p>
        </header>
        <DocSection id="tokens" title="Tokens">
          <Table>
            <thead>
              <tr>
                <Th>Token</Th>
                <Th>Value</Th>
              </tr>
            </thead>
            <tbody>
              {[
                ...Object.entries(motion.duration).map(([k, v]) => [
                  `motion.duration.${k}`,
                  v,
                ]),
                ...Object.entries(motion.easing).map(([k, v]) => [
                  `motion.easing.${k}`,
                  v,
                ]),
              ].map(([k, v]) => (
                <tr key={k}>
                  <Td>
                    <span className={styles.propName}>{k}</span>
                  </Td>
                  <Td>
                    <span className={styles.mono}>{v}</span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </DocSection>
        <DocSection id="rules" title="Rules">
          <Prose>
            <ul>
              <li>
                Animate <code>opacity</code>, <code>transform</code> and colors.
                Never animate width, height or margins.
              </li>
              <li>
                Use base (250ms) for hover and state changes, fast (100ms) for
                tooltips.
              </li>
              <li>
                The <code>base</code> class shortens every animation and
                transition to near zero under{' '}
                <code>prefers-reduced-motion: reduce</code>; components with
                continuous animation stop it.
              </li>
            </ul>
          </Prose>
        </DocSection>
      </article>
    </DocsLayout>
  );
}
