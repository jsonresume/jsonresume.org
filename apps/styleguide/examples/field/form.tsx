import {
  Button,
  Checkbox,
  Field,
  Input,
  Select,
  Stack,
  Textarea,
} from '@jsonresume/ui';
import * as styles from './form.css';

// One column, labels above controls, one primary action at the end.
export default function FieldForm() {
  return (
    <form className={styles.root}>
      <Stack gap={5}>
        <Field label="Full name" required>
          <Input autoComplete="name" />
        </Field>
        <Field label="Email" hint="Shown on your resume only if you choose.">
          <Input type="email" autoComplete="email" />
        </Field>
        <Field label="Theme">
          <Select defaultValue="pro">
            <option value="pro">Pro</option>
            <option value="even">Even</option>
            <option value="elegant">Elegant</option>
          </Select>
        </Field>
        <Field label="Summary">
          <Textarea rows={4} />
        </Field>
        <Checkbox label="Make my resume public" defaultChecked />
        <Stack direction="row" gap={2} justify="end">
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary" type="submit">
            Save resume
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
