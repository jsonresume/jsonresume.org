import { Layer } from 'effect';
import { Importer } from './importer';
import { ResumeReaderFromEnv } from './reader';
import { ImportStore } from './store';

export { isoDate } from './dates';
export { detect, LINKEDIN_FILES, type Source, type Upload } from './detect';
export { Downloader } from './download';
export {
  IMPORT_VERSION,
  Importer,
  type ImportError,
  type ImportInput,
} from './importer';
export { fromLinkedIn } from './linkedin';
export { MODEL, ResumeReader, ResumeReaderFromEnv } from './reader';
export { repair } from './repair';
export { ModelReply } from './shape';
export { ImportStore, type ImportRecord } from './store';

/**
 * The Importer as the server runs it: OpenAI from OPENAI_API_KEY, the
 * cache in Postgres. Needs a SqlClient; ProductEvents, when given, gets
 * import_started and import_finished.
 */
export const ImporterLive = Importer.layer.pipe(
  Layer.provide(Layer.merge(ImportStore.layer, ResumeReaderFromEnv))
);
