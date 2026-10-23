import { Badge, Heading, Stack, Text } from '@jsonresume/ui';

export default function BadgeInContext() {
  return (
    <Stack gap={3}>
      <Stack direction="row" gap={2} align="center">
        <Heading level={3} size="group">
          @jsonresume/schema
        </Heading>
        <Badge tone="brand">1.7.0</Badge>
      </Stack>
      <Text tone="muted">
        <Badge tone="warning">Deprecated</Badge> projects[].description still
        validates; use summary.
      </Text>
    </Stack>
  );
}
