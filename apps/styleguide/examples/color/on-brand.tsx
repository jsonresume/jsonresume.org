import {
  Button,
  Container,
  Heading,
  Link,
  Section,
  Stack,
  Text,
} from '@jsonresume/ui';

// Brand-yellow surfaces switch their descendants to ink-on-yellow tokens,
// so headings, muted text and links stay readable in light and dark.
export default function ColorOnBrand() {
  return (
    <Section tone="brand" spacing="md">
      <Container>
        <Stack gap={3}>
          <Heading level={3}>Hosted resumes</Heading>
          <Text tone="muted">
            Muted text on yellow uses a darker gray to keep 4.5:1.
          </Text>
          <Text>
            Links on yellow stay <Link href="#color">link red</Link>.
          </Text>
          <Stack direction="row" gap={2}>
            <Button variant="primary">Get started</Button>
            <Button>Learn more</Button>
          </Stack>
        </Stack>
      </Container>
    </Section>
  );
}
