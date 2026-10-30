import type { CareerTree, CareerTreeNode } from '@repo/api';
import { familyOf } from './directions';
import { experiences } from './experiences';
import type { Ranked } from './ranking';
import { isSkill, mentions, resumeSkillNames, skillKey } from './skillKeys';

/** The best-fitting jobs the tree shows, and the least fit to make it. */
const JOBS = 40;
const MIN_FIT = 50;
/** Missing skills shown: those the most of these jobs ask for. */
const GAPS = 14;
/** Experiences a direction rests on, at most: those sharing most skills. */
const EVIDENCE = 4;

const jobTone = (r: Ranked): CareerTreeNode['tone'] =>
  r.mark === 'applied'
    ? 'active'
    : r.score >= 85
    ? 'success'
    : r.score >= 70
    ? 'closable'
    : 'open';

/**
 * Where a resume could go, as a tree of what rests on what: your skills
 * at the bottom (amber where jobs ask for one you don't show), your work
 * and projects on the skills they used, kinds of role on the experience
 * that leads to them, and the best-fitting jobs on top, each on its kind
 * of role and the skills it asks for.
 */
export const careerTree = (
  ranked: ReadonlyArray<Ranked>,
  resume: unknown
): CareerTree => {
  const jobs = [...ranked]
    .filter((r) => r.mark !== 'not_interested' && r.score >= MIN_FIT)
    .sort((a, b) => b.score - a.score)
    .slice(0, JOBS);
  const have = resumeSkillNames(resume);
  const asked = jobs.map(
    (r) =>
      new Set(r.row.posting.skills.map((s) => skillKey(s.name)).filter(isSkill))
  );
  const askedName = new Map(
    jobs.flatMap((r) =>
      r.row.posting.skills.map((s) => [skillKey(s.name), s.name] as const)
    )
  );
  const demand = new Map<string, number>();
  for (const keys of asked)
    for (const k of keys) demand.set(k, (demand.get(k) ?? 0) + 1);
  const gaps = [...demand.entries()]
    .filter(([k, n]) => !have.has(k) && n >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, GAPS)
    .map(([k]) => k);

  const nodes: CareerTreeNode[] = [];
  const edges: { from: number; to: number }[] = [];
  const index = new Map<string, number>();
  const node = (n: CareerTreeNode) => {
    const found = index.get(n.id);
    if (found !== undefined) return found;
    index.set(n.id, nodes.length);
    nodes.push(n);
    return nodes.length - 1;
  };
  const skillNode = (key: string) =>
    have.has(key)
      ? node({
          id: `skill:${key}`,
          kind: 'skill',
          label: have.get(key) ?? key,
          detail: demand.has(key)
            ? `${demand.get(key)} of these jobs ask for it`
            : 'On your resume',
          tone: 'success',
          jobId: null,
          score: null,
        })
      : node({
          id: `skill:${key}`,
          kind: 'gap',
          label: askedName.get(key) ?? key,
          detail: `${demand.get(
            key
          )} of these jobs ask for it; your resume doesn’t show it`,
          tone: 'attention',
          jobId: null,
          score: null,
        });

  // Kinds of role with one job join "Other roles".
  const familyOfJob = jobs.map((r) => familyOf(r.role ?? r.row.posting.title));
  const sizes = new Map<string, number>();
  for (const f of familyOfJob) sizes.set(f, (sizes.get(f) ?? 0) + 1);
  const byFamily = new Map<string, number[]>();
  familyOfJob.forEach((f, i) => {
    const family = (sizes.get(f) ?? 0) >= 2 ? f : 'Other roles';
    byFamily.set(family, [...(byFamily.get(family) ?? []), i]);
  });

  const mine = experiences(resume).map((e) => ({
    ...e,
    skills: [...have.entries()]
      .filter(([key, name]) => mentions(e.text, name) || mentions(e.text, key))
      .map(([key]) => key),
  }));

  for (const [family, members] of byFamily) {
    const dir = node({
      id: `direction:${family}`,
      kind: 'direction',
      label: family,
      detail: `${members.length} of your best-fitting jobs`,
      tone: 'open',
      jobId: null,
      score: null,
    });
    const wanted = new Set(members.flatMap((i) => [...(asked[i] ?? [])]));
    const evidence = mine
      .map((e, i) => ({
        i,
        e,
        shared: e.skills.filter((k) => wanted.has(k)),
      }))
      .filter((x) => x.shared.length >= 2)
      .sort((a, b) => b.shared.length - a.shared.length)
      .slice(0, EVIDENCE);
    evidence.forEach(({ i, e, shared }) => {
      const exp = node({
        id: `experience:${i}`,
        kind: 'experience',
        label: e.label,
        detail: e.detail,
        tone: 'closable',
        jobId: null,
        score: null,
      });
      edges.push({ from: exp, to: dir });
      for (const k of shared) edges.push({ from: skillNode(k), to: exp });
    });
    // With no experience to show for it, it rests on the skills it asks
    // for that you have, so it still sits above them.
    if (evidence.length === 0) {
      [...wanted]
        .filter((k) => have.has(k))
        .sort((a, b) => (demand.get(b) ?? 0) - (demand.get(a) ?? 0))
        .slice(0, 3)
        .forEach((k) => edges.push({ from: skillNode(k), to: dir }));
    }
    for (const i of members) {
      const r = jobs[i];
      if (!r) continue;
      const p = r.row.posting;
      const job = node({
        id: `job:${r.row.id}`,
        kind: 'job',
        label: p.company || p.title,
        detail: `${r.role ?? p.title} · ${r.score}% fit`,
        tone: jobTone(r),
        jobId: r.row.id,
        score: r.score,
      });
      edges.push({ from: dir, to: job });
      for (const k of asked[i] ?? []) {
        if (have.has(k) || gaps.includes(k))
          edges.push({ from: skillNode(k), to: job });
      }
    }
  }
  const unique = new Map(edges.map((e) => [`${e.from}>${e.to}`, e]));
  return { nodes, edges: [...unique.values()] };
};
