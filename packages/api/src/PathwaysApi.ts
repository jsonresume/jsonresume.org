import { Schema } from 'effect';

/**
 * Pathways' copilot: POST /api/pathways/chat with the conversation; the
 * reply streams back as server-sent events, one CopilotEvent per `data:`.
 */
export const CopilotMessage = Schema.Struct({
  role: Schema.Literals(['user', 'assistant']),
  content: Schema.String,
});
export type CopilotMessage = typeof CopilotMessage.Type;

export const CopilotRequest = Schema.Struct({
  messages: Schema.Array(CopilotMessage),
});

export const CopilotEvent = Schema.Union([
  /** More of the reply's text. */
  Schema.Struct({ type: Schema.Literal('text'), delta: Schema.String }),
  /** A tool the copilot uses (the same tools as the MCP server). */
  Schema.Struct({
    type: Schema.Literal('tool'),
    id: Schema.String,
    name: Schema.String,
    status: Schema.Literals(['running', 'done', 'error']),
  }),
  Schema.Struct({ type: Schema.Literal('done') }),
  Schema.Struct({ type: Schema.Literal('error'), message: Schema.String }),
]);
export type CopilotEvent = typeof CopilotEvent.Type;
