import { Progress, Stack, Text } from '@jsonresume/ui';

export default function ProgressBasic() {
  return (
    <Stack gap={2} style={{ width: 'min(100%, 24rem)' }}>
      <Text size="xs" tone="muted">
        Resume completeness: 70%
      </Text>
      <Progress label="Resume completeness" value={70} />
    </Stack>
  );
}
