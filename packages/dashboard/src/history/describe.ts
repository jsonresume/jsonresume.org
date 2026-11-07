import type { ResumeVersionSummary, VersionActor } from '@repo/api';

/** Who made a version: "You", "Claude (assistant)", "Restored by you". */
export const byline = (actor: VersionActor): string => {
  switch (actor.kind) {
    case 'user':
      return 'You';
    case 'restore':
      return `Restored by ${actor.name ?? 'you'}`;
    default:
      return actor.name
        ? `${actor.name} (${actor.kind})`
        : actor.kind === 'app'
        ? 'An app'
        : 'An assistant';
  }
};

const SHOWN = 3;

/** "basics.name changed, work[1] added and 4 more"; a restore says which. */
export const changeSummary = (v: ResumeVersionSummary): string => {
  if (v.note) return v.note;
  if (v.changeCount === 0) return 'No changes';
  const parts = v.changes
    .slice(0, SHOWN)
    .map((c) => `${c.path || 'Everything'} ${c.kind}`);
  const more = v.changeCount - parts.length;
  return more > 0 ? `${parts.join(', ')} and ${more} more` : parts.join(', ');
};
