import { CopyButton, Stack, Text } from '@jsonresume/ui';

export default function CopyButtonLink() {
  return (
    <Stack direction="row" gap={3} align="center" wrap>
      <Text>registry.jsonresume.org/thomasdavis</Text>
      <CopyButton
        value="https://registry.jsonresume.org/thomasdavis"
        label="Copy link"
        size="sm"
      />
    </Stack>
  );
}
