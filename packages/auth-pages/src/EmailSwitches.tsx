import { Stack, Switch, Text } from '@jsonresume/ui';
import type { EmailSettings, EmailSettingsChange } from '@repo/api';

const ROWS: ReadonlyArray<{
  key: keyof EmailSettings;
  label: string;
  hint: string;
}> = [
  {
    key: 'accountEmails',
    label: 'Account emails',
    hint: 'A welcome, reminders to confirm your email, and one nudge if your page stays empty. Each comes once at most.',
  },
  {
    key: 'monthlyReport',
    label: 'Monthly resume report',
    hint: 'Early each month: how many people read your resume and where they came from. Only when someone did.',
  },
  {
    key: 'weeklyJobs',
    label: 'Weekly jobs email',
    hint: 'On Mondays, new Hacker News jobs that fit your resume.',
  },
];

/** One switch per kind of email; each click saves. */
export function EmailSwitches({
  settings,
  disabled = false,
  onChange,
}: {
  settings: EmailSettings | undefined;
  disabled?: boolean;
  onChange: (change: EmailSettingsChange) => void;
}) {
  return (
    <Stack gap={4}>
      {ROWS.map(({ key, label, hint }) => (
        <Stack gap={1} key={key}>
          <Switch
            label={label}
            checked={settings?.[key] ?? false}
            disabled={disabled || settings === undefined}
            onCheckedChange={(on) => onChange({ [key]: on })}
          />
          <Text size="sm" tone="muted">
            {hint}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
}
