// Mermaid rendering handled at runtime by the `Pre` override in app/docs/[[...slug]]/page.tsx.
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';

export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig();
