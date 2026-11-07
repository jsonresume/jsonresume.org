/**
 * /mcp: connecting agents to jsonresume.org. The setup steps for each
 * client are in ./mcpClients (with the docs they were checked against).
 */

export { guides, serverUrl, type McpClient, type McpGuide } from './mcpClients';
export { others } from './mcpOtherClients';

export const intro = {
  eyebrow: 'MCP',
  title: 'Your resume, in your agent',
  lede: 'Connect Claude, ChatGPT, Cursor, Gemini, VS Code or any MCP client to jsonresume.org. Your agent can then read and rewrite your resume, check it against the schema and for tracking systems, export it as a PDF or Word document, change its theme, tell you who has been reading it, search other resumes and find jobs that fit, saving straight to your gist.',
};

export const auth = {
  oauth:
    'Apps that sign in for you (ChatGPT, Claude, Claude Code, Cursor, Gemini CLI, VS Code, Codex) open jsonresume.org, you choose **Allow**, and they are connected. Disconnect them any time in [Settings](/dashboard/settings).',
  key: 'Everything else sends an API key in the `Authorization` header (`Bearer jr_…`): make one under [Settings → API keys](/dashboard/settings#api-keys). It is shown once.',
};

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
