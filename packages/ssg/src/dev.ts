import {
  createServer as createHttpServer,
  type IncomingMessage,
} from 'node:http';
import type { ViteDevServer } from 'vite';

export interface DevServerOptions {
  /** The app root, where vite.config.ts lives. */
  root: string;
  /** Server entry, relative to root; must export `render(request): Promise<Response>`. */
  entryServer: string;
  port: number;
  host?: string;
}

const toRequest = (req: IncomingMessage, origin: string) =>
  new Request(new URL(req.url ?? '/', origin), {
    method: req.method,
    headers: Object.entries(req.headers).flatMap(([key, value]) =>
      value === undefined
        ? []
        : [
            [key, Array.isArray(value) ? value.join(', ') : value] as [
              string,
              string
            ],
          ]
    ),
  });

/**
 * `vite dev` for a TanStack Router SSR app: Vite serves modules, assets and
 * HMR; every other GET is rendered fresh through the server entry, so dev
 * shows the same HTML production prerenders.
 */
export async function startDevServer({
  root,
  entryServer,
  port,
  host = '127.0.0.1',
}: DevServerOptions) {
  const { createServer } = await import('vite');
  const vite: ViteDevServer = await createServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom',
  });
  const origin = `http://${host}:${port}`;

  const server = createHttpServer((req, res) => {
    vite.middlewares(req, res, async () => {
      try {
        const entry = await vite.ssrLoadModule(`/${entryServer}`);
        const response: Response = await entry.render(toRequest(req, origin));
        res.statusCode = response.status;
        response.headers.forEach((value, name) => res.setHeader(name, value));
        res.end(await response.text());
      } catch (error) {
        if (error instanceof Error) vite.ssrFixStacktrace(error);
        res.statusCode = 500;
        res.end(error instanceof Error ? error.stack : String(error));
      }
    });
  });
  server.listen(port, host);
  return { server, vite, url: origin };
}
