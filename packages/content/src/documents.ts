import { BlogPost, Doc } from '@repo/domain';
import { decodeContent } from './decode';
import { parseFrontMatter } from './frontMatter';

// Each Markdown file is its own lazily loaded module, so a page only
// downloads the document it shows. Slugs are known without loading anything.
const docSources = import.meta.glob<string>('./docs/*.md', {
  query: '?raw',
  import: 'default',
});
const postSources = import.meta.glob<string>('./blog/*.md', {
  query: '?raw',
  import: 'default',
});

const slugOf = (path: string) => path.replace(/^.*\/|\.md$/g, '');

const decodeDoc = decodeContent(Doc);
const decodePost = decodeContent(BlogPost);

async function load<T>(
  sources: Record<string, () => Promise<string>>,
  path: string,
  decode: (input: unknown) => T
): Promise<T | undefined> {
  const source = sources[path];
  if (!source) return undefined;
  const { data, body } = parseFrontMatter(await source(), path);
  return decode({ ...data, slug: slugOf(path), body });
}

/** Slugs of every documentation page (/getting-started, /cli, ...). */
export const docSlugs: ReadonlyArray<string> =
  Object.keys(docSources).map(slugOf);

/** Slugs of every blog post. */
export const postSlugs: ReadonlyArray<string> =
  Object.keys(postSources).map(slugOf);

/** One document, or undefined for an unknown slug. */
export const loadDoc = (slug: string): Promise<Doc | undefined> =>
  load(docSources, `./docs/${slug}.md`, decodeDoc);

/** One blog post, or undefined for an unknown slug. */
export const loadPost = (slug: string): Promise<BlogPost | undefined> =>
  load(postSources, `./blog/${slug}.md`, decodePost);

async function loadAll<T>(
  slugs: ReadonlyArray<string>,
  one: (slug: string) => Promise<T | undefined>
): Promise<T[]> {
  const items = await Promise.all(slugs.map(one));
  return items.filter((item): item is Awaited<T> & T => item !== undefined);
}

export const loadDocs = (): Promise<Doc[]> => loadAll(docSlugs, loadDoc);

/** Every post, newest first. */
export const loadPosts = async (): Promise<BlogPost[]> =>
  (await loadAll(postSlugs, loadPost)).sort((a, b) =>
    b.date.localeCompare(a.date)
  );
