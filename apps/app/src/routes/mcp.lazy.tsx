import { McpPage } from '@repo/site/mcp';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/_site/mcp')({
  component: McpPage,
});
