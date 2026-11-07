import { Accounts } from '@repo/accounts';
import { Variants, type Variant } from '@repo/resume-versions';
import { Effect, Predicate, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { caller, describe, failing, failWith, hints } from './context';
import { Count, optional } from './params';

const SITE = 'https://jsonresume.org';

const Slug = Schema.String.annotate({ description: 'The variant’s slug' });
const VariantInfo = Schema.Struct({
  slug: Schema.String,
  name: Schema.String,
  job_id: Schema.NullOr(Schema.Number),
  url: Schema.String,
  updated_at: Schema.String,
});
const WithResume = Schema.Struct({
  ...VariantInfo.fields,
  resume: Schema.Unknown,
});

const info = (username: string, v: Variant) => ({
  slug: v.slug,
  name: v.name,
  job_id: v.jobId,
  url: `${SITE}/@${username}/${v.slug}`,
  updated_at: v.updatedAt.toISOString(),
});
const isObject = (r: unknown) => Predicate.isObject(r) && !Array.isArray(r);

export const VariantToolkit = Toolkit.make(
  Tool.make('list_variants', {
    description: describe('list_variants'),
    success: Schema.Struct({ variants: Schema.Array(VariantInfo) }),
    ...failing,
  }).annotateMerge(hints('list_variants')),
  Tool.make('create_variant', {
    description: describe('create_variant'),
    parameters: Schema.Struct({
      name: Schema.String.annotate({
        description: 'What it is for: "Acme, Platform Engineer"',
      }),
      job_id: optional(
        Count,
        'The job it is for, from search_jobs or match_jobs'
      ),
      resume: optional(
        Schema.Unknown,
        'The resume to start from; your resume when left out'
      ),
    }),
    success: WithResume,
    ...failing,
  }).annotateMerge(hints('create_variant', true)),
  Tool.make('get_variant', {
    description: describe('get_variant'),
    parameters: Schema.Struct({ slug: Slug }),
    success: WithResume,
    ...failing,
  }).annotateMerge(hints('get_variant')),
  Tool.make('save_variant', {
    description: describe('save_variant'),
    parameters: Schema.Struct({ slug: Slug, resume: Schema.Unknown }),
    success: VariantInfo,
    ...failing,
  }).annotateMerge(hints('save_variant', true)),
  Tool.make('delete_variant', {
    description: describe('delete_variant'),
    parameters: Schema.Struct({ slug: Slug }),
    success: Schema.Struct({ deleted: Schema.Boolean }),
    ...failing,
  }).annotateMerge(hints('delete_variant', true))
);

/** Needs Variants and Accounts. */
export const VariantHandlers = VariantToolkit.toLayer(
  Effect.gen(function* () {
    const variants = yield* Variants;
    const accounts = yield* Accounts;
    return {
      list_variants: () =>
        Effect.gen(function* () {
          const user = yield* caller;
          const list = yield* variants.list(user.id);
          return { variants: list.map((v) => info(user.username, v)) };
        }),
      create_variant: ({ name, job_id, resume }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          const base =
            resume ?? (yield* accounts.currentResume(user.id)).resume;
          if (!isObject(base))
            return yield* failWith(
              'There is no resume to copy yet: save one with save_resume, or pass resume.'
            );
          const made = yield* variants
            .create(user.id, { name, resume: base, jobId: job_id ?? null })
            .pipe(Effect.mapError((e) => failWith(e.reason)));
          return { ...info(user.username, made), resume: made.resume };
        }),
      get_variant: ({ slug }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          const found = yield* variants.get(user.id, slug);
          if (!found)
            return yield* failWith(
              `No variant ${slug}; list_variants lists them.`
            );
          return { ...info(user.username, found), resume: found.resume };
        }),
      save_variant: ({ slug, resume }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          if (!isObject(resume))
            return yield* failWith('A resume is one JSON object.');
          const saved = yield* variants
            .save(user.id, slug, resume)
            .pipe(Effect.mapError((e) => failWith(e.reason)));
          return info(user.username, saved);
        }),
      delete_variant: ({ slug }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          return { deleted: yield* variants.remove(user.id, slug) };
        }),
    };
  })
);
