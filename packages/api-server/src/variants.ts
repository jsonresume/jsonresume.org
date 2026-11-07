import { Accounts } from '@repo/accounts';
import {
  CurrentUser,
  InvalidResume,
  JsonResumeApi,
  NoResume,
  VariantNotFound,
} from '@repo/api';
import { Variants, type Variant } from '@repo/resume-versions';
import { Effect, Predicate } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';

const toSummary = (username: string, v: Variant) => ({
  slug: v.slug,
  name: v.name,
  jobId: v.jobId,
  path: `/@${username}/${v.slug}`,
  updatedAt: v.updatedAt.toISOString(),
});

const isObject = (r: unknown) => Predicate.isObject(r) && !Array.isArray(r);
const notObject = new InvalidResume({
  message: 'A resume is one JSON object, starting with {.',
});

/** The signed-in account's variants: list, make, read, save, delete. */
export const VariantsHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'variants',
  (handlers) =>
    Effect.gen(function* () {
      const variants = yield* Variants;
      const accounts = yield* Accounts;
      const full = (username: string, v: Variant) => ({
        ...toSummary(username, v),
        resume: v.resume,
      });
      return handlers.handleAll({
        list: () =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const list = yield* variants.list(user.id);
            return list.map((v) => toSummary(user.username, v));
          }),
        create: ({ payload }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const resume =
              payload.resume ?? (yield* accounts.currentResume(user.id)).resume;
            if (resume === null || resume === undefined)
              return yield* new NoResume();
            if (!isObject(resume)) return yield* notObject;
            const made = yield* variants
              .create(user.id, {
                name: payload.name,
                resume,
                jobId: payload.jobId ?? null,
              })
              .pipe(
                Effect.mapError((e) => new InvalidResume({ message: e.reason }))
              );
            return full(user.username, made);
          }),
        get: ({ params }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const found = yield* variants.get(user.id, params.slug);
            if (!found) return yield* new VariantNotFound();
            return full(user.username, found);
          }),
        save: ({ params, payload }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            if (!isObject(payload.resume)) return yield* notObject;
            const saved = yield* variants
              .save(user.id, params.slug, payload.resume)
              .pipe(Effect.mapError(() => new VariantNotFound()));
            return full(user.username, saved);
          }),
        delete: ({ params }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            if (!(yield* variants.remove(user.id, params.slug)))
              return yield* new VariantNotFound();
          }),
      });
    })
);
