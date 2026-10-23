import { Checkbox, Stack, Text } from '@jsonresume/ui';
import * as styles from './group.css';

// Related checkboxes share a <fieldset> whose <legend> names the group.
export default function CheckboxGroup() {
  return (
    <fieldset className={styles.fieldset}>
      <legend>
        <Text weight="semibold" as="span">
          Show on my public resume
        </Text>
      </legend>
      <Stack gap={3} className={styles.options}>
        <Checkbox label="Email address" defaultChecked />
        <Checkbox label="Phone number" />
        <Checkbox label="Street address" />
      </Stack>
    </fieldset>
  );
}
