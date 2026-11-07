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

const guideFiles = import.meta.glob('./guides/*.md', {
  query: '?raw',
  import: 'default',
});

const exampleFiles = import.meta.glob('./examples/*.json', {
  import: 'default',
});

const slugOf = (path: string) => path.replace(/^.*\/|\.(md|json)$/g, '');

export const docSlugs: ReadonlyArray<string> =
  Object.keys(docFiles).map(slugOf);
export const postSlugs: ReadonlyArray<string> =
  Object.keys(postFiles).map(slugOf);
export const guideSlugs: ReadonlyArray<string> =
  Object.keys(guideFiles).map(slugOf);
export const exampleSlugs: ReadonlyArray<string> =
  Object.keys(exampleFiles).map(slugOf);
