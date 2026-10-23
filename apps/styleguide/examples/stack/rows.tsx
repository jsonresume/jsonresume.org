import { Badge, Button, Stack } from '@jsonresume/ui';

export default function StackRows() {
  return (
    <Stack gap={4}>
      <Stack direction="row" gap={2} wrap>
        <Badge tone="brand">Schema 1.7</Badge>
        <Badge>MIT</Badge>
        <Badge tone="outline">Community</Badge>
      </Stack>
      <Stack direction="row" gap={2} justify="end">
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Save</Button>
      </Stack>
    </Stack>
  );
}
