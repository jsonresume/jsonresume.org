import { useAtom, useAtomSet } from '@effect/atom-react';
import {
  Button,
  Field,
  Heading,
  ProgressSteps,
  Text,
  Textarea,
} from '@jsonresume/ui';
import { useState } from 'react';
import { getAt, setAt, type Json } from '../values';
import { parseSkills, SECTIONS, skillsText, type Section } from './guided';
import { Questions } from './Questions';
import * as s from './start.css';
import { startResumeAtom, startStepAtom } from './state';

const entriesOf = (resume: Json, section: Section) => {
  const list = getAt(resume, section.path);
  return Array.isArray(list) && list.length > 0 ? list : [{}];
};

/** A section's answers: one set, or a set per entry with add and remove. */
function SectionForm({
  section,
  resume,
  onChange,
}: {
  section: Section;
  resume: Json;
  onChange: (resume: Json) => void;
}) {
  const [skills, setSkills] = useState(() =>
    skillsText(getAt(resume, ['skills']))
  );
  if (section.id === 'skills')
    return (
      <Field label="Skills">
        <Textarea
          rows={6}
          value={skills}
          placeholder={'Frontend: React, TypeScript, CSS\nLeadership'}
          onChange={(e) => {
            setSkills(e.target.value);
            onChange(setAt(resume, ['skills'], parseSkills(e.target.value)));
          }}
        />
      </Field>
    );
  if (!section.list)
    return (
      <Questions
        questions={section.questions}
        resume={resume}
        base={section.path}
        onChange={onChange}
      />
    );
  const entries = entriesOf(resume, section);
  const withEntries = (list: ReadonlyArray<Json>) =>
    onChange(setAt(resume, section.path, list));
  return (
    <>
      {entries.map((_, i) => (
        <div key={i} className={s.entry}>
          <Questions
            questions={section.questions}
            resume={setAt(resume, section.path, entries)}
            base={[...section.path, i]}
            onChange={onChange}
          />
          {entries.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => withEntries(entries.filter((__, j) => j !== i))}
            >
              Remove
            </Button>
          )}
        </div>
      ))}
      <div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => withEntries([...entries, {}])}
        >
          Add another
        </Button>
      </div>
    </>
  );
}

/** The resume from scratch (or an import's gaps), a section at a time. */
export function Guided() {
  const [resume, setResume] = useAtom(startResumeAtom);
  const setStep = useAtomSet(startStepAtom);
  const [at, setIndex] = useState(0);
  const section = SECTIONS[at] ?? SECTIONS[0];
  if (!section) return null;
  const last = at === SECTIONS.length - 1;
  return (
    <>
      <ProgressSteps
        label="Sections"
        steps={SECTIONS.map((x, i) => ({
          id: x.id,
          label: x.title,
          state: i < at ? 'done' : i === at ? 'active' : 'waiting',
        }))}
      />
      <Heading level={2} size="subsection">
        {section.title}
      </Heading>
      <Text size="sm" tone="muted">
        {section.intro} Every question is optional.
      </Text>
      <SectionForm
        key={section.id}
        section={section}
        resume={resume}
        onChange={setResume}
      />
      <div className={s.actions}>
        <Button
          variant="primary"
          onClick={() => (last ? setStep('preview') : setIndex(at + 1))}
        >
          {last ? 'See it in a theme' : 'Next'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => (at === 0 ? setStep('choose') : setIndex(at - 1))}
        >
          Back
        </Button>
      </div>
    </>
  );
}
