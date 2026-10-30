import { ApiKeys, OAuth } from '@repo/accounts';
import { allows } from '@repo/api';
import { Effect, Layer } from 'effect';
import { McpProtocol, McpServer } from 'effect/ai';
import { HttpRouter, HttpServerRequest, HttpServerResponse } from 'effect/http';
import { AccountHandlers, AccountToolkit } from './accountTools';
import { AppHandlers, AppToolkit } from './appTools';
import { TreeHandlers, TreeToolkit } from './treeTools';
import { McpCaller } from './context';
import { ExploreHandlers, ExploreToolkit } from './exploreTools';
import { ExportHandlers, ExportToolkit } from './exportTools';
import { JobHandlers, JobToolkit } from './jobTools';
import { Prompts } from './prompts';
import { ResumeHandlers, ResumeToolkit } from './resumeTools';

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

/**
 * Every request needs a Bearer token: an API key (jr_…) or, from OAuth, an
 * access token. Tools see the user as McpCaller.
 */
const authentication = (site: string) =>
  HttpRouter.middleware(
    Effect.gen(function* () {
      const keys = yield* ApiKeys;
      const oauth = yield* OAuth;
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
          const user = token.startsWith('jr_')
            ? yield* keys.authenticate(token)
            : yield* oauth
                .authenticate(token)
                .pipe(
                  Effect.map((grant) =>
                    grant && allows(grant.scope, 'mcp') ? grant.user : undefined
                  )
                );
          if (!user)
            return unauthorized(site, 'That token is not valid (any more)');
          return yield* Effect.provideService(httpEffect, McpCaller, user);
        });
    })
  );

/**
 * The MCP server at /mcp (Streamable HTTP, every current protocol
 * revision): the tools, the prompts, and the authentication in front.
 * Needs Accounts, ApiKeys, OAuth, AnalyticsStore, Explore, JobBoard and JobMatcher.
 */
export const mcpRoutes = (site: string = SITE) =>
  Layer.mergeAll(
    McpServer.toolkit(ResumeToolkit).pipe(Layer.provide(ResumeHandlers)),
    McpServer.toolkit(ExportToolkit).pipe(Layer.provide(ExportHandlers)),
    McpServer.toolkit(AccountToolkit).pipe(Layer.provide(AccountHandlers)),
    McpServer.toolkit(ExploreToolkit).pipe(Layer.provide(ExploreHandlers)),
    McpServer.toolkit(JobToolkit).pipe(Layer.provide(JobHandlers)),
    McpServer.toolkit(AppToolkit).pipe(Layer.provide(AppHandlers)),
    McpServer.toolkit(TreeToolkit).pipe(Layer.provide(TreeHandlers)),
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
