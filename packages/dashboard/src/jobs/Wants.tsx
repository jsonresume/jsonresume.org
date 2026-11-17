import { useAtomSet } from '@effect/atom-react';
import {
  Badge,
  Button,
  Callout,
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  Stack,
} from '@jsonresume/ui';
import {
  priorityLabels,
  sectorLabels,
  workplaceLabels,
  type JobPreferences,
} from '@repo/api';
import { keys, saveJobPreferencesAtom } from '@repo/api-client';
import { useState } from 'react';
import * as s from './wants.css';
import { jobsEvent, usd } from './labels';
import { PreferencesForm } from './PreferencesForm';

/** "Remote or Hybrid": both kinds of remote read as one. */
const workplaceText = (ws: JobPreferences['workplaces']) => {
  const remote = ws.includes('remote_global') && ws.includes('remote_region');
  return [
    ...(remote ? ['Remote'] : []),
    ...ws
      .filter(
        (w) => !remote || (w !== 'remote_global' && w !== 'remote_region')
      )
      .map((w) => workplaceLabels[w]),
  ].join(' or ');
};

/** What they want, as short phrases. */
export const wantText = (p: JobPreferences): string[] => [
  ...(p.workplaces.length ? [workplaceText(p.workplaces)] : []),
  ...(p.payFloor ? [`${usd(p.payFloor)}+`] : []),
  ...(p.payTarget ? [`Aiming for ${usd(p.payTarget)}`] : []),
  ...p.avoidSectors.map((x) => `No ${sectorLabels[x].toLowerCase()}`),
  ...p.likeSectors.map((x) => `Loves ${sectorLabels[x].toLowerCase()}`),
  ...p.wantSkills.slice(0, 3).map((x) => `Uses ${x}`),
  ...p.avoidSkills.slice(0, 3).map((x) => `No ${x}`),
  ...(p.direction
    ? [
        `Toward: ${
          p.direction.length > 60
            ? `${p.direction.slice(0, 57).trimEnd()}…`
            : p.direction
        }`,
      ]
    : []),
  ...(p.priorities[0] ? [`${priorityLabels[p.priorities[0]]} first`] : []),
  ...(p.needsVisa ? ['Needs a visa'] : []),
];

/** The editor, in a sheet: saving decides every job again. */
export function PreferencesSheet({
  open,
  onOpenChange,
  preferences,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: JobPreferences;
}) {
  const save = useAtomSet(saveJobPreferencesAtom, { mode: 'promiseExit' });
  const [draft, setDraft] = useState(preferences);
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    setSaving(true);
    await save({
      payload: draft,
      query: { source: 'you' },
      reactivityKeys: keys.jobs,
    });
    setSaving(false);
    onOpenChange(false);
  };
  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (next) setDraft(preferences);
        onOpenChange(next);
      }}
    >
      <SheetContent side="right" closeLabel="Close">
        <SheetHeader>
          <h2>What you want</h2>
        </SheetHeader>
        <SheetBody>
          <Stack gap={5}>
            <PreferencesForm value={draft} onChange={setDraft} />
          </Stack>
        </SheetBody>
        <SheetFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => void submit()}
            disabled={saving}
          >
            {saving ? 'Deciding again…' : 'Save and decide again'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/** What they want in one band, and the editor behind it. */
export function Wants({
  preferences,
  stated,
}: {
  preferences: JobPreferences;
  stated: boolean;
}) {
  const [open, setOpen] = useState(false);
  const edit = () => {
    jobsEvent('job_preferences_opened', { stated });
    setOpen(true);
  };
  return (
    <>
      {stated ? (
        <div className={s.wants}>
          <span className={s.wantsLabel}>You want</span>
          {wantText(preferences).map((t) => (
            <Badge key={t} tone="outline" className={s.wantBadge}>
              {t}
            </Badge>
          ))}
          <span className={s.grow} />
          <Button size="sm" variant="secondary" onClick={edit}>
            Edit
          </Button>
        </div>
      ) : (
        <Callout tone="brand" title="Tell us what you want">
          <Stack gap={3}>
            <span>
              Pay, where you’ll work, industries you’d rather avoid: a minute
              here and every job is decided for you, not just matched to your
              resume.
            </span>
            <span>
              <Button variant="primary" size="sm" onClick={edit}>
                Set what you want
              </Button>
            </span>
          </Stack>
        </Callout>
      )}
      <PreferencesSheet
        open={open}
        onOpenChange={setOpen}
        preferences={preferences}
      />
    </>
  );
}
