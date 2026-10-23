import { Field, Input, Stack } from '@jsonresume/ui';
import * as styles from './basic.css';

export default function FieldBasic() {
  return (
    <Stack gap={5} className={styles.root}>
      <Field label="Full name" required>
        <Input autoComplete="name" />
      </Field>
      <Field
        label="GitHub username"
        hint="Your resume is read from a gist named resume.json."
      >
        <Input placeholder="thomasdavis" />
      </Field>
      <Field
        label="Email"
        error="Enter an email address like name@example.com."
      >
        <Input type="email" defaultValue="thomas@" />
      </Field>
    </Stack>
  );
}
