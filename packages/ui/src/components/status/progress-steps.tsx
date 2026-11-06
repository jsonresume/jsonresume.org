import type { ReactNode } from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { cx } from '../../utils/cx';
import * as s from './progress-steps.css';

export type ProgressStepState = 'done' | 'active' | 'waiting';

export interface ProgressStep {
  id: string;
  label: ReactNode;
  /** A line under it: how long it usually takes, or what it found. */
  detail?: ReactNode;
  state: ProgressStepState;
}

export interface ProgressStepsProps {
  steps: ReadonlyArray<ProgressStep>;
  /** Names the list for assistive technology. */
  label?: string;
  className?: string;
}

const spoken: Record<ProgressStepState, string> = {
  done: 'Done',
  active: 'Under way',
  waiting: 'Still to come',
};

const tick = (
  <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
    <path
      d="m2.5 6.25 2.25 2.25 4.75-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * What a long wait is doing, step by step: each done, under way or still to
 * come. For work the system does (not tasks for the person, see TaskList);
 * put it in a live region so changes are announced.
 */
export function ProgressSteps({
  steps,
  label = 'Progress',
  className,
}: ProgressStepsProps) {
  return (
    <ol className={cx(s.list, className)} aria-label={label}>
      {steps.map((step) => (
        <li key={step.id} className={s.step}>
          <span className={s.marks[step.state]} aria-hidden="true">
            {step.state === 'done' ? tick : null}
          </span>
          <span className={s.titles[step.state]}>
            <span className={visuallyHidden}>{spoken[step.state]}: </span>
            {step.label}
          </span>
          {step.detail ? <p className={s.detail}>{step.detail}</p> : null}
        </li>
      ))}
    </ol>
  );
}
