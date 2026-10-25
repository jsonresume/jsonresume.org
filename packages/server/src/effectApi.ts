import type { FileSystem, Path } from 'effect';
import { Layer } from 'effect';
import {
  type Etag,
  HttpRouter,
  HttpServer,
  type HttpPlatform,
} from 'effect/http';

/** What HttpApiBuilder.layer needs besides its handlers; HttpServer.layerServices provides it. */
type ServerServices =
  | HttpRouter.HttpRouter
  | Etag.Generator
  | FileSystem.FileSystem
  | HttpPlatform.HttpPlatform
  | Path.Path;

/**
 * Turn Effect HTTP routes (HttpApiBuilder.layer(Api) with its handler layers
 * provided) into a web handler (Request in, Response out) that Hono mounts.
 */
export function effectWebHandler<E>(
  routes: Layer.Layer<never, E, ServerServices>,
  /** Share with other runtimes so they reuse the same layers (one DB pool). */
  options: { memoMap?: Layer.MemoMap } = {}
) {
  return HttpRouter.toWebHandler(
    routes.pipe(Layer.provide(HttpServer.layerServices)),
    options
  );
}
