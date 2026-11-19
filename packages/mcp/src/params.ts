import { Option, Schema, SchemaGetter } from 'effect';

/**
 * An optional tool parameter. Tool schemas show optional parameters as
 * nullable, and clients (ChatGPT among them) send null for "not given",
 * which Schema.optional refused; here null decodes as absent.
 */
export const optional = <S extends Schema.Top>(
  schema: S,
  description?: string
) =>
  Schema.optionalKey(
    Schema.NullOr(schema).annotate(description ? { description } : {})
  ).pipe(
    Schema.decodeTo(Schema.optionalKey(schema), {
      decode: SchemaGetter.transformOptional(
        Option.filter((v): v is S['Type'] => v !== null)
      ),
      encode: SchemaGetter.transformOptional((v) => v),
    })
  );

/** A number parameter, without the "Infinity" and "NaN" Schema.Number allows. */
export const Count = Schema.Finite;

const JsonObject = Schema.Record(Schema.String, Schema.Unknown);
const JsonSection = Schema.Union([JsonObject, Schema.Array(Schema.Unknown)]);

/**
 * A JSON object parameter, also taken as that JSON in a string: given an
 * untyped parameter, some clients (Raycast) send the JSON as text, which
 * every update_resume_section and save_variant from them failed on.
 */
export const ObjectArg = Schema.Union([
  JsonObject,
  Schema.fromJsonString(JsonObject),
]);

/** A resume section: an object or an array, or either as JSON text. */
export const SectionArg = Schema.Union([
  JsonSection,
  Schema.fromJsonString(JsonSection),
]);
