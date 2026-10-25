import {
  type LiHTMLAttributes,
  type OlHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import * as s from './steps.css';

export interface StepsProps extends OlHTMLAttributes<HTMLOListElement> {
  /**
   * 'horizontal' lays steps out in columns from md up; 'vertical' keeps one
   * column with the numbers beside the copy, for narrow spaces.
   */
  layout?: 'horizontal' | 'vertical';
}

/** An ordered "how it works" sequence; numbers come from the list order. */
export function Steps({
  layout = 'horizontal',
  className,
  ...props
}: StepsProps) {
  return (
    <ol
      className={cx(s.steps, layout === 'vertical' && s.vertical, className)}
      {...props}
    />
  );
}

export interface StepProps
  extends Omit<LiHTMLAttributes<HTMLLIElement>, 'title'> {
  title: ReactNode;
  /** Heading level for the title. Defaults to 3. */
  level?: 2 | 3 | 4;
}

/** One step: a number, a short title and a sentence or two. */
export function Step({
  title,
  level = 3,
  className,
  children,
  ...props
}: StepProps) {
  const Tag = `h${level}` as const;
  return (
    <li className={cx(s.step, className)} {...props}>
      <Tag className={s.title}>{title}</Tag>
      {children ? <div className={s.body}>{children}</div> : null}
    </li>
  );
}
