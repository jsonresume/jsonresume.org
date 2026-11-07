import { ApiKeys, OAuth } from '@repo/accounts';
import { allows } from '@repo/api';
import { tracker, type ProductEventName } from '@repo/posthog';
import { Effect, Layer, Option, Schema } from 'effect';
import { McpProtocol, McpServer } from 'effect/ai';
import { HttpRouter, HttpServerRequest, HttpServerResponse } from 'effect/http';
import { AccountHandlers, AccountToolkit } from './accountTools';
import { AppHandlers, AppToolkit } from './appTools';
import { TreeHandlers, TreeToolkit } from './treeTools';
import { McpActor, McpCaller } from './context';
import { ExploreHandlers, ExploreToolkit } from './exploreTools';
import { ExportHandlers, ExportToolkit } from './exportTools';
import { DirectoryHandlers, DirectoryToolkit } from './directoryTools';
import { ImportHandlers, ImportToolkit } from './importTools';
import { WebhookHandlers, WebhookToolkit } from './webhookTools';
import { ProposalHandlers, ProposalToolkit } from './proposalTools';
import { VariantHandlers, VariantToolkit } from './variantTools';
import { PrivacyHandlers, PrivacyToolkit } from './privacyTools';
import { JobHandlers, JobToolkit } from './jobTools';
import { Prompts } from './prompts';
import { ResumeHandlers, ResumeToolkit } from './resumeTools';
import { VersionHandlers, VersionToolkit } from './versionTools';

const SITE = 'https://jsonresume.org';

const instructions = `jsonresume.org: the user's JSON Resume (resume.json) and everything around it.
Read the resume with get_resume before changing it; save whole resumes with save_resume or one section with update_resume_section. Their page is jsonresume.org/@username; themes change how it looks. Jobs are Hacker News "Who is hiring?" posts: match_jobs ranks them against the resume, mark_job records what the user thinks. Ask before renaming the account.`;

const unauthorized = (site: string, message: string) =>
  HttpServerResponse.jsonUnsafe(
    { error: 'unauthorized', error_description: message },
    {
      status: 401,
      headers: {
        // Where clients learn how to get a token (RFC 9728).
        'www-authenticate': `Bearer resource_metadata="${site}/.well-known/oauth-protected-resource"`,
      },
    }
  );

const ToolCall = Schema.fromJsonString(
  Schema.Struct({
    method: Schema.Literal('tools/call'),
    params: Schema.Struct({ name: Schema.String }),
  })
);

type Track = (
  id: string,
  event: ProductEventName,
  properties: { tool: string }
) => Effect.Effect<void>;

/** Which tool a request calls, if it calls one (the body is read once, cached). */
const toolCalled = (track: Track, userId: string) =>
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest;
    if (request.method !== 'POST') return;
    const call = Schema.decodeUnknownOption(ToolCall)(yield* request.text);
    if (Option.isSome(call))
      yield* track(userId, 'mcp_tool_called', {
        tool: call.value.params.name,
      });
  }).pipe(Effect.ignore);

/**
 * Every request needs a Bearer token: an API key (jr_…) or, from OAuth, an
 * access token. Tools see the user as McpCaller.
 */
const authentication = (site: string) =>
  HttpRouter.middleware(
    Effect.gen(function* () {
      const keys = yield* ApiKeys;
      const oauth = yield* OAuth;
      const track = yield* tracker;
      return (httpEffect) =>
        Effect.gen(function* () {
          const request = yield* HttpServerRequest.HttpServerRequest;
          const token = /^Bearer\s+(\S+)$/i.exec(
            request.headers.authorization ?? ''
          )?.[1];
          if (!token) {
            return unauthorized(site, 'Sign in to connect to jsonresume.org');
          }
          // OAuth apps granted only some scopes (an HR tool reading the
          // resume) can't use the tools: those need the mcp scope.
          const found = token.startsWith('jr_')
            ? yield* keys
                .identify(token)
                .pipe(
                  Effect.map(
                    (k) => k && { user: k.user, id: k.key.id, name: k.key.name }
                  )
                )
            : yield* oauth.authenticate(token).pipe(
                Effect.map(
                  (grant) =>
                    grant &&
                    allows(grant.scope, 'mcp') && {
                      user: grant.user,
                      id: grant.clientId,
                      name: grant.clientName,
                    }
                )
              );
          if (!found)
            return unauthorized(site, 'That token is not valid (any more)');
          const { user, id, name } = found;
          yield* toolCalled(track, user.id);
          return yield* Effect.provideService(httpEffect, McpCaller, user).pipe(
            Effect.provideService(McpActor, { kind: 'assistant', id, name })
          );
        });
    })
  );

/**
 * The MCP server at /mcp (Streamable HTTP, every current protocol
 * revision): the tools, the prompts, and the authentication in front.
 * Needs Accounts, ApiKeys, OAuth, AnalyticsStore, Explore, JobBoard,
 * JobMatcher, RateLimiter, Importer, Downloader and ResumeVersions.
 */
export const mcpRoutes = (site: string = SITE) =>
  Layer.mergeAll(
    McpServer.toolkit(ResumeToolkit).pipe(Layer.provide(ResumeHandlers)),
    McpServer.toolkit(ExportToolkit).pipe(Layer.provide(ExportHandlers)),
    McpServer.toolkit(ImportToolkit).pipe(Layer.provide(ImportHandlers)),
    McpServer.toolkit(AccountToolkit).pipe(Layer.provide(AccountHandlers)),
    McpServer.toolkit(PrivacyToolkit).pipe(Layer.provide(PrivacyHandlers)),
    McpServer.toolkit(ExploreToolkit).pipe(Layer.provide(ExploreHandlers)),
    McpServer.toolkit(JobToolkit).pipe(Layer.provide(JobHandlers)),
    McpServer.toolkit(AppToolkit).pipe(Layer.provide(AppHandlers)),
    McpServer.toolkit(DirectoryToolkit).pipe(Layer.provide(DirectoryHandlers)),
    McpServer.toolkit(WebhookToolkit).pipe(Layer.provide(WebhookHandlers)),
    McpServer.toolkit(TreeToolkit).pipe(Layer.provide(TreeHandlers)),
    McpServer.toolkit(VersionToolkit).pipe(Layer.provide(VersionHandlers)),
    McpServer.toolkit(VariantToolkit).pipe(Layer.provide(VariantHandlers)),
    McpServer.toolkit(ProposalToolkit).pipe(Layer.provide(ProposalHandlers)),
    Prompts
  ).pipe(
    Layer.provideMerge(
      // Route middleware, on /mcp only: the router is shared with the API.
      McpServer.layerHttp({
        name: 'jsonresume',
        version: '1.0.0',
        description: 'Your JSON Resume: resume, themes, readers and jobs',
        websiteUrl: `${site}/mcp`,
        instructions,
        path: '/mcp',
        protocols: [
          McpProtocol.v2026_07_28,
          McpProtocol.v2025_11_25,
          McpProtocol.v2025_06_18,
          McpProtocol.v2025_03_26,
        ],
      }).pipe(Layer.provide(authentication(site).layer))
    )
  );
