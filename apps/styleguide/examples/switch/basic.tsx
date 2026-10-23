import { Stack, Switch } from '@jsonresume/ui';

export default function SwitchBasic() {
  return (
    <Stack gap={3}>
      <Switch label="Public resume" defaultChecked />
      <Switch label="Job alerts" />
    </Stack>
  );
}
