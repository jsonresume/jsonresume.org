/**
 * The MCP connect check (@repo/mcp/health): what Claude, ChatGPT, Cursor,
 * Gemini CLI and VS Code each do to connect, run against a live site —
 * OAuth discovery, dynamic client registration, the consent page, then
 * MCP initialize, tools/list and get_resume. Exits non-zero, naming the
 * step, when one fails. `vite build --ssr scripts/mcp-health.ts` bundles it;
 * the jsonresume-mcp-health timer would run it (deploy/README.md).
 *
 * MCP_HEALTH_URL: the site (default https://jsonresume.org).
 * MCP_HEALTH_TOKEN: an API key (jr_…) of a test account, for the signed-in
 * steps; without it they are skipped. Each run registers one OAuth client.
 */
import { NodeRuntime } from '@effect/platform-node';
import { checkMcp } from '@repo/mcp/health';
import { Config, Effect, Option, Redacted } from 'effect';
import { FetchHttpClient } from 'effect/http';

const main = Effect.gen(function* () {
  const site = yield* Config.String('MCP_HEALTH_URL').pipe(
    Config.withDefault('https://jsonresume.org')
  );
  const token = yield* Config.option(Config.Redacted('MCP_HEALTH_TOKEN'));
  const steps = yield* checkMcp(site, Option.map(token, Redacted.value)).pipe(
    Effect.tapError((e) =>
      Effect.logError('MCP health check failed', {
        site,
        step: e.step,
        message: e.message,
      })
    )
  );
  for (const { step, ms, detail } of steps)
    yield* Effect.logInfo(`ok ${step}`, { ms, detail });
  if (Option.isNone(token))
    yield* Effect.logWarning(
      'MCP_HEALTH_TOKEN is not set: initialize, tools/list and get_resume were skipped'
    );
  yield* Effect.logInfo('MCP health check passed', { site });
});

NodeRuntime.runMain(main.pipe(Effect.provide(FetchHttpClient.layer)));
