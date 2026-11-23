import { loadSchemaFile, SCHEMA_PATHS } from '@repo/content/spec';

/**
 * /schema.json, /job-schema.json and /company-schema.json: the definitions
 * the specifications link to, as @jsonresume/schema ships them. Their $id
 * stays the GitHub raw URL; these are a stable copy on the site, open to
 * any origin so validators in browsers can fetch them.
 */
export const schemaFileRoutes = () =>
  SCHEMA_PATHS.map((path) => ({
    path,
    fetch: async () =>
      new Response(await loadSchemaFile(path), {
        headers: {
          'content-type': 'application/schema+json; charset=utf-8',
          'access-control-allow-origin': '*',
          'cache-control': 'public, max-age=3600',
        },
      }),
  }));
