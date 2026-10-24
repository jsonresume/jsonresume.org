import type { Seniority } from '@repo/api';
import { optionParam, textParam } from '@repo/url-state';
import { Atom } from 'effect/reactivity';
import type { JobFilters, WhereFilter } from './filters';
import { seniorityLabels } from './format';

/** The filters as strings, each kept in the URL (?q=, ?where=, ?level=, ?pay=). */
export const jobQueryAtom = Atom.make('');
export const jobWhereAtom = Atom.make<string | null>(null);
export const jobSeniorityAtom = Atom.make<string | null>(null);
export const jobPayAtom = Atom.make<string | null>(null);

export const jobUrlBindings = [
  textParam('q', jobQueryAtom),
  optionParam('where', jobWhereAtom),
  optionParam('level', jobSeniorityAtom),
  optionParam('pay', jobPayAtom),
];

const wheres: ReadonlyArray<string> = ['remote', 'anywhere', 'onsite'];
const isWhere = (v: string | null): v is WhereFilter =>
  v !== null && wheres.includes(v);
const isSeniority = (v: string | null): v is Seniority =>
  v !== null && v !== 'unspecified' && v in seniorityLabels;

/** The filters, read from the strings; anything unknown is ignored. */
export const jobFiltersAtom = Atom.make((get): JobFilters => {
  const where = get(jobWhereAtom);
  const seniority = get(jobSeniorityAtom);
  const pay = Number(get(jobPayAtom));
  return {
    query: get(jobQueryAtom),
    where: isWhere(where) ? where : null,
    seniority: isSeniority(seniority) ? seniority : null,
    minSalary: Number.isFinite(pay) && pay > 0 ? pay : null,
  };
});
