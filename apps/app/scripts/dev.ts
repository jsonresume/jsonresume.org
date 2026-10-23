/** `pnpm dev`: Vite with HMR, every page server-rendered like production. */
import { startDevServer } from '@repo/ssg/dev';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const { url } = await startDevServer({
  root: join(dirname(fileURLToPath(import.meta.url)), '..'),
  entryServer: 'src/entry-server.tsx',
  handlers: 'server/dev.ts',
  port: Number(process.env.PORT ?? 5173),
});
process.stdout.write(`dev server on ${url}\n`);
