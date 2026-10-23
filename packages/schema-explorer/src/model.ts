import { Schema } from 'effect';

/**
 * The subset of JSON Schema (draft-07) the explorer reads. Unknown keywords
 * are ignored, so any schema decodes; the explorer shows what it understands.
 */
export interface JsonSchemaNode {
  readonly type?: string | ReadonlyArray<string>;
  readonly title?: string;
  readonly description?: string;
  readonly format?: string;
  readonly pattern?: string;
  readonly enum?: ReadonlyArray<unknown>;
  readonly $ref?: string;
  readonly properties?: { readonly [key: string]: JsonSchemaNode };
  readonly items?: JsonSchemaNode;
  readonly oneOf?: ReadonlyArray<JsonSchemaNode>;
  readonly anyOf?: ReadonlyArray<JsonSchemaNode>;
  readonly definitions?: { readonly [key: string]: JsonSchemaNode };
}

const Node: Schema.Codec<JsonSchemaNode> = Schema.Struct({
  type: Schema.optionalKey(
    Schema.Union([Schema.String, Schema.Array(Schema.String)])
  ),
  title: Schema.optionalKey(Schema.String),
  description: Schema.optionalKey(Schema.String),
  format: Schema.optionalKey(Schema.String),
  pattern: Schema.optionalKey(Schema.String),
  enum: Schema.optionalKey(Schema.Array(Schema.Unknown)),
  $ref: Schema.optionalKey(Schema.String),
  properties: Schema.optionalKey(
    Schema.Record(
      Schema.String,
      Schema.suspend((): Schema.Codec<JsonSchemaNode> => Node)
    )
  ),
  items: Schema.optionalKey(
    Schema.suspend((): Schema.Codec<JsonSchemaNode> => Node)
  ),
  oneOf: Schema.optionalKey(
    Schema.Array(Schema.suspend((): Schema.Codec<JsonSchemaNode> => Node))
  ),
  anyOf: Schema.optionalKey(
    Schema.Array(Schema.suspend((): Schema.Codec<JsonSchemaNode> => Node))
  ),
  definitions: Schema.optionalKey(
    Schema.Record(
      Schema.String,
      Schema.suspend((): Schema.Codec<JsonSchemaNode> => Node)
    )
  ),
});

export const JsonSchemaNode = Node;

/** Decode a JSON Schema document; throws a SchemaError if it is malformed. */
export const decodeJsonSchema = Schema.decodeUnknownSync(Node);
