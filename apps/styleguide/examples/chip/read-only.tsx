import { Chip, Stack, Text } from '@jsonresume/ui';
import * as styles from './read-only.css';

const skills = ['TypeScript', 'React', 'PostgreSQL', 'Effect', 'Accessibility'];

// Without onRemove a chip is only a value: no button, nothing to focus.
export default function ChipReadOnly() {
  return (
    <Stack gap={2}>
      <Text size="xs" tone="muted" caps>
        Skills from your resume
      </Text>
      <Stack asChild direction="row" gap={2} wrap>
        <ul className={styles.list}>
          {skills.map((s) => (
            <li key={s}>
              <Chip>{s}</Chip>
            </li>
          ))}
        </ul>
      </Stack>
    </Stack>
  );
}
