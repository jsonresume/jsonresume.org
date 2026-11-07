import {
  Badge,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  relativeTime,
  Stack,
  Text,
} from '@jsonresume/ui';
import type { ResumeVersionSummary } from '@repo/api';
import { useState } from 'react';
import { byline, changeSummary } from './describe';
import * as s from './history.css';

/** Restore, after saying what it does. */
function RestoreButton({
  version,
  busy,
  onRestore,
}: {
  version: number;
  busy: boolean;
  onRestore: (version: number) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          aria-label={`Restore version ${version}`}
        >
          Restore
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Restore version {version}?</DialogTitle>
        <DialogDescription>
          Your page shows this version again. It is saved as a new version, so
          nothing in your history is lost.
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            variant="primary"
            disabled={busy}
            onClick={() =>
              void onRestore(version).then((ok) => ok && setOpen(false))
            }
          >
            Restore version {version}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Versions, newest first: when, who, what changed, and Restore. */
export function VersionList({
  versions,
  current,
  busy,
  now,
  onRestore,
}: {
  versions: ReadonlyArray<ResumeVersionSummary>;
  /** The newest version: nothing to restore. */
  current: number | null;
  busy: boolean;
  now: Date;
  onRestore: (version: number) => Promise<boolean>;
}) {
  return (
    <ol className={s.list}>
      {versions.map((v) => (
        <li key={v.version} className={s.row}>
          <Stack gap={1}>
            <Stack direction="row" wrap align="center" gap={2}>
              <Text as="span" weight="semibold">
                Version {v.version}
              </Text>
              {v.version === current ? (
                <Badge tone="success">Current</Badge>
              ) : null}
            </Stack>
            <Text as="span" size="xs" tone="muted">
              <time dateTime={v.createdAt}>
                {relativeTime(new Date(v.createdAt), now)}
              </time>
              {' · '}
              {byline(v.actor)}
            </Text>
            <Text as="span" size="xs" className={s.changes}>
              {changeSummary(v)}
            </Text>
          </Stack>
          {v.version === current ? null : (
            <RestoreButton
              version={v.version}
              busy={busy}
              onRestore={onRestore}
            />
          )}
        </li>
      ))}
    </ol>
  );
}
