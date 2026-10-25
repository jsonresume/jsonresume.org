import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export interface PrerenderOptions {
  /** A renderer from createRenderer(). */
  render: (request: Request) => Promise<Response>;
  /** Paths to write, e.g. ['/', '/blog', '/blog/hello']. */
  paths: ReadonlyArray<string>;
  outDir: string;
  /** Origin the pages are rendered for, e.g. 'https://jsonresume.org'. */
  origin: string;
  /** Also render this (unmatched) path to 404.html. */
  notFoundPath?: string;
}

export interface RenderedPage {
  path: string;
  file: string;
  status: number;
}

/** Output file for a path: '/' -> index.html, '/blog/hello' -> blog/hello/index.html. */
export const fileForPath = (path: string) =>
  path === '/'
    ? 'index.html'
    : join(path.replace(/^\/+|\/+$/g, ''), 'index.html');

/**
 * Render each path through the SSR renderer and write the HTML to outDir.
 * Throws if a listed path does not render with status 200.
 */
export async function prerender({
  render,
  paths,
  outDir,
  origin,
  notFoundPath,
}: PrerenderOptions): Promise<RenderedPage[]> {
  const pages: RenderedPage[] = [];
  const write = async (path: string, file: string) => {
    const response = await render(new Request(new URL(path, origin)));
    const target = join(outDir, file);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, await response.text());
    pages.push({ path, file, status: response.status });
    return response.status;
  };
  for (const path of paths) {
    const status = await write(path, fileForPath(path));
    if (status !== 200)
      throw new Error(`Prerender: ${path} returned ${status}`);
  }
  if (notFoundPath) {
    const status = await write(notFoundPath, '404.html');
    if (status !== 404)
      throw new Error(`Prerender: ${notFoundPath} returned ${status}, not 404`);
  }
  return pages;
}

/** Paths of routes without params, for prerendering everything static. */
export function staticPaths(routesByPath: Record<string, unknown>): string[] {
  return Object.keys(routesByPath)
    .filter((path) => !path.includes('$'))
    .map((path) => path.replace(/(.)\/$/, '$1'));
}
