/** Clients beyond the five in ./mcpClients' guides, checked October 2026. */
import { serverUrl, type McpClient } from './mcpClients';

const header = 'Authorization: Bearer $JSONRESUME_API_KEY';

/** Other clients, briefly. */
export const others: McpClient[] = [
  {
    id: 'codex',
    name: 'Codex (CLI and IDE extension)',
    auth: 'either',
    steps: [
      'Add the server to `~/.codex/config.toml`, then run `codex mcp login jsonresume` to sign in.',
      'Or put your API key in `JSONRESUME_API_KEY` and add `bearer_token_env_var = "JSONRESUME_API_KEY"` instead of logging in.',
    ],
    code: {
      label: '~/.codex/config.toml',
      code: `[mcp_servers.jsonresume]\nurl = "${serverUrl}"`,
    },
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    auth: 'key',
    steps: [
      'Add the server to `~/.codeium/windsurf/mcp_config.json` (or **Settings → Cascade → MCP servers → View raw config**), with your API key.',
    ],
    code: {
      label: 'mcp_config.json',
      code: `{\n  "mcpServers": {\n    "jsonresume": {\n      "serverUrl": "${serverUrl}",\n      "headers": { "Authorization": "Bearer jr_…" }\n    }\n  }\n}`,
    },
  },
  {
    id: 'cline',
    name: 'Cline and Roo Code',
    auth: 'key',
    steps: [
      'Open the MCP servers panel, choose **Configure** (or **Edit MCP settings**) and add the server with your API key.',
    ],
    code: {
      label: 'MCP settings',
      code: `{\n  "mcpServers": {\n    "jsonresume": {\n      "type": "streamableHttp",\n      "url": "${serverUrl}",\n      "headers": { "Authorization": "Bearer jr_…" }\n    }\n  }\n}`,
    },
  },
  {
    id: 'zed',
    name: 'Zed',
    auth: 'key',
    steps: [
      'Add a context server to your Zed `settings.json` with your API key, then turn it on in the Agent panel.',
    ],
    code: {
      label: 'settings.json',
      code: `{\n  "context_servers": {\n    "jsonresume": {\n      "url": "${serverUrl}",\n      "headers": { "Authorization": "Bearer jr_…" }\n    }\n  }\n}`,
    },
  },
  {
    id: 'goose',
    name: 'Goose',
    auth: 'key',
    steps: [
      'Run `goose configure`, choose **Add Extension → Remote Extension (Streamable HTTP)**, paste the URL and add the `Authorization` header with your API key. In the desktop app, it is **Extensions → Add custom extension**.',
    ],
  },
  {
    id: 'other',
    name: 'Anything else',
    auth: 'key',
    steps: [
      `Any client that speaks Streamable HTTP: the URL is \`${serverUrl}\`, with \`${header}\`.`,
      'A client that only runs local (stdio) servers can reach it through `mcp-remote`. To try the tools by hand, use the MCP Inspector: `npx @modelcontextprotocol/inspector`.',
    ],
    code: {
      label: 'stdio bridge',
      code: `npx -y mcp-remote ${serverUrl} --header "${header}"`,
    },
  },
];
