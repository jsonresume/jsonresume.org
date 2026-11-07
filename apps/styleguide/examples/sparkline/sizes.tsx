import { Sparkline, Stack, Text } from '@jsonresume/ui';

const weeks = [8, 12, 9, 15, 14, 21, 18, 26, 24, 31, 29, 38];

export default function SparklineSizes() {
  return (
    <Stack direction="row" gap={8} align="end" wrap>
      <Stack gap={2}>
        <Sparkline values={weeks} />
        <Text size="xs" tone="muted">
          Default, 96 × 28
        </Text>
      </Stack>
      <Stack gap={2}>
        <Sparkline values={weeks} width={180} height={48} />
        <Text size="xs" tone="muted">
          width 180, height 48
        </Text>
      </Stack>
      <Stack gap={2}>
        <Sparkline values={[5, 5, 5, 5, 5, 5]} />
        <Text size="xs" tone="muted">
          No change: a level line
        </Text>
      </Stack>
    </Stack>
  );
}
