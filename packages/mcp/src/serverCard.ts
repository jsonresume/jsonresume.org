/** The MCP protocol revisions /mcp speaks, newest first (see server.ts). */
export const PROTOCOL_VERSIONS = [
  '2026-07-28',
  '2025-11-25',
  '2025-06-18',
  '2025-03-26',
] as const;

/** Where the card is served: the recommended place, under the endpoint. */
export const SERVER_CARD_PATH = '/mcp/server-card';

/**
 * The MCP Server Card (SEP-2127, experimental): what a client needs to
 * connect before it connects. The same identity as server.json, which the
 * MCP Registry lists. Nothing about any user, and no tool list (clients
 * ask the server for that).
 */
export const serverCard = (site: string) => ({
  $schema:
    'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json',
  name: 'org.jsonresume/jsonresume',
  title: 'JSON Resume',
  description:
    'Read, write, validate and theme your resume.json; export PDF and Word; match it to HN jobs.',
  version: '1.0.0',
  websiteUrl: `${site}/mcp`,
  icons: [{ src: `${site}/favicon.svg`, mimeType: 'image/svg+xml' }],
  repository: {
    url: 'https://github.com/jsonresume/jsonresume.org',
    source: 'github',
    subfolder: 'packages/mcp',
  },
  remotes: [
    {
      type: 'streamable-http',
      url: `${site}/mcp`,
      supportedProtocolVersions: [...PROTOCOL_VERSIONS],
    },
  ],
});

/**
 * /.well-known/ai-catalog.json (AI Catalog 0.9): where agents look first
 * for what a site offers them, pointing at the server card.
 */
export const aiCatalog = (site: string) => ({
  specVersion: '0.9',
  host: {
    displayName: 'JSON Resume',
    identifier: new URL(site).host,
    documentationUrl: `${site}/mcp`,
    logoUrl: `${site}/favicon.svg`,
  },
  entries: [
    {
      identifier: `urn:air:${new URL(site).host}:mcp:jsonresume`,
      type: 'application/mcp-server-card+json',
      url: `${site}${SERVER_CARD_PATH}`,
    },
  ],
});
