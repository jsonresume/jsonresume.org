import { cx, Field, Input, Textarea } from '@jsonresume/ui';
import { Predicate } from 'effect';
import { getAt, setAt, type Json, type Path } from '../values';
import type { Question } from './guided';
import * as s from './start.css';

const asText = (value: Json, kind: Question['kind']) =>
  kind === 'lines'
    ? (Array.isArray(value) ? value : []).filter(Predicate.isString).join('\n')
    : Predicate.isString(value)
    ? value
    : '';

/** One set of answers (the basics, or one job) at `base` in the resume. */
export function Questions({
  questions,
  resume,
  base,
  onChange,
}: {
  questions: ReadonlyArray<Question>;
  resume: Json;
  base: Path;
  onChange: (resume: Json) => void;
}) {
  return (
    <div className={s.fields}>
      {questions.map((q) => {
        const path = [...base, q.key];
        const value = asText(getAt(resume, path), q.kind);
        const set = (text: string) =>
          onChange(
            setAt(resume, path, q.kind === 'lines' ? text.split('\n') : text)
          );
        return (
          <Field key={q.key} label={q.label} className={cx(q.wide && s.wide)}>
            {q.kind ? (
              <Textarea
                value={value}
                placeholder={q.example}
                rows={q.kind === 'lines' ? 4 : 3}
                onChange={(e) => set(e.target.value)}
              />
            ) : (
              <Input
                value={value}
                placeholder={q.example}
                onChange={(e) => set(e.target.value)}
              />
            )}
          </Field>
        );
      })}
    </div>
  );
}
