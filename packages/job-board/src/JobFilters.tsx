import { useAtom, useAtomValue } from '@effect/atom-react';
import { Field, FilterBar, SearchField, Select } from '@jsonresume/ui';
import type { JobSummary } from '@repo/api';
import { useAtomsInUrl } from '@repo/url-state';
import { useMemo } from 'react';
import {
  jobFiltersAtom,
  jobPayAtom,
  jobQueryAtom,
  jobSeniorityAtom,
  jobUrlBindings,
  jobWhereAtom,
} from './atoms';
import * as s from './board.css';
import { filterJobs } from './filters';
import { seniorityLabels } from './format';

const whereOptions = [
  { value: 'remote', label: 'Remote' },
  { value: 'anywhere', label: 'Remote, anywhere' },
  { value: 'onsite', label: 'On-site or hybrid' },
];
const levelOptions = Object.entries(seniorityLabels).filter(([, l]) => l);
const payOptions = [80, 100, 150, 200, 250].map((k) => ({
  value: String(k * 1000),
  label: `$${k}k+`,
}));

const labelOf = (
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string | null
) => options.find((o) => o.value === value)?.label ?? value ?? '';

/** Jobs narrowed by the filters (which live in the URL). */
export function useFilteredJobs<J extends JobSummary>(
  jobs: ReadonlyArray<J>
): J[] {
  useAtomsInUrl(jobUrlBindings);
  const filters = useAtomValue(jobFiltersAtom);
  return useMemo(() => filterJobs(jobs, filters), [jobs, filters]);
}

/** Search, where, level and pay, with the active filters as removable chips. */
export function JobFilterBar({ resultCount }: { resultCount: number }) {
  const [query, setQuery] = useAtom(jobQueryAtom);
  const [where, setWhere] = useAtom(jobWhereAtom);
  const [level, setLevel] = useAtom(jobSeniorityAtom);
  const [pay, setPay] = useAtom(jobPayAtom);
  const levels = levelOptions.map(([value, label]) => ({ value, label }));
  const chip = (
    key: string,
    value: string | null,
    label: string,
    clear: () => void
  ) => (value ? [{ key, label, onRemove: clear }] : []);

  return (
    <FilterBar
      className={s.filters}
      label="Filter jobs"
      resultCount={resultCount}
      resultLabel={(n) => `${n} ${n === 1 ? 'job' : 'jobs'}`}
      active={[
        ...chip('q', query || null, `“${query}”`, () => setQuery('')),
        ...chip('where', where, labelOf(whereOptions, where), () =>
          setWhere(null)
        ),
        ...chip('level', level, labelOf(levels, level), () => setLevel(null)),
        ...chip('pay', pay, labelOf(payOptions, pay), () => setPay(null)),
      ]}
      onClearAll={() => {
        setQuery('');
        setWhere(null);
        setLevel(null);
        setPay(null);
      }}
    >
      <Field label="Search" className={s.search}>
        <SearchField
          value={query}
          onValueChange={setQuery}
          placeholder="Role, company, skill or place"
        />
      </Field>
      {(
        [
          ['Where', where, setWhere, whereOptions, 'Anywhere'],
          ['Level', level, setLevel, levels, 'Any level'],
          ['Pay', pay, setPay, payOptions, 'Any pay'],
        ] as const
      ).map(([label, value, set, options, any]) => (
        <Field key={label} label={label}>
          <Select
            inline
            value={value ?? ''}
            onChange={(e) => set(e.target.value || null)}
          >
            <option value="">{any}</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      ))}
    </FilterBar>
  );
}
