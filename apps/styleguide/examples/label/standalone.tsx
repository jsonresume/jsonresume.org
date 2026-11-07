import { Input, Label, Select, Stack, Text } from '@jsonresume/ui';
import * as styles from './standalone.css';

// Field is the usual choice. Label is for layouts Field can't make, such as a
// control beside its label, or a hint placed after the control.
export default function LabelStandalone() {
  return (
    <Stack gap={6} className={styles.root}>
      <div className={styles.inline}>
        <Label htmlFor="label-sort">Sort by</Label>
        <Select id="label-sort" defaultValue="fit">
          <option value="fit">Best fit</option>
          <option value="newest">Newest</option>
          <option value="salary">Salary</option>
        </Select>
      </div>
      <Stack gap={2}>
        <Label htmlFor="label-url">Website</Label>
        <Input
          id="label-url"
          type="url"
          placeholder="https://example.com"
          aria-describedby="label-url-hint"
        />
        <Text id="label-url-hint" size="xs" tone="muted">
          Shown under your name on your resume page.
        </Text>
      </Stack>
    </Stack>
  );
}
