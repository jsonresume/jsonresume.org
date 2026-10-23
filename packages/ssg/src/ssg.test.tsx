import {
  createRootRoute,
  createRoute,
  createRouter,
  HeadContent,
  notFound,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { routerManifestFromVite } from './manifest';
import { createRenderer, fileForPath, prerender, staticPaths } from './server';

const root = createRootRoute({
  head: () => ({ meta: [{ charSet: 'utf-8' }, { title: 'Site' }] }),
  component: () => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  ),
  notFoundComponent: () => <h1>Not found</h1>,
});
const about = createRoute({
  getParentRoute: () => root,
  path: '/about',
  head: () => ({
    meta: [{ title: 'About' }],
    links: [{ rel: 'canonical', href: 'https://example.org/about' }],
  }),
  component: () => <h1>About page</h1>,
});
const post = createRoute({
  getParentRoute: () => root,
  path: '/posts/$id',
  loader: ({ params }) => {
    if (params.id !== 'known') throw notFound();
    return { title: `Post ${params.id}` };
  },
  component: function Post() {
    return <h1>{post.useLoaderData().title}</h1>;
  },
});
const routeTree = root.addChildren([about, post]);
const manifest = routerManifestFromVite(
  {
    'src/entry-client.tsx': {
      file: 'assets/entry-abc.js',
      isEntry: true,
      css: ['assets/entry-abc.css'],
      imports: ['_vendor.js'],
    },
    '_vendor.js': {
      file: 'assets/vendor-def.js',
      css: ['assets/vendor-def.css'],
    },
  },
  'src/entry-client.tsx'
);
const render = createRenderer({
  createRouter: () => createRouter({ routeTree }),
  manifest,
});
const get = (path: string) => render(new Request(`https://example.org${path}`));

describe('routerManifestFromVite', () => {
  it('puts the entry script, its CSS and preloads on the root route', () => {
    expect(manifest.routes.__root__).toEqual({
      css: ['/assets/entry-abc.css', '/assets/vendor-def.css'],
      preloads: ['/assets/vendor-def.js'],
      scripts: [{ attrs: { type: 'module', src: '/assets/entry-abc.js' } }],
    });
  });
});

describe('createRenderer', () => {
  it('renders the document with head, assets and dehydrated data', async () => {
    const res = await get('/about');
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(html).toContain('<title>About</title>');
    expect(html).toContain('href="https://example.org/about"');
    expect(html).toContain('href="/assets/entry-abc.css"');
    expect(html).toContain('src="/assets/entry-abc.js"');
    expect(html).toContain('<h1>About page</h1>');
  });

  it('renders loader data', async () => {
    expect(await (await get('/posts/known')).text()).toContain(
      '<h1>Post known</h1>'
    );
  });

  it('answers unmatched paths and notFound() loaders with 404', async () => {
    expect((await get('/nope')).status).toBe(404);
    expect((await get('/posts/unknown')).status).toBe(404);
  });
});

describe('prerender', () => {
  it('writes each path and a 404 page', async () => {
    const outDir = mkdtempSync(join(tmpdir(), 'ssg-'));
    const pages = await prerender({
      render,
      paths: ['/about'],
      outDir,
      origin: 'https://example.org',
      notFoundPath: '/404',
    });
    expect(pages.map((p) => [p.file, p.status])).toEqual([
      ['about/index.html', 200],
      ['404.html', 404],
    ]);
    expect(readFileSync(join(outDir, 'about/index.html'), 'utf8')).toContain(
      'About page'
    );
  });

  it('refuses to write a page that does not render', async () => {
    const outDir = mkdtempSync(join(tmpdir(), 'ssg-'));
    await expect(
      prerender({
        render,
        paths: ['/posts/unknown'],
        outDir,
        origin: 'https://example.org',
      })
    ).rejects.toThrow('404');
  });

  it('lists static paths and maps them to files', () => {
    expect(staticPaths(createRouter({ routeTree }).routesByPath)).toEqual([
      '/about',
    ]);
    expect(fileForPath('/')).toBe('index.html');
    expect(fileForPath('/blog/hello/')).toBe('blog/hello/index.html');
  });
});
