import { Switch } from '@jsonresume/ui';
import * as s from './wants.css';

/** The opt-in for the weekly jobs email (@repo/job-digest). */
export function WeeklyEmail({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <section className={s.section}>
      <h3 className={s.sectionTitle}>Weekly email</h3>
      <p className={s.sectionHint}>
        On Mondays, up to five new jobs to apply for, decided as they are here.
        No new ones that week, no email. Every email has a link that turns it
        off.
      </p>
      <Switch
        label="Email me new jobs that fit"
        checked={on}
        onCheckedChange={onChange}
      />
    </section>
  );
}
