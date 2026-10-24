import { Accounts, RateLimiter } from '@repo/accounts';
import { CurrentUser, JsonResumeApi } from '@repo/api';
import { renderTheme, ResumeDocument } from '@repo/resume-themes';
import { Effect, Schema } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';

const decodeDocument = Schema.decodeUnknownOption(ResumeDocument);

/** A small page in place of the preview, saying why there is none. */
const notice = (title: string, text: string) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>
body{font-family:system-ui,sans-serif;color:#555;display:grid;place-items:center;min-height:90vh;margin:0;padding:24px;text-align:center}
h1{font-size:18px;color:#222;margin:0 0 8px}p{margin:0;font-size:14px;max-width:32rem}</style></head>
<body><div><h1>${title}</h1><p>${text}</p></div></body></html>`;

/** The editor's resume, and previews of unsaved changes in any theme. */
export const EditorHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'editor',
  (handlers) =>
    Effect.gen(function* () {
      const accounts = yield* Accounts;
      const limiter = yield* RateLimiter;
      return handlers.handleAll({
        resume: () =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const current = yield* accounts.currentResume(user.id);
            return { ...current, github: user.github?.login ?? null };
          }),
        preview: ({ payload }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            yield* limiter.hit(`preview:${user.id}`, 240, 60);
            const doc = decodeDocument(payload.resume);
            if (doc._tag === 'None' || Array.isArray(payload.resume)) {
              return notice(
                'Nothing to preview yet',
                'A resume is one JSON object, starting with {.'
              );
            }
            return yield* renderTheme(payload.theme, doc.value).pipe(
              Effect.catchTags({
                ThemeNotFound: () =>
                  Effect.succeed(
                    notice(
                      'No such theme',
                      `There is no theme called “${payload.theme}”.`
                    )
                  ),
                ThemeFailed: () =>
                  Effect.succeed(
                    notice(
                      'This theme couldn’t render the resume',
                      'Something in the resume trips it up. Try another theme, or check the fields this theme uses.'
                    )
                  ),
              })
            );
          }),
      });
    })
);
