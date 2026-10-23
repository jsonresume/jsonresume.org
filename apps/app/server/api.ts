import { Health, JsonResumeApi } from '@repo/api';
import { Effect, Layer } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';

/** The server side of @repo/api: one handler layer per API group. */
export const apiLayer = (version: string) =>
  HttpApiBuilder.layer(JsonResumeApi, {
    openapiPath: '/api/openapi.json',
  }).pipe(
    Layer.provide(
      HttpApiBuilder.group(JsonResumeApi, 'system', (handlers) =>
        handlers.handle('health', () =>
          Effect.succeed(new Health({ status: 'ok', version }))
        )
      )
    )
  );
