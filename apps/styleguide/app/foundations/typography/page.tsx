import { assignInlineVars } from '@vanilla-extract/dynamic';
import { Heading, Table, Td, Text, Th } from '@jsonresume/ui';
import { font } from '@jsonresume/ui/tokens';
import type { Metadata } from 'next';
import { DocSection, DocsLayout } from '@/components/docs-layout';
import * as styles from '@/components/docs.css';
import { Example } from '@/components/example';
import { Guidelines } from '@/components/guidelines';

export const metadata: Metadata = { title: 'Typography' };

const headingSizes = [
  ['display', '4xl', 'Light', 'Landing pages'],
  ['title', '3xl', 'Light', 'Page titles (h1)'],
  ['section', '2xl', 'Light', 'Sections'],
  ['subsection', 'xl', 'Regular', 'Sub-sections'],
  ['group', 'lg', 'Semibold', 'Groups and card titles'],
  ['label', 'md', 'Semibold', 'Small headings'],
] as const;

export default function TypographyPage() {
  return (
    <DocsLayout>
      <article className={styles.article}>
        <header className={styles.sectionHeader}>
          <Heading level={1} size="title">
            Typography
          </Heading>
          <p className={styles.lede}>
            Open Sans carries everything: light for large headings, regular for
            reading, semibold for labels. Body text is 14px with a 1.6 line
            height, as on jsonresume.org.
          </p>
        </header>

        <DocSection
          id="in-use"
          title="In use"
          description="Overline, light title, muted lede, then body copy: the opening of every jsonresume.org page."
        >
          <Example
            slug="typography"
            example={{
              id: 'composition',
              title: 'A docs page opening',
              block: true,
            }}
          />
        </DocSection>

        <DocSection
          id="measure"
          title="Line length"
          description="Running text keeps a 72-character measure. Use the measure prop on Text, or Prose."
        >
          <Example
            slug="typography"
            example={{
              id: 'measure',
              title: 'Measure versus full width',
              block: true,
            }}
          />
        </DocSection>

        <DocSection id="guidelines" title="Guidelines">
          <Guidelines
            do={[
              'Use light (300) only at 22px and up; it gets thin and faint below that.',
              'Write headings and labels in sentence case; CSS uppercases buttons.',
              'Use one h1 per page, and pick heading sizes with the size prop, not the level.',
              'Keep body text at 14px; step up to md (16px) for long reading.',
            ]}
            dont={[
              'Bold large headings.',
              'Set paragraphs in uppercase or letter-spaced type.',
              'Use the wordmark face (Ubuntu) for anything but the logo.',
              'Center long paragraphs.',
            ]}
          />
        </DocSection>

        <DocSection id="families" title="Families">
          <Table>
            <thead>
              <tr>
                <Th>Token</Th>
                <Th>Stack</Th>
                <Th>Use</Th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['sans', 'Everything'],
                  ['wordmark', 'The JSON Resume wordmark only'],
                  ['mono', 'Code, tokens, file names'],
                ] as const
              ).map(([key, use]) => (
                <tr key={key}>
                  <Td>
                    <span className={styles.propName}>font.family.{key}</span>
                  </Td>
                  <Td>
                    <span
                      className={styles.specimenText}
                      style={assignInlineVars({
                        [styles.specimenFamily]: font.family[key],
                      })}
                    >
                      {font.family[key].split(',')[0]}
                    </span>
                  </Td>
                  <Td>{use}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </DocSection>

        <DocSection id="headings" title="Heading sizes">
          {headingSizes.map(([size, token, weight, use]) => (
            <div key={size} className={styles.specimen}>
              <Heading level={3} size={size}>
                Resumes as JSON
              </Heading>
              <span className={styles.mono}>
                size=&quot;{size}&quot; · {font.size[token]} · {weight} · {use}
              </span>
            </div>
          ))}
        </DocSection>

        <DocSection id="scale" title="Type scale">
          {Object.entries(font.size).map(([key, value]) => (
            <div key={key} className={styles.specimen}>
              <span
                className={styles.specimenText}
                style={assignInlineVars({ [styles.specimenSize]: value })}
              >
                The quick brown fox
              </span>
              <span className={styles.mono}>
                font.size.{key} · {value}
              </span>
            </div>
          ))}
        </DocSection>

        <DocSection id="weights" title="Weights and line heights">
          <Table>
            <tbody>
              {Object.entries(font.weight).map(([key, value]) => (
                <tr key={key}>
                  <Td>
                    <span className={styles.propName}>font.weight.{key}</span>
                  </Td>
                  <Td>
                    <span
                      className={styles.specimenText}
                      style={assignInlineVars({
                        [styles.specimenWeight]: value,
                        [styles.specimenSize]: font.size.lg,
                      })}
                    >
                      Open Sans {value}
                    </span>
                  </Td>
                </tr>
              ))}
              {Object.entries(font.lineHeight).map(([key, value]) => (
                <tr key={key}>
                  <Td>
                    <span className={styles.propName}>
                      font.lineHeight.{key}
                    </span>
                  </Td>
                  <Td>{value}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Text tone="muted">
            Letter-spaced uppercase (tracking.caps, {font.tracking.caps}) is for
            buttons and short labels only.
          </Text>
        </DocSection>
      </article>
    </DocsLayout>
  );
}
