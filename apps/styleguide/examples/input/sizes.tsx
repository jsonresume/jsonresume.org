import { Input, Stack } from '@jsonresume/ui';
import * as styles from './sizes.css';

export default function InputSizes() {
  return (
    <Stack gap={3} className={styles.root}>
      <Input size="sm" aria-label="Small" placeholder="Small" />
      <Input aria-label="Medium" placeholder="Medium" />
      <Input
        size="lg"
        type="search"
        aria-label="Search the docs"
        placeholder="Search the docs"
      />
    </Stack>
  );
}
