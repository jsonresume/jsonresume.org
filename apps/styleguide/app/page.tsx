import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Feature,
  Grid,
  Heading,
  Hero,
  Section,
  SiteFooter,
  Stack,
  Text,
} from '@jsonresume/ui';
import NextLink from 'next/link';
import * as styles from '@/components/docs.css';
import { componentDocs } from '@/lib/components';

const principles = [
  {
    title: 'Plain and direct',
    text: 'JSON Resume is for developers. Say what a thing does in as few words as possible, and let content carry the page.',
  },
  {
    title: 'Light and calm',
    text: 'Light 300 headings, lots of white space, gray bands and one yellow band. Color is an accent, not decoration.',
  },
  {
    title: 'One clear action',
    text: 'Red is reserved for the main call to action. Everything else is a quiet bordered button or a link.',
  },
  {
    title: 'Accessible by default',
    text: 'Every component ships with keyboard support, visible focus and AA contrast, checked by tests on every change.',
  },
];

export default function OverviewPage() {
  return (
    <>
      <main id="main">
        <Hero
          title="JSON Resume Styleguide"
          lede="The brand, design tokens and React components shared by jsonresume.org and the registry."
          actions={
            <>
              <Button asChild variant="primary" size="lg">
                <NextLink href="/getting-started">Get started</NextLink>
              </Button>
              <Button asChild size="lg">
                <NextLink href="/components/button">Components</NextLink>
              </Button>
            </>
          }
        />

        <Section tone="subtle" spacing="lg">
          <Container>
            <Grid minColumnWidth="14rem" gap={8}>
              <Feature
                title="Brand"
                action={
                  <Button asChild>
                    <NextLink href="/brand">Read the brand</NextLink>
                  </Button>
                }
              >
                The wordmark, the yellow, the voice, and how they fit together.
              </Feature>
              <Feature
                title="Foundations"
                action={
                  <Button asChild>
                    <NextLink href="/foundations/color">
                      See the tokens
                    </NextLink>
                  </Button>
                }
              >
                Color, type, spacing, shape and motion as typed design tokens.
              </Feature>
              <Feature
                title="Components"
                action={
                  <Button asChild>
                    <NextLink href="/components/button">
                      Browse {componentDocs.length}
                    </NextLink>
                  </Button>
                }
              >
                Accessible React components with live examples and props.
              </Feature>
            </Grid>
          </Container>
        </Section>

        <Section spacing="lg">
          <Container>
            <Stack gap={8}>
              <Heading level={2}>Principles</Heading>
              <Grid minColumnWidth="22rem" gap={6}>
                {principles.map((p) => (
                  <Card key={p.title} tone="subtle">
                    <CardHeader>
                      <CardTitle>{p.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Text>{p.text}</Text>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
              <Heading level={2}>Everything in the system</Heading>
              <Grid minColumnWidth="13rem" gap={4}>
                {componentDocs.map((d) => (
                  <Card key={d.slug} interactive>
                    <NextLink
                      href={`/components/${d.slug}`}
                      className={styles.cardLink}
                    >
                      <CardHeader>
                        <CardTitle level={3}>{d.name}</CardTitle>
                        <CardDescription>{d.group}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Text size="xs" tone="muted">
                          {d.summary}
                        </Text>
                      </CardContent>
                    </NextLink>
                  </Card>
                ))}
              </Grid>
            </Stack>
          </Container>
        </Section>
      </main>
      <SiteFooter
        note="JSON Resume is open source"
        links={[
          <a key="home" href="https://jsonresume.org">
            jsonresume.org
          </a>,
          <a key="registry" href="https://registry.jsonresume.org">
            Registry
          </a>,
          <a key="gh" href="https://github.com/jsonresume/jsonresume.org">
            GitHub
          </a>,
        ]}
      />
    </>
  );
}
