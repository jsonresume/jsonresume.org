/**
 * Live routes for `pnpm dev` (see scripts/dev.ts): the API, resumes and
 * jobs, as in production, on an in-memory Postgres (PGlite) that starts
 * empty (the job board too: run the pipeline against it to fill it).
 */
import { apiRoutes } from '@repo/api-server';
import { mcpRoutes } from '@repo/mcp';
import { InMemoryDatabase } from '@repo/database/testing';
import { effectWebHandler, sameOrigin } from '@repo/server';
import { Hono } from 'hono';
import { Layer } from 'effect';
import { render } from '../src/entry-server';
import { discoveryRoutes, isMcpRequest, sessionless } from './agents';
import { createJobPages, jobPath, jobsPath } from './jobPages';
import { createResumeHandler } from './resumes';
import { appServices } from './services';

const services = appServices(InMemoryDatabase);
const memoMap = Layer.makeMemoMapUnsafe();
const api = effectWebHandler(apiRoutes('dev').pipe(Layer.provide(services)), {
  memoMap,
});
const resumes = createResumeHandler(render, services, { memoMap });
const mcp = effectWebHandler(
  mcpRoutes(process.env.SITE_URL).pipe(Layer.provide(services)),
  {
    memoMap,
  }
);
const jobs = createJobPages(render, services, { memoMap });

// Paths these routes don't answer fall through, marked, to Vite's renderer.
const PASS = 'x-dev-pass';
const app = new Hono();
app.notFound((c) => c.body(null, 404, { [PASS]: '1' }));
app.use('*', sameOrigin('/api', ['/api/events/', '/api/v1/', ...sessionless]));
app.all('/api/*', (c) => api.handler(c.req.raw));
app.all('/mcp', (c, next) =>
  isMcpRequest(c.req.raw) ? mcp.handler(c.req.raw) : next()
);
for (const route of discoveryRoutes(process.env.SITE_URL ?? '')) {
  app.get(route.path, () => route.fetch());
}
app.get(
  '/:handle{@[^/]+}',
  async (c, next) => (await resumes.fetch(c.req.raw)) ?? next()
);
app.get(jobsPath, (c) => jobs.board(c.req.raw));
app.get(jobPath, (c) => jobs.job(c.req.raw));

/** A response for API, resume and job paths; undefined lets Vite render the page. */
export const handle = async (request: Request) => {
  const response = await app.fetch(request);
  return response.headers.has(PASS) ? undefined : response;
};
