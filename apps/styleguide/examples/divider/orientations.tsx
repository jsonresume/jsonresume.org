import { Divider, Stack, Text } from '@jsonresume/ui';

export default function DividerOrientations() {
  return (
    <Stack gap={4}>
      <Text>Above</Text>
      <Divider />
      <Stack direction="row" gap={3} align="center">
        <Text>AI</Text>
        <Divider orientation="vertical" />
        <Text>Blog</Text>
        <Divider orientation="vertical" />
        <Text>Media</Text>
      </Stack>
    </Stack>
  );
}
