import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Grid,
  Heading,
  Logo,
} from '@jsonresume/ui';
import type { Metadata } from 'next';
import { DocsLayout } from '@/components/docs-layout';
import styles from '@/components/docs.module.css';

export const metadata: Metadata = { title: 'Resources' };

const resources = [
  {
    title: 'Logo (SVG)',
    description:
      'The mark and the "JSON Resume" wordmark as outlined SVG, in ink and in white.',
    links: [
      ['Ink', '/brand/jsonresume-logo.svg'],
      ['White', '/brand/jsonresume-logo-white.svg'],
      ['Mark', '/brand/jsonresume-mark.svg'],
    ],
  },
  {
    title: 'Design tokens (JSON)',
    description:
      'Every token with its CSS variable name and light and dark values.',
    links: [['tokens.json', '/downloads/tokens.json']],
  },
  {
    title: 'Fonts',
    description:
      'Open Sans and Ubuntu, both free. @jsonresume/ui/fonts.css self-hosts them.',
    links: [
      ['Open Sans', 'https://fonts.google.com/specimen/Open+Sans'],
      ['Ubuntu', 'https://fonts.google.com/specimen/Ubuntu'],
    ],
  },
  {
    title: 'Source',
    description:
      'The components, tokens and this site are MIT-licensed in the jsonresume.org monorepo.',
    links: [
      [
        'packages/ui',
        'https://github.com/jsonresume/jsonresume.org/tree/master/packages/ui',
      ],
      [
        'apps/styleguide',
        'https://github.com/jsonresume/jsonresume.org/tree/master/apps/styleguide',
      ],
    ],
  },
];

export default function ResourcesPage() {
  return (
    <DocsLayout>
      <article className={styles.article}>
        <header className={styles.sectionHeader}>
          <Heading level={1} size="title">
            Resources
          </Heading>
          <p className={styles.lede}>
            Files and links for working with the JSON Resume brand.
          </p>
        </header>
        <div className={`${styles.lockup} ${styles.lockupBrand}`}>
          <Logo size="lg" mark />
        </div>
        <Grid minColumnWidth="18rem" gap={6}>
          {resources.map((r) => (
            <Card key={r.title}>
              <CardHeader>
                <CardTitle level={2}>{r.title}</CardTitle>
                <CardDescription>{r.description}</CardDescription>
              </CardHeader>
              <CardContent />
              <CardFooter>
                {r.links.map(([label, href]) => (
                  <Button key={href} asChild size="sm">
                    <a href={href}>{label}</a>
                  </Button>
                ))}
              </CardFooter>
            </Card>
          ))}
        </Grid>
      </article>
    </DocsLayout>
  );
}
