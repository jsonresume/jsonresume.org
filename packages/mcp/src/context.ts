import type { UserRecord } from '@repo/accounts';
import { Context, Effect, Schema } from 'effect';
import { Tool } from 'effect/ai';
import { tools } from './catalog';

/** Who is calling, from the request's Bearer token (see auth.ts). */
export const McpCaller = Context.Reference<UserRecord | undefined>(
  '@repo/mcp/McpCaller',
  { defaultValue: () => undefined }
);

/** A tool call that can't be done; the message is for the agent and the user. */
export class ToolError extends Schema.TaggedError<ToolError>()('ToolError', {
  message: Schema.String,
}) {}

export const failWith = (message: string) => new ToolError({ message });

/** The signed-in user, or a ToolError saying how to connect. */
export const caller = Effect.gen(function* () {
  const user = yield* McpCaller;
  if (user) return user;
  return yield* failWith(
    'Not signed in. Connect with OAuth, or an API key from https://jsonresume.org/dashboard/settings#api-keys'
  );
});

const info = (name: string) => {
  const found = tools.find((t) => t.name === name);
  if (!found) throw new Error(`${name} is not in the MCP catalog`);
  return found;
};

/** A tool's description, from the catalog. */
export const describe = (name: string) => info(name).description;

/**
 * MCP hints from the catalog, always all three: read-only unless it
 * writes; destructive when it overwrites (a resume, a section, the theme, a
 * username), as the ChatGPT app guidelines define it; never open-world, as
 * every tool works on the user's own account or our catalog.
 */
export const hints = (name: string, destructive = false) =>
  Context.make(Tool.Readonly, !info(name).writes).pipe(
    Context.add(Tool.Destructive, destructive),
    Context.add(Tool.OpenWorld, false)
  );

/** What every tool shares: errors come back to the agent as results. */
export const failing = { failure: ToolError, failureMode: 'return' } as const;
