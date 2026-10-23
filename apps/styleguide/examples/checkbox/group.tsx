import { Checkbox, Stack, Text } from '@jsonresume/ui';

// Related checkboxes share a <fieldset> whose <legend> names the group.
export default function CheckboxGroup() {
  return (
    <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
      <legend>
        <Text weight="semibold" as="span">
          Show on my public resume
        </Text>
      </legend>
      <Stack gap={3} style={{ marginTop: 'var(--jr-space-3)' }}>
        <Checkbox label="Email address" defaultChecked />
        <Checkbox label="Phone number" />
        <Checkbox label="Street address" />
      </Stack>
    </fieldset>
  );
}
