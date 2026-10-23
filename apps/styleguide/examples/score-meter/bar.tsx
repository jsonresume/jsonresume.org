import { ScoreMeter, Stack } from '@jsonresume/ui';
import * as styles from './bar.css';

export default function ScoreMeterBar() {
  return (
    <Stack gap={5} className={styles.root}>
      <ScoreMeter variant="bar" label="Keywords" value={72} />
      <ScoreMeter variant="bar" label="Formatting" value={95} />
      <ScoreMeter variant="bar" label="Quantified impact" value={38} />
    </Stack>
  );
}
