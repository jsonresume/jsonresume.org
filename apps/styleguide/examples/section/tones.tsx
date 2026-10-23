import { Container, Heading, Section, Text } from '@jsonresume/ui';

export default function SectionTones() {
  return (
    <>
      <Section tone="brand" spacing="sm">
        <Container>
          <Heading level={3}>brand</Heading>
        </Container>
      </Section>
      <Section tone="subtle" spacing="sm">
        <Container>
          <Heading level={3}>subtle</Heading>
          <Text tone="muted">Feature rows and page headers.</Text>
        </Container>
      </Section>
      <Section tone="page" spacing="sm">
        <Container>
          <Heading level={3}>page</Heading>
        </Container>
      </Section>
    </>
  );
}
