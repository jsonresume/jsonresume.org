import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';

// baseUrl is '/' because next.config.mjs sets basePath: '/docs' — Next
// prefixes every link and asset, so pages resolve to jsonresume.org/docs/<slug>.
export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
});
