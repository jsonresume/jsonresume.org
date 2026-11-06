import type { Draft } from './draft';
import {
  evidenceWeight,
  seniorityLevel,
  timeline,
  type GraphInputs,
} from './inputs';

const FOUNDATION_SECTIONS = new Set(['education', 'certificates']);

const years = (start: number | null, end: number | null) =>
  start === null ? null : `${start}–${end === null ? 'now' : end}`;

/**
 * The resume's side: foundations (education, certificates, languages),
 * the skills it shows, the work and projects showing them, its strengths.
 * Returns the skills shown, by id, with their node.
 */
export const buildYou = (g: Draft, input: GraphInputs) => {
  const { insight, year } = input;
  const time = timeline(insight, year);
  const entryNode = new Map<string, number>();

  for (const f of insight.foundations) {
    const entry = insight.entries.find((e) => e.key === f.key);
    entryNode.set(
      f.key,
      g.add({
        id: `foundation:${f.key}`,
        kind: 'foundation',
        label: f.label,
        detail: f.detail,
        tone: 'success',
        levels: {
          meaning: 0,
          time:
            typeof entry?.startYear === 'number'
              ? time.span(entry.startYear)
              : null,
        },
      })
    );
  }

  for (const e of insight.entries) {
    if (FOUNDATION_SECTIONS.has(e.section) || entryNode.has(e.key)) continue;
    const span = years(e.startYear, e.endYear);
    entryNode.set(
      e.key,
      g.add({
        id: `evidence:${e.key}`,
        kind: 'evidence',
        label: e.label,
        detail: [e.detail, span].filter(Boolean).join(' · ') || null,
        tone: 'closable',
        levels: {
          meaning: 2,
          seniority: seniorityLevel(e.seniority),
          time: time.span(e.startYear ?? e.endYear ?? year),
        },
        year: e.endYear ?? year,
      })
    );
  }

  // Skills, each first shown where its earliest entry began.
  const have = new Map<number, number>();
  const firstYear = new Map<number, number>();
  for (const ev of insight.evidence) {
    const start = insight.entries.find((e) => e.key === ev.entry)?.startYear;
    if (typeof start === 'number') {
      const was = firstYear.get(ev.skill.id);
      firstYear.set(
        ev.skill.id,
        was === undefined ? start : Math.min(was, start)
      );
    }
  }
  for (const ev of insight.evidence) {
    const id = ev.skill.id;
    const first = firstYear.get(id);
    const node = g.add({
      id: `skill:${id}`,
      kind: 'skill',
      label: ev.skill.name,
      detail: 'Shown on your resume',
      tone: 'success',
      levels: {
        meaning: 1,
        distance: 0,
        time: first === undefined ? 0 : time.span(first),
      },
    });
    have.set(id, node);
    g.link(
      node,
      entryNode.get(ev.entry),
      evidenceWeight(ev.strength, ev.lastYear, year),
      ev.quote
    );
  }

  const strengths = insight.strengths.map((s, i) => {
    const node = g.add({
      id: `strength:${i}`,
      kind: 'strength',
      label: s.name,
      detail: s.summary,
      tone: 'success',
      levels: { meaning: 3 },
    });
    for (const key of s.entries) g.link(entryNode.get(key), node, 1, s.summary);
    return { node, strength: s };
  });

  return { have, entryNode, strengths, time };
};
