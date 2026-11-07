import { BlogPost, Doc, ExampleResume } from '@repo/domain';
import { Schema } from 'effect';
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
const guideSources = import.meta.glob<string>('./guides/*.md', {
  query: '?raw',
  import: 'default',
});

const exampleSources = import.meta.glob<unknown>('./examples/*.json', {
  import: 'default',
});

const slugOf = (path: string) => path.replace(/^.*\/|\.(md|json)$/g, '');

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

/** Slugs of every resume-writing guide (/guides/<slug>). */
export const guideSlugs: ReadonlyArray<string> =
  Object.keys(guideSources).map(slugOf);

/** One guide, or undefined for an unknown slug. */
export const loadGuide = (slug: string): Promise<Doc | undefined> =>
  load(guideSources, `./guides/${slug}.md`, decodeDoc);

/** Every guide, by title. */
export const loadGuides = async (): Promise<Doc[]> =>
  (await loadAll(guideSlugs, loadGuide)).sort((a, b) =>
    a.title.localeCompare(b.title)
  );

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

export interface PostLink {
  slug: string;
  title: string;
  date: string;
}

/** A post with its neighbours by date, for "newer" and "older" links. */
export async function loadPostWithNeighbours(
  slug: string
): Promise<{ post: BlogPost; newer?: PostLink; older?: PostLink } | undefined> {
  const all = await loadPosts();
  const index = all.findIndex((post) => post.slug === slug);
  if (index < 0) return undefined;
  const link = (post: BlogPost | undefined): PostLink | undefined =>
    post ? { slug: post.slug, title: post.title, date: post.date } : undefined;
  const newer = link(all[index - 1]);
  const older = link(all[index + 1]);
  return {
    post: all[index],
    ...(newer ? { newer } : {}),
    ...(older ? { older } : {}),
  };
}

/** The first paragraph of a Markdown body as plain text, for listings. */
export function excerpt(body: string, max = 220): string {
  const first =
    body
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .find((block) => block && !/^(#|!\[|\||```|>|-|\*)/.test(block)) ?? '';
  const text = first
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max
    ? `${text.slice(0, max).replace(/\s+\S*$/, '')}…`
    : text;
}

const decodeExample = Schema.decodeUnknownSync(ExampleResume);

/** Slugs of every example resume (/examples/<slug>). */
export const exampleSlugs: ReadonlyArray<string> =
  Object.keys(exampleSources).map(slugOf);

/** One example resume, or undefined for an unknown slug. */
export const loadExample = async (
  slug: string
): Promise<ExampleResume | undefined> => {
  const source = exampleSources[`./examples/${slug}.json`];
  return source ? decodeExample(await source()) : undefined;
};

/** Every example, by field then role. */
export const loadExamples = async (): Promise<ExampleResume[]> =>
  (await loadAll(exampleSlugs, loadExample)).sort(
    (a, b) => a.field.localeCompare(b.field) || a.role.localeCompare(b.role)
  );
