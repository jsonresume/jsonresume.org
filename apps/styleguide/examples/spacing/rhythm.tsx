import { Container, Section, Text } from '@jsonresume/ui';

// Section spacing sets page rhythm: sm for dense bands, md by default,
// lg for landing pages, xl for the hero.
export default function SpacingRhythm() {
  return (
    <>
      {(['sm', 'md', 'lg'] as const).map((spacing, i) => (
        <Section
          key={spacing}
          spacing={spacing}
          tone={i % 2 ? 'page' : 'subtle'}
        >
          <Container>
            <Text>spacing=&quot;{spacing}&quot;</Text>
          </Container>
        </Section>
      ))}
    </>
  );
}
