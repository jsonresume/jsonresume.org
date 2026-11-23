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
- `health.ts` (`@repo/mcp/health`): `checkMcp`, connecting the way MCP
  clients do (discovery, registration, consent page, initialize,
  tools/list, get_resume) and naming the step that broke; run by
  `apps/app/scripts/mcp-health.ts`.

**Every feature on jsonresume.org gets MCP tools.** Adding one: put it in
the catalog, add the tool to a toolkit here (or a new toolkit in
`server.ts`), and test it through the endpoint in `mcp.test.ts`.

`openai-plugin/` is the package for the ChatGPT app directory, with the
steps to submit it in its README.

`server.json` lists the server in the official MCP Registry as
`org.jsonresume/jsonresume` (a remote, streamable HTTP at
`https://jsonresume.org/mcp`). The registry trusts the `org.jsonresume`
namespace because `https://jsonresume.org/.well-known/mcp-registry-auth`
holds the public half of the key in `/etc/jsonresume/mcp-registry.pem`. To
publish a new version, bump `version` here and, on the box:

```sh
MCP_PRIVATE_KEY="$(sudo openssl pkey -in /etc/jsonresume/mcp-registry.pem -noout -text | sed -n '/priv:/,/pub:/p' | sed '1d;$d' | tr -d ' :\n')" \
  mcp-publisher login http --domain jsonresume.org
mcp-publisher publish packages/mcp/server.json
```
