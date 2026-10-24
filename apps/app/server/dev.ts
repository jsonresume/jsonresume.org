/**
 * Live routes for `pnpm dev` (see scripts/dev.ts): the API, resumes and
 * jobs, as in production, on an in-memory Postgres (PGlite) that starts
 * empty (the job board too: run the pipeline against it to fill it).
 */
import { apiRoutes } from '@repo/api-server';
import { InMemoryDatabase } from '@repo/database/testing';
import { effectWebHandler, sameOrigin } from '@repo/server';
import { Hono } from 'hono';
import { Layer } from 'effect';
import { render } from '../src/entry-server';
import { createJobPages, jobPath, jobsPath } from './jobPages';
import { createResumeHandler } from './resumes';
import { appServices } from './services';

const services = appServices(InMemoryDatabase);
const memoMap = Layer.makeMemoMapUnsafe();
const api = effectWebHandler(apiRoutes('dev').pipe(Layer.provide(services)), {
  memoMap,
});
const resumes = createResumeHandler(render, services, { memoMap });
const jobs = createJobPages(render, services, { memoMap });

// Paths these routes don't answer fall through, marked, to Vite's renderer.
const PASS = 'x-dev-pass';
const app = new Hono();
app.notFound((c) => c.body(null, 404, { [PASS]: '1' }));
app.use('*', sameOrigin('/api', ['/api/events/', '/api/v1/']));
app.all('/api/*', (c) => api.handler(c.req.raw));
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
