import { Explore } from '@repo/explore';
import { JobBoard } from '@repo/jobs';
import { chunk, sitemapIndex, urlSet } from '@repo/server/sitemap';
import { Effect, type Layer, ManagedRuntime } from 'effect';

/**
 * The prerendered pages' sitemap, written by scripts/prerender.ts (static
 * pages, docs, blog posts, /jobs and /explore).
 */
export const pagesSitemap = '/sitemap-pages.xml';

/** Hono path patterns: the index, and the live sitemaps it names. */
export const sitemapPath = '/sitemap.xml';
export const liveSitemapPath = '/:file{sitemap-(?:jobs|resumes-[0-9]+)\\.xml}';

const xml = (body: string) =>
  new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      // Explore's index is rebuilt every ten minutes, jobs every two hours.
      'cache-control': 'public, max-age=3600',
    },
  });

/**
 * /sitemap.xml, an index of: the prerendered pages, every open job
 * (/jobs/:id), and every resume Explore lists (/@username), in files of at
 * most 40,000. Resumes that opted out of Explore are left out.
 */
export function createSitemaps<E>(
  site: string,
  services: Layer.Layer<Explore | JobBoard, E>,
  options: { memoMap?: Layer.MemoMap } = {}
) {
  const runtime = ManagedRuntime.make(services, options);

  const resumes = Effect.gen(function* () {
    const listings = yield* (yield* Explore).listings;
    // Sorted, so each file keeps the same people from one hour to the next.
    return chunk(
      [...listings]
        .sort((a, b) => (a.username < b.username ? -1 : 1))
        .map((l) => ({ path: `/@${l.username}`, lastmod: l.updatedAt }))
    );
  });
  const jobs = Effect.gen(function* () {
    const board = yield* (yield* JobBoard).board;
    return board.jobs.map((job) => ({
      path: `/jobs/${job.id}`,
      lastmod: job.postedAt,
    }));
  });

  const index = async () => {
    const files = await runtime.runPromise(resumes);
    return xml(
      sitemapIndex(site, [
        { path: pagesSitemap },
        { path: '/sitemap-jobs.xml' },
        ...files.map((_, i) => ({ path: `/sitemap-resumes-${i + 1}.xml` })),
      ])
    );
  };

  const file = async (request: Request) => {
    const name = new URL(request.url).pathname;
    if (name === '/sitemap-jobs.xml')
      return xml(urlSet(site, await runtime.runPromise(jobs)));
    const page = Number(/resumes-([0-9]+)/.exec(name)?.[1] ?? 0);
    const files = await runtime.runPromise(resumes);
    const entries = files[page - 1];
    return entries ? xml(urlSet(site, entries)) : undefined;
  };

  return { index, file, dispose: () => runtime.dispose() };
}
