import schemaJson from '@jsonresume/schema/schema.json';
import { Accounts } from '@repo/accounts';
import { pathLabel, validate } from '@repo/resume-editor/validate';
import type { JsonSchemaNode } from '@repo/schema-explorer/model';
import { Effect, Predicate, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { caller, describe, failing, failWith, hints } from './context';
import { optional } from './params';

const schema = schemaJson as JsonSchemaNode;
const SITE = 'https://jsonresume.org';

export const SECTIONS = [
  'basics',
  'work',
  'volunteer',
  'education',
  'awards',
  'certificates',
  'publications',
  'skills',
  'languages',
  'interests',
  'references',
  'projects',
  'meta',
] as const;

const Resume = Schema.Record(Schema.String, Schema.Unknown).annotate({
  description: 'A JSON Resume object (https://jsonresume.org/schema)',
});
const Issues = Schema.Array(Schema.String);

/** Schema problems as "work › 0 › startDate: Should be a date…" lines. */
export const problems = (resume: unknown): string[] =>
  validate(resume, schema).map((i) => `${pathLabel(i.path)}: ${i.message}`);

const saveError = (e: { _tag: string; message?: string }) =>
  failWith(
    e._tag === 'InvalidResume'
      ? e.message ?? 'That is not a resume.'
      : e._tag === 'GistPermissionNeeded'
      ? 'Your page reads your resume from your GitHub gist, and GitHub has not let jsonresume.org write to it. Ask the user to allow it at https://jsonresume.org/dashboard/resume, or switch the source with set_resume_source.'
      : 'GitHub did not answer, so the gist was not updated. Try again in a minute.'
  );

export const ResumeToolkit = Toolkit.make(
  Tool.make('get_resume', {
    description: describe('get_resume'),
    success: Schema.Struct({
      resume: Schema.Unknown,
      source: Schema.Literals(['gist', 'stored']),
      url: Schema.String,
    }),
    ...failing,
  }).annotateMerge(hints('get_resume')),
  Tool.make('save_resume', {
    description: describe('save_resume'),
    parameters: Schema.Struct({ resume: Resume }),
    success: Schema.Struct({ saved: Schema.Boolean, problems: Issues }),
    ...failing,
  }).annotateMerge(hints('save_resume', true)),
  Tool.make('update_resume_section', {
    description: describe('update_resume_section'),
    parameters: Schema.Struct({
      section: Schema.Literals(SECTIONS),
      value: Schema.Unknown.annotate({
        description:
          'The whole section: an object for basics and meta, an array for the rest',
      }),
    }),
    success: Schema.Struct({ saved: Schema.Boolean, problems: Issues }),
    ...failing,
  }).annotateMerge(hints('update_resume_section', true)),
  Tool.make('validate_resume', {
    description: describe('validate_resume'),
    parameters: Schema.Struct({ resume: optional(Resume) }),
    success: Schema.Struct({ valid: Schema.Boolean, problems: Issues }),
    ...failing,
  }).annotateMerge(hints('validate_resume')),
  Tool.make('get_resume_schema', {
    description: describe('get_resume_schema'),
    success: Schema.Unknown,
    ...failing,
  }).annotateMerge(hints('get_resume_schema'))
);

/** Needs Accounts. */
export const ResumeHandlers = ResumeToolkit.toLayer(
  Effect.gen(function* () {
    const accounts = yield* Accounts;
    const current = Effect.gen(function* () {
      const user = yield* caller;
      return { user, ...(yield* accounts.currentResume(user.id)) };
    });
    /**
     * Saves unless it adds schema problems the saved resume doesn't have:
     * an agent's mistake then can't replace a good resume (or the gist).
     * Problems already there don't block it, so they can be fixed in steps.
     */
    const save = (resume: Record<string, unknown>) =>
      Effect.gen(function* () {
        const user = yield* caller;
        const found = problems(resume);
        const before = new Set(problems((yield* current).resume));
        const added = found.filter((p) => !before.has(p));
        if (added.length > 0) {
          return yield* failWith(
            `Not saved: it would add schema problems. Fix these and save again:\n${added.join(
              '\n'
            )}`
          );
        }
        yield* accounts
          .saveResume(user.id, resume)
          .pipe(Effect.mapError(saveError));
        return { saved: true, problems: found };
      });

    return {
      get_resume: () =>
        Effect.map(current, ({ user, resume, source }) => ({
          resume,
          source,
          url: `${SITE}/@${user.username}`,
        })),
      save_resume: ({ resume }) => save(resume),
      update_resume_section: ({ section, value }) =>
        Effect.gen(function* () {
          const object = section === 'basics' || section === 'meta';
          if (
            object
              ? !Predicate.isObject(value) || Array.isArray(value)
              : !Array.isArray(value)
          ) {
            return yield* failWith(
              `${section} must be ${object ? 'an object' : 'an array'}.`
            );
          }
          const { resume } = yield* current;
          const base = Predicate.isObject(resume)
            ? (resume as Record<string, unknown>)
            : {};
          return yield* save({ ...base, [section]: value });
        }),
      validate_resume: ({ resume }) =>
        Effect.gen(function* () {
          const target = resume ?? (yield* current).resume;
          const found = problems(target);
          return { valid: found.length === 0, problems: found };
        }),
      get_resume_schema: () => Effect.succeed(schemaJson),
    };
  })
);
