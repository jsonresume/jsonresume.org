# @repo/mcp

jsonresume.org for agents: the MCP server at `https://jsonresume.org/mcp`
(Streamable HTTP, protocol revisions 2025-03-26 to 2026-07-28), built on
Effect's `McpServer`.

- `catalog.ts`: every tool and prompt as plain data. The server takes its
  descriptions from it and the `/mcp` page lists it, so they can't drift
  (the tests check the server lists exactly the catalog).
- `resumeTools.ts`, `accountTools.ts` (themes, readers, account),
  `jobTools.ts`: the tools, each a `Tool` with Effect Schema parameters, a
  `ToolError` failure the agent sees, and MCP hints (read-only unless it
  writes).
- `prompts.ts`: the registry's AI features (review, tailor, cover letter,
  interview, job hunt) as prompts the user's own agent runs.
- `server.ts`: `McpRoutes`, with Bearer authentication in front: an API key
  (`jr_…`, Settings) or an OAuth access token (`jro_…`, `@repo/accounts`
  OAuth). Tools read the user as `McpCaller`.
- `discovery.ts`: the OAuth metadata the app serves at `/.well-known`.

**Every feature on jsonresume.org gets MCP tools.** Adding one: put it in
the catalog, add the tool to a toolkit here (or a new toolkit in
`server.ts`), and test it through the endpoint in `mcp.test.ts`.

`openai-plugin/` is the package for the ChatGPT app directory, with the
steps to submit it in its README.
