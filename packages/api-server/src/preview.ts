import { renderTheme, ResumeDocument } from '@repo/resume-themes';
import { Effect, Schema } from 'effect';

const decodeDocument = Schema.decodeUnknownOption(ResumeDocument);

/** A small page in place of the preview, saying why there is none. */
const notice = (title: string, text: string) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>
body{font-family:system-ui,sans-serif;color:#555;display:grid;place-items:center;min-height:90vh;margin:0;padding:24px;text-align:center}
h1{font-size:18px;color:#222;margin:0 0 8px}p{margin:0;font-size:14px;max-width:32rem}</style></head>
<body><div><h1>${title}</h1><p>${text}</p></div></body></html>`;

/**
 * An unsaved resume in a theme, as /@username would show it, for the
 * editor's preview and the start page's. Never fails: a resume that isn't
 * one, an unknown theme or a theme that breaks gets a page saying so.
 */
export const previewHtml = (resume: unknown, theme: string) => {
  const doc = decodeDocument(resume);
  if (doc._tag === 'None' || Array.isArray(resume))
    return Effect.succeed(
      notice(
        'Nothing to preview yet',
        'A resume is one JSON object, starting with {.'
      )
    );
  return renderTheme(theme, doc.value).pipe(
    Effect.catchTags({
      ThemeNotFound: () =>
        Effect.succeed(
          notice('No such theme', `There is no theme called “${theme}”.`)
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
};
