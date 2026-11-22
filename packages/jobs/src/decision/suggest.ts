import {
  sectorLabels,
  type JobMark,
  type JobPreferences,
  type PassReason,
  type PreferenceSuggestion,
  type RemoteScope,
  type Sector,
} from '@repo/api';

/** A marked job, as suggestions read it. */
export interface MarkedFacts {
  state: JobMark;
  reason: PassReason | null;
  sectors: ReadonlyArray<Sector>;
  remote: RemoteScope;
}

/** Marks it takes before a pattern is suggested. */
const ENOUGH = 3;

const liked = (m: MarkedFacts) =>
  m.state === 'interested' || m.state === 'applied';

/**
 * Preferences their marks point to, that they haven't stated or dismissed:
 * a sector they keep passing on (and never save), one they keep saving,
 * and remote work when they pass on every office job.
 */
export const suggestions = (
  marks: ReadonlyArray<MarkedFacts>,
  want: JobPreferences
): PreferenceSuggestion[] => {
  const found: PreferenceSuggestion[] = [];
  const offer = (id: string, text: string, preferences: JobPreferences) => {
    if (!want.dismissed.includes(id)) found.push({ id, text, preferences });
  };
  const tally = (pick: (m: MarkedFacts) => boolean) => {
    const counts = new Map<Sector, number>();
    for (const m of marks.filter(pick)) {
      for (const s of m.sectors) counts.set(s, (counts.get(s) ?? 0) + 1);
    }
    return counts;
  };
  const passed = tally((m) => m.state === 'not_interested');
  const saved = tally(liked);
  for (const [sector, n] of [...passed].sort((a, b) => b[1] - a[1])) {
    if (n < ENOUGH || saved.has(sector) || want.avoidSectors.includes(sector))
      continue;
    const label = sectorLabels[sector];
    offer(
      `avoid:${sector}`,
      `You passed on ${n} ${label.toLowerCase()} jobs. Leave ${label.toLowerCase()} out?`,
      { ...want, avoidSectors: [...want.avoidSectors, sector] }
    );
  }
  for (const [sector, n] of [...saved].sort((a, b) => b[1] - a[1])) {
    if (n < ENOUGH || passed.has(sector) || want.likeSectors.includes(sector))
      continue;
    const label = sectorLabels[sector];
    offer(
      `like:${sector}`,
      `You saved ${n} ${label.toLowerCase()} jobs. Rank them higher?`,
      { ...want, likeSectors: [...want.likeSectors, sector] }
    );
  }
  const office = marks.filter(
    (m) => m.remote === 'onsite' || m.remote === 'hybrid'
  );
  if (
    want.workplaces.length === 0 &&
    office.length >= ENOUGH &&
    office.every((m) => m.state === 'not_interested')
  ) {
    offer(
      'workplace:remote',
      `You passed on all ${office.length} office and hybrid jobs. Show only remote ones?`,
      { ...want, workplaces: ['remote_global', 'remote_region'] }
    );
  }
  return found.slice(0, 3);
};
