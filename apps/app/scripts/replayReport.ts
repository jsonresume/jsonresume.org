import type { JobDecision, Verdict } from '@repo/api';
import { auc, precisionAt, type Labeled } from '@repo/jobs';

/** One replayed decision: what they did, and what each ranking said. */
export interface Row {
  id: number;
  company: string;
  title: string;
  liked: boolean;
  cosine: number;
  /** Today's ranking: the model's fit (else the cosine's), capped by level, pay and place. */
  engine: number;
  /** Toward the stated direction, as a z-score among these jobs. */
  toward: number;
  /** The decision model with no preferences stated. */
  plain: JobDecision;
  /** The decision model with the preferences the roadmap wrote down. */
  stated: JobDecision;
}

const fmt = (n: number | null) => (n === null ? '–' : n.toFixed(2));
const pct = (n: number | null) =>
  n === null ? '–' : `${Math.round(n * 100)}%`;

const line = (name: string, items: ReadonlyArray<Labeled>) =>
  `| ${name} | ${fmt(auc(items))} | ${pct(precisionAt(items, 10))} | ${pct(
    precisionAt(items, 20)
  )} |`;

const VERDICTS: ReadonlyArray<Verdict> = [
  'apply',
  'stretch',
  'skip',
  'ruled_out',
];

const verdicts = (rows: ReadonlyArray<Row>, pick: (r: Row) => JobDecision) =>
  VERDICTS.map((v) => {
    const these = rows.filter((r) => pick(r).verdict === v);
    const liked = these.filter((r) => r.liked).length;
    return `| ${v} | ${these.length} | ${liked} | ${
      these.length - liked
    } | ${pct(these.length ? liked / these.length : null)} |`;
  });

/** The replay as Markdown: how each ranking orders wanted above passed. */
export const report = (
  rows: ReadonlyArray<Row>,
  user: string,
  skills: number
) => {
  const liked = rows.filter((r) => r.liked).length;
  const by = (score: (r: Row) => number) =>
    rows.map((r) => ({ score: score(r), liked: r.liked }));
  // Ruled-out jobs go last, whatever their value.
  const ranked = (pick: (r: Row) => JobDecision) => (r: Row) =>
    pick(r).verdict === 'ruled_out' ? -1 + pick(r).value / 1000 : pick(r).value;
  const ruledOutLiked = rows.filter(
    (r) => r.liked && r.stated.verdict === 'ruled_out'
  );
  return [
    `# Replay: ${user}'s decisions`,
    '',
    `${rows.length} decisions (${liked} saved or applied, ${
      rows.length - liked
    } passed on); the resume shows ${skills} skills.`,
    '',
    '| Ranking | AUC | Wanted in top 10 | Wanted in top 20 |',
    '| --- | --- | --- | --- |',
    line(
      'Cosine (embeddings)',
      by((r) => r.cosine)
    ),
    line(
      "Today's engine (fit, capped)",
      by((r) => r.engine)
    ),
    line(
      'Chance only',
      by((r) => r.plain.chance)
    ),
    line('Decision, no preferences', by(ranked((r) => r.plain))),
    line(
      'Appeal only, stated preferences',
      by((r) => r.stated.appeal)
    ),
    line('Decision, stated preferences', by(ranked((r) => r.stated))),
    '',
    `Base rate: ${pct(liked / rows.length)} of these jobs were wanted.`,
    '',
    '## Verdicts, stated preferences',
    '',
    '| Verdict | Jobs | Wanted | Passed | Share wanted |',
    '| --- | --- | --- | --- | --- |',
    ...verdicts(rows, (r) => r.stated),
    '',
    '## Wanted, but ruled out',
    '',
    ...(ruledOutLiked.length
      ? ruledOutLiked.map(
          (r) =>
            `- ${r.company}: ${r.title}: ${r.stated.reasons[0]?.text ?? ''}`
        )
      : ['None.']),
    '',
  ].join('\n');
};
