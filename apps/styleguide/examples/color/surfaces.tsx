import {
  Button,
  Container,
  Heading,
  Link,
  Logo,
  Section,
  Stack,
  Text,
} from '@jsonresume/ui';

// The three surfaces of a jsonresume.org page, top to bottom: brand
// yellow, light gray, white. Text tokens adapt to each.
export default function ColorSurfaces() {
  return (
    <>
      <Section tone="brand" spacing="sm">
        <Container>
          <Stack direction="row" justify="between" align="center" wrap gap={3}>
            <Logo />
            <Text tone="muted">surface.brand · text.onBrand</Text>
          </Stack>
        </Container>
      </Section>
      <Section tone="subtle" spacing="sm">
        <Container>
          <Stack gap={2}>
            <Heading level={3}>Themes</Heading>
            <Text tone="muted">
              surface.subtle · text.muted for supporting copy
            </Text>
          </Stack>
        </Container>
      </Section>
      <Section spacing="sm">
        <Container>
          <Stack gap={3}>
            <Text>
              surface.page · text.default for reading, and{' '}
              <Link href="#color">text.link</Link> for links.
            </Text>
            <Stack direction="row" gap={2}>
              <Button variant="primary">action.primary</Button>
              <Button>action.neutral</Button>
              <Button variant="ink">action.ink</Button>
            </Stack>
          </Stack>
        </Container>
      </Section>
    </>
  );
}
