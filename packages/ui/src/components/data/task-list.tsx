import { assignInlineVars } from '@vanilla-extract/dynamic';
import type { ReactNode } from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import * as s from './task-list.css';

export interface Task {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  done: boolean;
  /** Not needed to finish: shown with an "Optional" note and left out of the count. */
  optional?: boolean;
  /** What to do next: usually a small button or link. Hidden once done. */
  action?: ReactNode;
}

export interface TaskListProps {
  tasks: Task[];
  /** Names the list for assistive technology. */
  label?: string;
  /** Show "2 of 4 done" with a bar above the list. */
  progress?: boolean;
}

const tick = (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path
      d="m2.5 6.25 2.25 2.25 4.75-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Steps someone works through once, such as setting up an account: each
 * done or to do, with the action that does it.
 */
export function TaskList({
  tasks,
  label = 'Tasks',
  progress = false,
}: TaskListProps) {
  const required = tasks.filter((t) => !t.optional);
  const done = required.filter((t) => t.done).length;
  return (
    <div>
      {progress ? (
        <div className={s.progress}>
          <span>
            {done} of {required.length} done
          </span>
          <span className={s.track} aria-hidden="true">
            <span
              className={s.fill}
              style={assignInlineVars({
                [s.filled]: `${(done / Math.max(required.length, 1)) * 100}%`,
              })}
            />
          </span>
        </div>
      ) : null}
      <ol className={s.list} aria-label={label}>
        {tasks.map((task, i) => (
          <li key={task.id} className={s.item}>
            <span className={s.marker({ done: task.done })} aria-hidden="true">
              {task.done ? tick : i + 1}
            </span>
            <p className={s.title({ done: task.done })}>
              <span className={visuallyHidden}>
                {task.done ? 'Done: ' : 'To do: '}
              </span>
              {task.title}
              {task.optional ? (
                <span className={s.optional}>Optional</span>
              ) : null}
            </p>
            {task.description ? (
              <p className={s.text}>{task.description}</p>
            ) : null}
            {task.action && !task.done ? (
              <div className={s.action}>{task.action}</div>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
