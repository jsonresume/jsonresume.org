import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  Button,
  Callout,
  Card,
  CardContent,
  Grid,
  Heading,
  Logo,
  Prose,
  Stack,
  Text,
} from '@jsonresume/ui';
import type { Metadata } from 'next';
import { DocSection, DocsLayout } from '@/components/docs-layout';
import * as styles from '@/components/docs.css';

export const metadata: Metadata = { title: 'Brand' };

const voice = [
  [
    'Plain',
    'Say "Export your resume as a PDF", not "Unlock seamless multi-format career storytelling".',
  ],
  [
    'Developer to developer',
    'Assume the reader can read a command and a schema. Show the code.',
  ],
  [
    'Open',
    'Credit the community, link to the source, and say what is experimental.',
  ],
  ['Brief', 'Headlines are a few words. Ledes are one or two sentences.'],
];

export default function BrandPage() {
  return (
    <DocsLayout>
      <article className={styles.article}>
        <header className={styles.sectionHeader}>
          <Heading level={1} size="title">
            Brand
          </Heading>
          <p className={styles.lede}>
            JSON Resume looks like the open standard it is: a yellow band, light
            type, plenty of white space and a single red call to action. This
            page describes the identity every surface shares.
          </p>
        </header>

        <DocSection
          id="wordmark"
          title="Wordmark"
          description="“JSON Resume” set in Ubuntu Bold. The mark is a document with braces."
        >
          <Grid minColumnWidth="14rem" gap={4}>
            <div className={`${styles.lockup} ${styles.lockupBrand}`}>
              <Logo size="lg" mark />
            </div>
            <div className={`${styles.lockup} ${styles.lockupPage}`}>
              <Logo size="lg" mark />
            </div>
            <div className={`${styles.lockup} ${styles.lockupInverse}`}>
              <Logo size="lg" mark />
            </div>
          </Grid>
          <Prose>
            <ul>
              <li>
                Black on yellow is the primary lockup; black on white is the
                alternative; white on ink for dark surfaces.
              </li>
              <li>
                Keep clear space of at least the height of the “J” around the
                wordmark.
              </li>
              <li>
                Never recolor, outline, rotate or set the wordmark in another
                typeface.
              </li>
            </ul>
          </Prose>
        </DocSection>

        <DocSection
          id="color"
          title="Color"
          description="Yellow is the brand surface, ink is the text, red is the action. Grays do the structural work."
        >
          <Grid minColumnWidth="10rem" gap={3}>
            {[
              [
                'Brand yellow',
                '#fff18f',
                'Header, hero, selection, highlights',
              ],
              ['Ink', '#1a1a1a', 'Headings, wordmark, solid buttons'],
              ['Body', '#222222', 'Running text'],
              ['Action red', '#d23a3a', 'The one primary action'],
              ['Link red', '#a92525', 'Links in text'],
              ['Band gray', '#f9f9f9', 'Page headers, feature rows'],
              ['Rule gray', '#dddddd', 'Borders and rules'],
            ].map(([name, hex, use]) => (
              <div key={name} className={styles.swatch}>
                <div
                  className={styles.swatchColor}
                  style={assignInlineVars({ [styles.fill]: hex })}
                />
                <div className={styles.swatchMeta}>
                  <span className={styles.swatchName}>{name}</span>
                  <span className={styles.mono}>{hex}</span>
                  <Text size="xs" tone="muted">
                    {use}
                  </Text>
                </div>
              </div>
            ))}
          </Grid>
          <Callout tone="brand" title="Proportions">
            Mostly white, some light gray, one yellow band per page, and red
            only where someone should click.
          </Callout>
        </DocSection>

        <DocSection
          id="type"
          title="Typography"
          description="Open Sans everywhere, light for large headings. Ubuntu only for the wordmark."
        >
          <Card tone="subtle">
            <CardContent>
              <Stack gap={3}>
                <Heading level={2} size="display">
                  For developers, by developers
                </Heading>
                <Text size="lg">
                  Open Sans Light at 40–52px gives JSON Resume its calm, open
                  headline voice.
                </Text>
              </Stack>
            </CardContent>
          </Card>
        </DocSection>

        <DocSection id="voice" title="Voice and tone">
          <Grid minColumnWidth="15rem" gap={4}>
            {voice.map(([title, text]) => (
              <Card key={title}>
                <CardContent>
                  <Stack gap={2}>
                    <Heading level={3} size="group">
                      {title}
                    </Heading>
                    <Text>{text}</Text>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </DocSection>

        <DocSection
          id="buttons"
          title="The call to action"
          description="Uppercase, letter-spaced, on a 2px border. Red for one action, quiet for the rest."
        >
          <Stack direction="row" gap={3} wrap>
            <Button variant="primary" size="lg">
              Read more
            </Button>
            <Button>Get started</Button>
            <Button>View themes</Button>
          </Stack>
        </DocSection>
      </article>
    </DocsLayout>
  );
}
