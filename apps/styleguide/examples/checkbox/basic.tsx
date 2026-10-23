import { Checkbox, Stack } from '@jsonresume/ui';

export default function CheckboxBasic() {
  return (
    <Stack gap={3}>
      <Checkbox label="Show my email address" defaultChecked />
      <Checkbox label="Show my phone number" />
      <Checkbox label="Some sections selected" checked="indeterminate" />
      <Checkbox label="Unavailable" disabled />
    </Stack>
  );
}
