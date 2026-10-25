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
