// @repo/content/slugs: which documents and posts exist, without loading
// them or the code that decodes them (for routes and prerendering).
// Lazy, and never called here: only the keys are used.
const docFiles = import.meta.glob('./docs/*.md', {
  query: '?raw',
  import: 'default',
});
const postFiles = import.meta.glob('./blog/*.md', {
  query: '?raw',
  import: 'default',
});

const slugOf = (path: string) => path.replace(/^.*\/|\.md$/g, '');

export const docSlugs: ReadonlyArray<string> =
  Object.keys(docFiles).map(slugOf);
export const postSlugs: ReadonlyArray<string> =
  Object.keys(postFiles).map(slugOf);
