import { useAtom, useAtomSet, useAtomValue } from '@effect/atom-react';
import { Button, Callout, Field, Heading, Input, Text } from '@jsonresume/ui';
import { Predicate } from 'effect';
import { getAt, setAt, type Json } from '../values';
import { pathOf, pointerLabel } from './pointer';
import * as s from './start.css';
import { startImportAtom, startResumeAtom, startStepAtom } from './state';

const count = (resume: Json, key: string) => {
  const list = Predicate.isObject(resume) ? resume[key] : undefined;
  return Array.isArray(list) ? list.length : 0;
};

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

/** One line on what the import found, to recognise it at a glance. */
export const foundSummary = (resume: Json) => {
  const name = getAt(resume, ['basics', 'name']);
  return [
    Predicate.isString(name) && name ? name : 'No name found',
    plural(count(resume, 'work'), 'job', 'jobs'),
    plural(count(resume, 'education'), 'school', 'schools'),
    plural(count(resume, 'skills'), 'skill group', 'skill groups'),
  ].join(' · ');
};

/**
 * What an import found, with the fields it was unsure of first: a guess
 * ("low") before a likely ("medium"), each editable in place.
 */
export function Review() {
  const result = useAtomValue(startImportAtom);
  const [resume, setResume] = useAtom(startResumeAtom);
  const setStep = useAtomSet(startStepAtom);
  const unsure = Object.entries(result?.confidence ?? {})
    .filter(([, level]) => level !== 'high')
    .filter(([pointer]) => Predicate.isString(getAt(resume, pathOf(pointer))))
    .sort(([, a], [, b]) => (a === b ? 0 : a === 'low' ? -1 : 1));
  const warnings = result?.warnings ?? [];

  return (
    <>
      <Heading level={2} size="subsection">
        Check what we found
      </Heading>
      <p className={s.summary}>{foundSummary(resume)}</p>
      {unsure.length === 0 ? (
        <Callout tone="success">
          Everything read cleanly. You can change any of it later.
        </Callout>
      ) : (
        <>
          <Text size="sm" tone="muted">
            We were less sure of these. Fix anything that’s wrong; the rest you
            can change later.
          </Text>
          <div className={s.fields}>
            {unsure.map(([pointer, level]) => (
              <div key={pointer} className={s.unsure}>
                <Field
                  label={pointerLabel(pointer)}
                  hint={level === 'low' ? 'A guess' : 'Probably right'}
                >
                  <Input
                    value={String(getAt(resume, pathOf(pointer)))}
                    onChange={(e) =>
                      setResume(setAt(resume, pathOf(pointer), e.target.value))
                    }
                  />
                </Field>
              </div>
            ))}
          </div>
        </>
      )}
      {warnings.length > 0 && (
        <Callout tone="warning" title="Left out">
          <ul>
            {warnings.slice(0, 6).map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </Callout>
      )}
      <div className={s.actions}>
        <Button variant="primary" onClick={() => setStep('preview')}>
          Looks right
        </Button>
        <Button variant="secondary" onClick={() => setStep('guided')}>
          Fill in the gaps
        </Button>
        <Button variant="ghost" onClick={() => setStep('choose')}>
          Start over
        </Button>
      </div>
    </>
  );
}
