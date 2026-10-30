import { OpenAiLanguageModel } from '@effect/ai-openai';
import { Seniority } from '@repo/api';
import { Context, Effect, Layer, Schema } from 'effect';
import { LanguageModel } from 'effect/ai';
import { familyPrompt, isFamily, type Family } from './families';

export class ReadFailed extends Schema.TaggedError<ReadFailed>()('ReadFailed', {
  message: Schema.String,
}) {}

/** Stored in app.job_roles.model: posts read at another version are read again. */
export const ROLES_VERSION = 'roles-1';

const MODEL = 'gpt-5-mini';
const POST_CHARS = 4000;

const ReadRequirement = Schema.Struct({
  skill: Schema.String,
  need: Schema.Literals(['required', 'nice']),
  years: Schema.NullOr(Schema.Number),
});
const ReadRole = Schema.Struct({
  title: Schema.String,
  family: Schema.String,
  seniority: Seniority,
  summary: Schema.String,
  requirements: Schema.Array(ReadRequirement),
});
const Reply = Schema.Struct({
  posts: Schema.Array(
    Schema.Struct({ id: Schema.Number, roles: Schema.Array(ReadRole) })
  ),
});
const Summary = Schema.Struct({ summary: Schema.String });

/** One role as read from a post, its family checked against FAMILIES. */
export interface RoleRead {
  title: string;
  family: Family;
  seniority: typeof Seniority.Type;
  summary: string;
  requirements: ReadonlyArray<typeof ReadRequirement.Type>;
}

export interface PostToRead {
  id: number;
  /** The post as plain text (postText from @repo/jobs). */
  text: string;
}

const INSTRUCTIONS = `You read job posts from Hacker News "Who is hiring?" and list EVERY role each post hires for. Return every post you are given, by its id.
- A post often lists several roles (a list of titles, links per role): one entry per role, titled as the post titles it. A post hiring "engineers" in general is one role.
- family: the one key from this list that fits the role best:
${familyPrompt}
- seniority: intern, junior, mid, senior, staff_plus (staff, principal), lead_management (manager, head of, VP, CTO), or unspecified.
- summary: one plain sentence on what the role does.
- requirements: specific technologies, languages, frameworks, tools or skills the post asks of that role (React, PostgreSQL, Kubernetes, LLM evaluation). Never kinds of work ("Backend", "Full-stack", "APIs"). need "required" unless the post says nice-to-have, a plus or bonus. years only when the post states them. When the post lists requirements once for all its roles, give them to each role.
- Use only what the post says. Never guess.`;

const block = (p: PostToRead) => `[${p.id}]\n${p.text.slice(0, POST_CHARS)}`;

const toRole = (r: typeof ReadRole.Type): RoleRead => ({
  ...r,
  title: r.title.trim().slice(0, 200) || 'Engineer',
  family: isFamily(r.family) ? r.family : 'other_tech',
  summary: r.summary.trim().slice(0, 400),
});

/** Job posts into their roles and what each requires, with a model. */
export class RoleReader extends Context.Service<
  RoleReader,
  {
    /**
     * Each post's roles, by post id (empty when it found none); posts the
     * model skipped twice are left out, to be read on a later run.
     */
    read(
      posts: ReadonlyArray<PostToRead>
    ): Effect.Effect<ReadonlyMap<number, ReadonlyArray<RoleRead>>, ReadFailed>;
    /** One sentence on a role family, from its open roles. */
    summarize(
      family: string,
      roles: ReadonlyArray<{ title: string; summary: string }>
    ): Effect.Effect<string, ReadFailed>;
  }
>()('@repo/careers/RoleReader') {}

/** Needs an OpenAiClient. */
export const RoleReaderLive = Layer.effect(
  RoleReader,
  Effect.gen(function* () {
    const model = yield* OpenAiLanguageModel.model(MODEL, {
      reasoning: { effort: 'low' },
    }).captureRequirements;
    const failed = (e: { message: string }) =>
      new ReadFailed({ message: e.message });
    const ask = (posts: ReadonlyArray<PostToRead>) =>
      LanguageModel.generateObject({
        objectName: 'job_roles',
        schema: Reply,
        prompt: [
          { role: 'system', content: INSTRUCTIONS },
          {
            role: 'user',
            content: posts.map(block).join('\n\n---\n\n'),
          },
        ],
      }).pipe(
        Effect.map(({ value }) => value.posts),
        Effect.provide(model),
        Effect.mapError(failed)
      );
    return RoleReader.of({
      read: Effect.fn('RoleReader.read')(function* (posts) {
        const asked = new Set(posts.map((p) => p.id));
        const found = new Map<number, ReadonlyArray<RoleRead>>();
        const keep = (reply: (typeof Reply.Type)['posts']) => {
          for (const p of reply) {
            if (asked.has(p.id)) found.set(p.id, p.roles.map(toRole));
          }
        };
        keep(yield* ask(posts));
        // A long list sometimes loses a post: ask again once for those.
        const missing = posts.filter((p) => !found.has(p.id));
        if (missing.length > 0) keep(yield* ask(missing));
        return found;
      }),
      summarize: (family, roles) =>
        LanguageModel.generateObject({
          objectName: 'family_summary',
          schema: Summary,
          prompt: [
            {
              role: 'system',
              content:
                'In one plain sentence (under 30 words), say what the open roles in this family have in common: the work and what they ask for. No preamble.',
            },
            {
              role: 'user',
              content: `${family}\n\n${roles
                .slice(0, 40)
                .map((r) => `- ${r.title}: ${r.summary}`)
                .join('\n')}`,
            },
          ],
        }).pipe(
          Effect.map(({ value }) => value.summary.trim().slice(0, 300)),
          Effect.provide(model),
          Effect.mapError(failed)
        ),
    });
  })
);
