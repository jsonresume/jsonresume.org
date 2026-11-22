import { Field, Input, Switch, Textarea, TagInput } from '@jsonresume/ui';
import {
  priorityLabels,
  sectorLabels,
  stageLabels,
  workplaceLabels,
  type CompanyStage,
  type EmploymentType,
  type JobPreferences,
  type Priority,
  type Sector,
  type Seniority,
  type Workplace,
} from '@repo/api';
import { employmentLabels, seniorityLabels } from '@repo/job-board';
import type { ReactNode } from 'react';
import { ChoiceChips } from './ChoiceChips';
import * as s from './wants.css';

const options = <T extends string>(labels: Record<T, string>) =>
  (Object.keys(labels) as T[])
    .filter((k) => labels[k] !== '')
    .map((value) => ({ value, label: labels[value] }));

const workplaces = options<Workplace>(workplaceLabels);
const sectors = options<Sector>(sectorLabels);
const stages = options<CompanyStage>(stageLabels);
const priorities = options<Priority>(priorityLabels);
const employment = options<EmploymentType>(employmentLabels);
const levels = options<Seniority>(seniorityLabels);

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className={s.section}>
      <h3 className={s.sectionTitle}>{title}</h3>
      {hint ? <p className={s.sectionHint}>{hint}</p> : null}
      {children}
    </section>
  );
}

const thousands = (n: number | null) =>
  n === null ? '' : String(Math.round(n / 1000));
const fromThousands = (text: string) => {
  const n = Number(text.replace(/[^0-9.]/g, ''));
  return text.trim() === '' || !Number.isFinite(n) || n <= 0 ? null : n * 1000;
};

/** Every preference, grouped: dealbreakers first, then what weighs. */
export function PreferencesForm({
  value,
  onChange,
}: {
  value: JobPreferences;
  onChange: (value: JobPreferences) => void;
}) {
  const set =
    <K extends keyof JobPreferences>(key: K) =>
    (v: JobPreferences[K]) =>
      onChange({ ...value, [key]: v });
  return (
    <>
      <Section
        title="Where you’ll work"
        hint="Jobs elsewhere are ruled out. The first you pick is your favourite."
      >
        <ChoiceChips
          label="Workplaces"
          options={workplaces}
          value={value.workplaces}
          onChange={set('workplaces')}
        />
      </Section>
      <Section
        title="Pay"
        hint="Yearly, in thousands of US dollars. A job that states less than your floor is ruled out."
      >
        <div className={s.pair}>
          <Field label="Floor ($k)">
            <Input
              inputMode="numeric"
              value={thousands(value.payFloor)}
              onChange={(e) => set('payFloor')(fromThousands(e.target.value))}
            />
          </Field>
          <Field label="Target ($k)">
            <Input
              inputMode="numeric"
              value={thousands(value.payTarget)}
              onChange={(e) => set('payTarget')(fromThousands(e.target.value))}
            />
          </Field>
        </div>
      </Section>
      <Section title="Kind of work" hint="Leave empty to take any.">
        <ChoiceChips
          label="Employment"
          options={employment}
          value={value.employment}
          onChange={set('employment')}
        />
        <ChoiceChips
          label="Levels"
          options={levels}
          value={value.levels}
          onChange={set('levels')}
        />
      </Section>
      <Section title="Industries to leave out">
        <ChoiceChips
          label="Industries to leave out"
          options={sectors}
          value={value.avoidSectors}
          onChange={set('avoidSectors')}
        />
      </Section>
      <Section title="Industries you’d love">
        <ChoiceChips
          label="Industries you’d love"
          options={sectors}
          value={value.likeSectors}
          onChange={set('likeSectors')}
        />
      </Section>
      <Section title="Company stage">
        <ChoiceChips
          label="Company stages"
          options={stages}
          value={value.stages}
          onChange={set('stages')}
        />
      </Section>
      <Section
        title="The tech"
        hint="Skills you want to use rank a job higher; a required one you’d rather not use rules it out."
      >
        <Field label="Want to use">
          <TagInput
            value={[...value.wantSkills]}
            onValueChange={set('wantSkills')}
          />
        </Field>
        <Field label="Rather not use">
          <TagInput
            value={[...value.avoidSkills]}
            onValueChange={set('avoidSkills')}
          />
        </Field>
      </Section>
      <Section
        title="Where you want to go"
        hint="In your words: jobs closer to it rank higher. Left empty, the objective in your resume counts instead."
      >
        <Field label="Direction">
          <Textarea
            rows={2}
            maxLength={500}
            value={value.direction}
            placeholder="Leading a small team building AI tools for developers"
            onChange={(e) => set('direction')(e.target.value)}
          />
        </Field>
      </Section>
      <Section
        title="What matters most"
        hint="Up to three, most important first: they count for more."
      >
        <ChoiceChips
          label="Priorities"
          options={priorities}
          value={value.priorities}
          onChange={set('priorities')}
          most={3}
        />
      </Section>
      <Section title="Visa">
        <Switch
          label="I need a visa sponsored"
          checked={value.needsVisa}
          onCheckedChange={set('needsVisa')}
        />
      </Section>
    </>
  );
}
