import { Seniority } from '@repo/api';
import { noFilters, type JobFilters } from '@repo/job-board/filters';
import { Schema } from 'effect';

/** The job filters search_jobs and match_jobs take, as tool parameters. */
export const Filters = {
  query: Schema.optional(Schema.String).annotate({
    description:
      'Words that must each start a word of the title, company, place or skills',
  }),
  where: Schema.optional(
    Schema.Literals(['remote', 'anywhere', 'onsite'])
  ).annotate({
    description:
      'remote (any remote), anywhere (remote worldwide), onsite (office or hybrid)',
  }),
  seniority: Schema.optional(Seniority),
  min_salary: Schema.optional(Schema.Number).annotate({
    description: 'Least yearly pay in USD; jobs that state no pay are left out',
  }),
  limit: Schema.optional(Schema.Number).annotate({
    description: 'How many to return (default 20, at most 100)',
  }),
};

type FilterInput = {
  query?: string | undefined;
  where?: JobFilters['where'] | undefined;
  seniority?: JobFilters['seniority'] | undefined;
  min_salary?: number | undefined;
  limit?: number | undefined;
};

export const filtersOf = (i: FilterInput): JobFilters => ({
  ...noFilters,
  query: i.query ?? '',
  where: i.where ?? null,
  seniority: i.seniority && i.seniority !== 'unspecified' ? i.seniority : null,
  minSalary: i.min_salary ?? null,
});
export const limitOf = (i: FilterInput) =>
  Math.min(Math.max(i.limit ?? 20, 1), 100);
