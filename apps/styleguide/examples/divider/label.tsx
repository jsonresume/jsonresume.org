import { Button, Divider, Stack } from '@jsonresume/ui';

export default function DividerLabel() {
  return (
    <Stack gap={4}>
      <Button variant="ink">Continue with GitHub</Button>
      <Divider label="or" />
      <Button>Sign in with email</Button>
    </Stack>
  );
}
