import { Stack, Text } from '@jsonresume/ui';

export default function TextTones() {
  return (
    <Stack gap={3}>
      <Text caps tone="muted">
        For developers, by developers
      </Text>
      <Text size="lg">
        JSON Resume is a community driven open-source initiative.
      </Text>
      <Text>The schema is open source and community-driven.</Text>
      <Text tone="muted" size="xs">
        Last updated 23 Oct 2026
      </Text>
    </Stack>
  );
}
