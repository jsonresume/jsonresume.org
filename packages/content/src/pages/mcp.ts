/**
 * /mcp: connecting agents to jsonresume.org. Setup steps per client were
 * checked against each client's docs in October 2026; menus move, so keep
 * them short and say where the setting lives rather than every click.
 */

export const serverUrl = 'https://jsonresume.org/mcp';

export const intro = {
  eyebrow: 'MCP',
  title: 'Your resume, in your agent',
  lede: 'Connect ChatGPT, Claude, Cursor or any MCP client to jsonresume.org. Your agent can then read and rewrite your resume, check it against the schema and for tracking systems, export it as a PDF, change its theme, tell you who has been reading it, search other resumes and find jobs that fit, saving straight to your gist.',
};

export const auth = {
  oauth:
    'Apps that sign in for you (ChatGPT, Claude, Claude Code, Cursor, VS Code) open jsonresume.org, you choose **Allow**, and they are connected. Disconnect them any time in [Settings](/dashboard/settings).',
  key: 'Everything else sends an API key in the `Authorization` header (`Bearer jr_…`): make one under [Settings → API keys](/dashboard/settings#api-keys). It is shown once.',
};

export interface McpClient {
  id: string;
  name: string;
  /** Signs in with OAuth (no key to copy), or needs an API key. */
  auth: 'oauth' | 'key' | 'either';
  steps: string[];
  code?: { label: string; code: string };
}

const header = 'Authorization: Bearer $JSONRESUME_API_KEY';

export const clients: McpClient[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    auth: 'oauth',
    steps: [
      'Open **Settings → Apps & Connectors → Advanced settings** and turn on **Developer mode** (Plus, Pro, Business, Enterprise and Edu plans).',
      `Back in **Apps & Connectors**, choose **Create**. Name it *JSON Resume*, set the MCP server URL to \`${serverUrl}\` and authentication to **OAuth**, then create it.`,
      'Sign in to jsonresume.org and choose **Allow**. In a chat, pick JSON Resume from the **+** menu (Developer mode) and ask away.',
    ],
  },
  {
    id: 'claude',
    name: 'Claude (claude.ai and the desktop app)',
    auth: 'oauth',
    steps: [
      'Open **Settings → Connectors** and choose **Add custom connector**.',
      `Name it *JSON Resume*, paste \`${serverUrl}\` and add it. Choose **Connect**, sign in to jsonresume.org and **Allow**.`,
      'In a chat, turn it on from the tools menu. The prompts (review my resume, cover letter, …) appear under the **+** menu.',
    ],
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    auth: 'either',
    steps: [
      'Add the server, then run `/mcp` inside Claude Code and choose **Authenticate** to sign in.',
      'Or skip the sign-in with an API key: add `--header "Authorization: Bearer jr_…"`.',
    ],
    code: {
      label: 'Terminal',
      code: `claude mcp add --transport http jsonresume ${serverUrl}`,
    },
  },
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
    id: 'cursor',
    name: 'Cursor',
    auth: 'either',
    steps: [
      'Add the server to `~/.cursor/mcp.json` (or **Settings → MCP → Add new MCP server**). Cursor shows **Needs login**: click it to sign in.',
      'With an API key instead, add `"headers": { "Authorization": "Bearer jr_…" }`.',
    ],
    code: {
      label: '~/.cursor/mcp.json',
      code: `{\n  "mcpServers": {\n    "jsonresume": { "url": "${serverUrl}" }\n  }\n}`,
    },
  },
  {
    id: 'vscode',
    name: 'VS Code (GitHub Copilot)',
    auth: 'either',
    steps: [
      'Run **MCP: Add Server…** from the Command Palette, choose **HTTP** and paste the URL, or add it to `.vscode/mcp.json`. Copilot asks you to sign in the first time a tool runs.',
      'Use the tools in Copilot Chat’s **Agent** mode.',
    ],
    code: {
      label: '.vscode/mcp.json',
      code: `{\n  "servers": {\n    "jsonresume": { "type": "http", "url": "${serverUrl}" }\n  }\n}`,
    },
  },
  {
    id: 'gemini',
    name: 'Gemini CLI',
    auth: 'either',
    steps: [
      'Add the server to `~/.gemini/settings.json`, then run `/mcp auth jsonresume` in Gemini CLI to sign in.',
      `Or add \`"headers": { "Authorization": "Bearer $JSONRESUME_API_KEY" }\` to use an API key.`,
    ],
    code: {
      label: '~/.gemini/settings.json',
      code: `{\n  "mcpServers": {\n    "jsonresume": { "httpUrl": "${serverUrl}" }\n  }\n}`,
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

/** Things to ask, once it's connected. */
export const examples = [
  'Read my resume and tell me the three weakest bullet points, then rewrite them.',
  'Add my new job at Acme as a Staff Engineer starting this month, and move the old one to past.',
  'Check my resume against the schema and fix anything wrong.',
  'How will applicant tracking systems read my resume? Fix the three most important problems.',
  'Give me a PDF of my resume in a clean single-column theme, on Letter paper.',
  'Find Rust developers in Berlin on Explore and summarise what they have in common.',
  'Show me five themes that suit a designer, then switch my page to the one I pick.',
  'How many people read my resume this month, and where did they come from?',
  'Find remote TypeScript jobs paying over $150k that fit my resume, and mark the best three as interested.',
  'Write a cover letter for the job I marked interested most recently.',
];

export const promise = {
  title: 'Everything on jsonresume.org, for agents',
  text: 'Every feature of jsonresume.org has MCP tools, and every new one ships with them: if you can do it on the site, your agent can do it too. Something missing? [Ask on GitHub](https://github.com/jsonresume/jsonresume.org/issues).',
};

export const security = [
  'Tools act as you, on your account only. Each app’s access is separate; disconnect one in [Settings](/dashboard/settings) without touching the others.',
  'Changes that write (saving your resume, marking jobs, a new username) are marked as such, so your agent’s app can ask before making them.',
  'API keys are stored hashed and shown once. OAuth access tokens last an hour and are refreshed by the app.',
];
