import { Schema } from 'effect';

/**
 * Decode content where it is built: the server and prerender (and tests)
 * validate every file, and a bad one fails the build. The browser receives the
 * same, already-checked data, so its bundle skips Schema's decoders.
 */
export const decodeContent = <S extends Schema.ConstraintDecoder<unknown>>(
  schema: S
) =>
  import.meta.env.SSR
    ? Schema.decodeUnknownSync(schema)
    : (input: unknown): S['Type'] => input as S['Type'];
