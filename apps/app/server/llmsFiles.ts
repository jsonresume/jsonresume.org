import { llmsFullTxt, llmsTxt } from '@repo/content/llms';
import { groups, tools } from '@repo/mcp';

const text = (body: string) =>
  new Response(body, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=3600',
    },
  });

/**
 * /llms.txt and /llms-full.txt (llmstxt.org): the site, the format and the
 * MCP tools in Markdown for language models, built once from the facts,
 * the specifications and the MCP catalog, so they can't drift.
 */
export const llmsRoutes = (site: string) => {
  const origin = site.replace(/\/$/, '') || 'https://jsonresume.org';
  const groupList = Object.entries(groups).map(([key, g]) => ({
    key,
    title: g.title,
  }));
  const short = llmsTxt(origin, tools, groupList);
  let full: Promise<string> | undefined;
  return [
    { path: '/llms.txt', fetch: async () => text(short) },
    {
      path: '/llms-full.txt',
      fetch: async () => text(await (full ??= llmsFullTxt(origin))),
    },
  ];
};
