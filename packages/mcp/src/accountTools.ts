import { Accounts } from '@repo/accounts';
import { AnalyticsStore } from '@repo/analytics';
import { AnalyticsRange, Overview, ResumeSource } from '@repo/api';
import { filterThemes, findTheme, themes } from '@repo/theme-gallery/catalog';
import { Effect, Predicate, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { caller, describe, failing, failWith, hints } from './context';

const SITE = 'https://jsonresume.org';

const Theme = Schema.Struct({
  slug: Schema.String,
  name: Schema.String,
  description: Schema.String,
  tags: Schema.Array(Schema.String),
  previewUrl: Schema.String,
});

const AccountInfo = Schema.Struct({
  username: Schema.String,
  email: Schema.NullOr(Schema.String),
  emailVerified: Schema.Boolean,
  github: Schema.NullOr(Schema.String),
  source: ResumeSource,
  links: Schema.Struct({
    page: Schema.String,
    json: Schema.String,
    yaml: Schema.String,
    text: Schema.String,
  }),
});

const links = (username: string) => ({
  page: `${SITE}/@${username}`,
  json: `${SITE}/@${username}.json`,
  yaml: `${SITE}/@${username}.yaml`,
  text: `${SITE}/@${username}.txt`,
});

export const AccountToolkit = Toolkit.make(
  Tool.make('list_themes', {
    description: describe('list_themes'),
    parameters: Schema.Struct({
      query: Schema.optional(Schema.String),
      tag: Schema.optional(Schema.String),
    }),
    success: Schema.Array(Theme),
    ...failing,
  }).annotateMerge(hints('list_themes')),
  Tool.make('set_theme', {
    description: describe('set_theme'),
    parameters: Schema.Struct({ slug: Schema.String }),
    success: Schema.Struct({ theme: Schema.String, url: Schema.String }),
    ...failing,
  }).annotateMerge(hints('set_theme')),
  Tool.make('get_resume_analytics', {
    description: describe('get_resume_analytics'),
    parameters: Schema.Struct({ range: AnalyticsRange }),
    success: Overview,
    ...failing,
  }).annotateMerge(hints('get_resume_analytics')),
  Tool.make('get_account', {
    description: describe('get_account'),
    success: AccountInfo,
    ...failing,
  }).annotateMerge(hints('get_account')),
  Tool.make('set_resume_source', {
    description: describe('set_resume_source'),
    parameters: Schema.Struct({ source: ResumeSource }),
    success: Schema.Struct({ source: ResumeSource }),
    ...failing,
  }).annotateMerge(hints('set_resume_source')),
  Tool.make('change_username', {
    description: describe('change_username'),
    parameters: Schema.Struct({ username: Schema.String }),
    success: Schema.Struct({ username: Schema.String, url: Schema.String }),
    ...failing,
  }).annotateMerge(hints('change_username', true))
);

/** Needs Accounts and AnalyticsStore. */
export const AccountHandlers = AccountToolkit.toLayer(
  Effect.gen(function* () {
    const accounts = yield* Accounts;
    const analytics = yield* AnalyticsStore;
    const preview = (slug: string, username = 'thomasdavis') =>
      `${SITE}/@${username}?theme=${encodeURIComponent(slug)}`;

    return {
      list_themes: ({ query, tag }) =>
        Effect.gen(function* () {
          const user = yield* Effect.option(caller);
          const name = user._tag === 'Some' ? user.value.username : undefined;
          return filterThemes(themes, {
            query: query ?? '',
            tag: tag ?? null,
          }).map((t) => ({
            slug: t.slug,
            name: t.name,
            description: t.description,
            tags: t.tags,
            previewUrl: preview(t.slug, name),
          }));
        }),
      set_theme: ({ slug }) =>
        Effect.gen(function* () {
          const theme = findTheme(slug);
          if (!theme) {
            return yield* failWith(
              `No theme "${slug}". list_themes gives the slugs.`
            );
          }
          const user = yield* caller;
          const { resume } = yield* accounts.currentResume(user.id);
          const base = Predicate.isObject(resume)
            ? (resume as Record<string, unknown>)
            : {};
          const meta = Predicate.isObject(base.meta) ? base.meta : {};
          yield* accounts
            .saveResume(user.id, { ...base, meta: { ...meta, theme: slug } })
            .pipe(
              Effect.mapError(() =>
                failWith(
                  'The resume could not be saved (see save_resume for why saves fail).'
                )
              )
            );
          return { theme: slug, url: `${SITE}/@${user.username}` };
        }),
      get_resume_analytics: ({ range }) =>
        Effect.flatMap(caller, (user) =>
          analytics.overview(user.username, range)
        ),
      get_account: () =>
        Effect.gen(function* () {
          const user = yield* caller;
          const record = yield* accounts.account(user.id);
          return {
            username: user.username,
            email: user.email,
            emailVerified: user.emailVerified,
            github: user.githubLogin,
            source: record?.source ?? 'stored',
            links: links(user.username),
          };
        }),
      set_resume_source: ({ source }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          yield* accounts
            .setSource(user.id, source)
            .pipe(Effect.mapError((e) => failWith(e.message)));
          return { source };
        }),
      change_username: ({ username }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          const renamed = yield* accounts
            .rename(user.id, username)
            .pipe(
              Effect.mapError((e) =>
                failWith(
                  e._tag === 'UsernameUnavailable'
                    ? `“${username}” can’t be used (${e.reason}).`
                    : 'GitHub could not be asked whether the name is free; try again.'
                )
              )
            );
          return {
            username: renamed.username,
            url: `${SITE}/@${renamed.username}`,
          };
        }),
    };
  })
);
