import { Field, Input, Stack } from '@jsonresume/ui';

export default function FieldBasic() {
  return (
    <Stack gap={5} style={{ width: 'min(100%, 22rem)' }}>
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
