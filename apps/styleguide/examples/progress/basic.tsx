import { Progress, Stack, Text } from '@jsonresume/ui';
import * as styles from './basic.css';

export default function ProgressBasic() {
  return (
    <Stack gap={2} className={styles.root}>
      <Text size="xs" tone="muted">
        Resume completeness: 70%
      </Text>
      <Progress label="Resume completeness" value={70} />
    </Stack>
  );
}
