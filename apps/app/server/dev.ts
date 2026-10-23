/**
 * Live routes for `pnpm dev` (see scripts/dev.ts): the API and resumes, as
 * in production, on an in-memory Postgres (PGlite) that starts empty.
 */
import { apiRoutes } from '@repo/api-server';
import { InMemoryDatabase } from '@repo/database/testing';
import { effectWebHandler, sameOrigin } from '@repo/server';
import { Hono } from 'hono';
import { Layer } from 'effect';
import { render } from '../src/entry-server';
import { createResumeHandler } from './resumes';
import { appServices } from './services';

const services = appServices(InMemoryDatabase);
const memoMap = Layer.makeMemoMapUnsafe();
const api = effectWebHandler(apiRoutes('dev').pipe(Layer.provide(services)), {
  memoMap,
});
const resumes = createResumeHandler(render, services, { memoMap });

const app = new Hono();
app.use('*', sameOrigin('/api', ['/api/events/']));
app.all('/api/*', (c) => api.handler(c.req.raw));
app.get(
  '/:handle{@[^/]+}',
  async (c, next) => (await resumes.fetch(c.req.raw)) ?? next()
);

/** A response for API and resume paths; undefined lets Vite render the page. */
export const handle = async (request: Request) => {
  const response = await app.fetch(request);
  return response.status === 404 &&
    !new URL(request.url).pathname.startsWith('/api')
    ? undefined
    : response;
};
