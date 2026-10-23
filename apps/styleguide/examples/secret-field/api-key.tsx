'use client';

import { Button, SecretField, Stack, Text } from '@jsonresume/ui';

export default function SecretFieldApiKey() {
  return (
    <Stack gap={2}>
      <Text weight="semibold">CI deploy key</Text>
      <SecretField
        label="API key for CI deploy"
        value="jr_live_5f2c9a7e1b4d8c3a6e0f9b2d4a7c1e8b"
        actions={
          <Button variant="danger" size="sm">
            Revoke
          </Button>
        }
      />
    </Stack>
  );
}
