import type { ReactNode } from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { Badge } from '../display/display';
import * as s from './data.css';

export interface CheckResult {
  status: 'pass' | 'warn' | 'fail';
  title: ReactNode;
  description?: ReactNode;
}

export interface ChecklistProps {
  items: CheckResult[];
  /** Show pass / warn / fail counts above the list. */
  summary?: boolean;
  label?: string;
}

const statusWord = { pass: 'Passed', warn: 'Warning', fail: 'Failed' } as const;

const icons = {
  pass: <path d="m6.5 10.5 2.5 2.5 4.5-5.5" />,
  warn: <path d="M10 6.5v4M10 13.5h.01" />,
  fail: <path d="m7.5 7.5 5 5M12.5 7.5l-5 5" />,
};

/** Results of a set of checks (ATS checks, validations), each with its outcome. */
export function Checklist({
  items,
  summary = false,
  label = 'Results',
}: ChecklistProps) {
  const count = (st: CheckResult['status']) =>
    items.filter((i) => i.status === st).length;
  return (
    <div>
      {summary ? (
        <div className={s.checklistSummary}>
          <Badge tone="success">{count('pass')} passed</Badge>
          <Badge tone="warning">{count('warn')} warnings</Badge>
          <Badge tone="danger">{count('fail')} failed</Badge>
        </div>
      ) : null}
      <ul className={s.checklist} aria-label={label}>
        {items.map((item, i) => (
          <li key={i} className={s.checkItem}>
            <svg
              className={s.checkIcon({ status: item.status })}
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="8" />
              {icons[item.status]}
            </svg>
            <p className={s.checkTitle}>
              <span className={visuallyHidden}>
                {statusWord[item.status]}:{' '}
              </span>
              {item.title}
            </p>
            {item.description ? (
              <p className={s.checkText}>{item.description}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
