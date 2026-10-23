import { Container, Stack, Text } from '@jsonresume/ui';

const band = {
  background: 'var(--jr-color-surface-subtle)',
  paddingBlock: 'var(--jr-space-3)',
};

export default function ContainerSizes() {
  return (
    <Stack gap={2}>
      <Container size="prose" style={band}>
        <Text>prose: 72ch</Text>
      </Container>
      <Container style={band}>
        <Text>default: 970px, the site column</Text>
      </Container>
      <Container size="wide" style={band}>
        <Text>wide: 1200px</Text>
      </Container>
    </Stack>
  );
}
