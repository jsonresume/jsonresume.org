import type { DecidedJob } from '@repo/api';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import * as s from './decide.css';

function Bar({
  name,
  value,
  kind,
}: {
  name: string;
  value: number;
  kind: 'chance' | 'appeal';
}) {
  return (
    <div className={s.meter}>
      <span className={s.meterLabel}>
        {name}
        <span className={s.meterValue}>{value}</span>
      </span>
      <div
        className={s.track}
        role="meter"
        aria-label={name}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <div
          className={`${s.fill} ${s.fillTone[kind]}`}
          style={assignInlineVars({ [s.barWidth]: `${value}%` })}
          data-width={value}
        />
      </div>
    </div>
  );
}

/** How likely they'd get it, and how much they'd want it. */
export function Meters({ job }: { job: DecidedJob }) {
  return (
    <div className={s.meters}>
      <Bar name="Chance" value={job.decision.chance} kind="chance" />
      <Bar name="Appeal" value={job.decision.appeal} kind="appeal" />
    </div>
  );
}

const glyph = { good: '✓', bad: '✗', note: '•' } as const;
const spoken = { good: 'For it', bad: 'Against it', note: 'Note' } as const;

const ORDER = { good: 0, bad: 1, note: 2 } as const;
/** The model's line as a sentence: without its "you:" lead-in, capitalised. */
const sentence = (t: string) => {
  const line = t.trim().replace(/^you\s*:\s*/i, '');
  return line.charAt(0).toUpperCase() + line.slice(1);
};

/**
 * Why: the role in the post that fits, the model's one line, then the
 * reasons that decided it (for, against, notes); a stretch links to
 * Pathways for the gaps.
 */
export function Reasons({ job }: { job: DecidedJob }) {
  const { reasons, verdict, missing } = job.decision;
  return (
    <>
      {job.role && job.role !== job.title ? (
        <span className={s.roleLabel}>Your role here: {job.role}</span>
      ) : null}
      {job.why ? <span className={s.why}>{sentence(job.why)}</span> : null}
      <ul className={s.reasons} aria-label="Why">
        {[...reasons]
          .sort((a, b) => ORDER[a.tone] - ORDER[b.tone])
          .map((r) => (
            <li key={`${r.factor}${r.text}`} className={s.reason}>
              <span className={s.mark[r.tone]} aria-label={spoken[r.tone]}>
                {glyph[r.tone]}
              </span>
              <span>{r.text}</span>
            </li>
          ))}
      </ul>
      {verdict === 'stretch' && missing.length > 0 ? (
        <a className={s.gapLink} href="/dashboard/pathways?tab=tree">
          Plan how to close the gap →
        </a>
      ) : null}
    </>
  );
}
