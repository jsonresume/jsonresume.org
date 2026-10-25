/** `pnpm dev`: Vite with HMR, every page server-rendered like production. */
import { startDevServer } from '@repo/ssg/dev';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.PORT ?? 5173);
// Local stand-ins for the server's secrets (see deploy/README.md for real ones).
process.env.AUTH_SECRET ??= 'local development only';
process.env.SITE_URL ??= `http://localhost:${port}`;

const { url } = await startDevServer({
  root: join(dirname(fileURLToPath(import.meta.url)), '..'),
  entryServer: 'src/entry-server.tsx',
  handlers: 'server/dev.ts',
  port,
});
process.stdout.write(`dev server on ${url}\n`);
