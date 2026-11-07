/**
 * How to connect each MCP client to jsonresume.org. The five in `guides`
 * were checked against their makers' docs on 2026-11-07:
 * - Claude: support.claude.com/en/articles/11175166 (custom connectors)
 * - Claude Code: code.claude.com/docs/en/mcp
 * - ChatGPT: developers.openai.com/plugins/deploy/connect-chatgpt and
 *   developers.openai.com/api/docs/guides/custom-mcp-server
 * - Cursor: cursor.com/docs/context/mcp
 * - Gemini CLI: geminicli.com/docs/tools/mcp-server
 * - VS Code: code.visualstudio.com/docs/copilot/customization/mcp-servers
 *   and /docs/copilot/reference/mcp-configuration
 * The rest (./mcpOtherClients) were checked in October 2026. Menus move:
 * say where a setting lives rather than every click.
 */

export const serverUrl = 'https://jsonresume.org/mcp';

export interface McpClient {
  id: string;
  name: string;
  /** Signs in with OAuth (no key to copy), or needs an API key. */
  auth: 'oauth' | 'key' | 'either';
  steps: string[];
  code?: { label: string; code: string };
}

/** A tab of the setup guide: one app, or a family (Claude and Claude Code). */
export interface McpGuide {
  id: string;
  label: string;
  clients: McpClient[];
}

const allow = 'sign in to jsonresume.org and choose **Allow**';

export const guides: McpGuide[] = [
  {
    id: 'claude',
    label: 'Claude',
    clients: [
      {
        id: 'claude-app',
        name: 'Claude (claude.ai and the desktop app)',
        auth: 'oauth',
        steps: [
          'In Claude, open **Customize → Connectors**, choose **+ Add** and then **Add custom connector**. On a Team or Enterprise plan an owner adds it first, under **Organization settings → Connectors**; on the Free plan you can add one custom connector.',
          `Name it *JSON Resume*, paste \`${serverUrl}\` and choose **Continue**. If Claude asks which OAuth client to use, choose **Register automatically**. Then **Connect**, ${allow}.`,
          'In a chat, open the **+** menu, then **Connectors**, and switch JSON Resume on. The prompts (review my resume, cover letter, …) are in the same menu.',
        ],
      },
      {
        id: 'claude-code',
        name: 'Claude Code',
        auth: 'either',
        steps: [
          'Add the server (with `--scope user` to have it in every project), then run `/mcp` inside Claude Code, pick **jsonresume** and sign in in your browser.',
          'Or skip the sign-in with an API key: add `--header "Authorization: Bearer jr_…"`.',
        ],
        code: {
          label: 'Terminal',
          code: `claude mcp add --transport http jsonresume ${serverUrl}`,
        },
      },
    ],
  },
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    clients: [
      {
        id: 'chatgpt-app',
        name: 'ChatGPT',
        auth: 'oauth',
        steps: [
          'On chatgpt.com, open **Plugins** (chatgpt.com/plugins), choose **+** and then **Add custom MCP server**. In a Business, Enterprise or Edu workspace, your admin may need to allow it.',
          `Name it *JSON Resume*, set the **Server URL** to \`${serverUrl}\` and authentication to **OAuth**. Select **I understand and want to continue**, then **Create as a plugin**.`,
          `Install it from your plugins: jsonresume.org opens, ${allow}. In a new chat, type **@**, pick JSON Resume and ask away. ChatGPT asks before each change to your resume.`,
        ],
      },
    ],
  },
  {
    id: 'cursor',
    label: 'Cursor',
    clients: [
      {
        id: 'cursor-app',
        name: 'Cursor',
        auth: 'either',
        steps: [
          'Add the server to `~/.cursor/mcp.json` for every project, or to `.cursor/mcp.json` in one project.',
          `Cursor signs in with OAuth: when it asks, ${allow}. Turn the server on or off under **Customize** in the sidebar.`,
          'With an API key instead, add `"headers": { "Authorization": "Bearer jr_…" }` next to the URL.',
        ],
        code: {
          label: '~/.cursor/mcp.json',
          code: `{\n  "mcpServers": {\n    "jsonresume": { "url": "${serverUrl}" }\n  }\n}`,
        },
      },
    ],
  },
  {
    id: 'gemini',
    label: 'Gemini CLI',
    clients: [
      {
        id: 'gemini-cli',
        name: 'Gemini CLI',
        auth: 'either',
        steps: [
          'Add the server with the command below; `-s user` keeps it in `~/.gemini/settings.json` for every project (without it, it goes in this project’s `.gemini/settings.json`). Or add `{ "mcpServers": { "jsonresume": { "httpUrl": "…" } } }` to that file yourself.',
          'Run `/mcp auth jsonresume` in Gemini CLI to sign in; `/mcp` shows it connected.',
          'Or use an API key: add `-H "Authorization: Bearer jr_…"` to the command.',
        ],
        code: {
          label: 'Terminal',
          code: `gemini mcp add -s user --transport http jsonresume ${serverUrl}`,
        },
      },
    ],
  },
  {
    id: 'vscode',
    label: 'VS Code',
    clients: [
      {
        id: 'vscode-copilot',
        name: 'VS Code (GitHub Copilot)',
        auth: 'either',
        steps: [
          'Add the server to `.vscode/mcp.json` in your project. For every project, run **MCP: Open User Configuration** and add it there; or run **MCP: Add Server** from the Command Palette, choose **HTTP** and paste the URL.',
          `When VS Code asks, ${allow}. Or add \`"headers": { "Authorization": "Bearer jr_…" }\` to use an API key.`,
          'Use it in Copilot Chat in **Agent** mode; **Configure Tools** picks which tools it may call.',
        ],
        code: {
          label: '.vscode/mcp.json',
          code: `{\n  "servers": {\n    "jsonresume": { "type": "http", "url": "${serverUrl}" }\n  }\n}`,
        },
      },
    ],
  },
];
