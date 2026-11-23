import { createFromSource } from 'fumadocs-core/search/server';
import type { StructuredData } from 'fumadocs-core/mdx-plugins';
import { source } from '@/lib/source';

// The docs are a static export, so there is no server to search on: the
// index is written to /docs/api/search.json at build time and searched in the
// browser (layout.tsx sets the search dialog to type 'static').
export const revalidate = false;

// Indexing every table cell and list item made 14,000 entries and a 14MB
// download. One entry per section, its text cut short, still finds the page.
const SNIPPET = 300;

const bySection = (data: StructuredData): StructuredData => {
  const text = new Map<string | undefined, string>();
  for (const c of data.contents)
    text.set(c.heading, `${text.get(c.heading) ?? ''} ${c.content}`.trim());
  return {
    headings: data.headings,
    contents: [...text].map(([heading, content]) => ({
      heading,
      content: content.slice(0, SNIPPET),
    })),
  };
};

export const { staticGET: GET } = createFromSource(source, {
  // Results come back by relevance; sorting by text is never asked for.
  sort: { enabled: false },
  buildIndex: (page) => ({
    id: page.url,
    url: page.url,
    title: page.data.title,
    description: page.data.description,
    structuredData: bySection(page.data.structuredData),
  }),
});
