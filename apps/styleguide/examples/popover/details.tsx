'use client';

import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
} from '@jsonresume/ui';

export default function PopoverDetails() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Why 87% match?</Button>
      </PopoverTrigger>
      <PopoverContent arrow aria-label="Match breakdown">
        <Stack gap={3}>
          <Text weight="semibold">Match breakdown</Text>
          <Stack direction="row" gap={2} wrap>
            <Badge tone="success">TypeScript</Badge>
            <Badge tone="success">React</Badge>
            <Badge tone="warning">Go (learning)</Badge>
          </Stack>
          <Text size="xs" tone="muted">
            Based on your skills and the last 3 roles in your resume.
          </Text>
        </Stack>
      </PopoverContent>
    </Popover>
  );
}
