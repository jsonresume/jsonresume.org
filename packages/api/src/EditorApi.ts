import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from 'effect/http-api';
import { ResumeSource } from './AccountApi';
import { Authentication } from './Authentication';
import { TooManyAttempts } from './errors';

/** The resume the editor opens: what /@username shows now. */
export const EditorResume = Schema.Struct({
  /** The saved copy, or the gist's when that is the source; null when there is none yet. */
  resume: Schema.Unknown,
  source: ResumeSource,
  /** The linked GitHub login, whose gist feeds the page when source is gist. */
  github: Schema.NullOr(Schema.String),
});

/**
 * For the editor. Saving goes through account.saveResume; preview renders
 * an unsaved resume with any theme, as /@username would show it.
 */
export class EditorApi extends HttpApiGroup.make('editor')
  .add(
    HttpApiEndpoint.get('resume', '/resume', { success: EditorResume }),
    HttpApiEndpoint.post('preview', '/preview', {
      payload: Schema.Struct({ resume: Schema.Unknown, theme: Schema.String }),
      success: Schema.String.pipe(
        HttpApiSchema.asText({ contentType: 'text/html' })
      ),
      error: TooManyAttempts,
    })
  )
  .middleware(Authentication)
  .prefix('/editor') {}
