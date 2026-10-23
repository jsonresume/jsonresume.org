import { ScoreMeter, Stack } from '@jsonresume/ui';

export default function ScoreMeterRing() {
  return (
    <Stack direction="row" gap={10} wrap justify="center">
      <ScoreMeter label="ATS score" value={84} />
      <ScoreMeter label="Readiness" value={63} size={96} />
      <ScoreMeter label="Match" value={31} size={96} />
    </Stack>
  );
}
