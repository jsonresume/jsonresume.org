import { LogoMark, Stack, Text } from '@jsonresume/ui';
import * as styles from './mark.css';

// The mark is 1.25em and takes currentColor, so it sizes and colours with
// the text around it. It is decorative: the words beside it carry the name.
export default function LogoMarkAlone() {
  return (
    <Stack direction="row" gap={8} align="center" wrap>
      <span className={styles.tile}>
        <LogoMark />
      </span>
      <Text as="span" size="lg" weight="semibold" className={styles.inline}>
        <LogoMark /> resume.json
      </Text>
      <Text as="span" tone="muted" className={styles.inline}>
        <LogoMark /> Made with JSON Resume
      </Text>
    </Stack>
  );
}
