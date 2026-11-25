/**
 * Theme authors: every `jsonresume-theme-*` package on npm. A theme whose
 * repository is on GitHub is credited to the repository's owner, so it joins
 * the rest of their credits; otherwise to its npm publisher. Themes kept in
 * the jsonresume org's own repositories are left out: their commits already
 * credit the people who wrote them.
 */
import { readdir, readFile } from 'node:fs/promises';
import { Effect, Schema } from 'effect';
import { HttpClient } from 'effect/http';
import type { Found } from '../src/merge.ts';
import { ORG } from './github.ts';

const Package = Schema.Struct({
  name: Schema.String,
  publisher: Schema.optional(Schema.Struct({ username: Schema.String })),
  links: Schema.optional(
    Schema.Struct({ repository: Schema.optional(Schema.String) })
  ),
});
const Page = Schema.Struct({
  objects: Schema.Array(Schema.Struct({ package: Package })),
});

const THEME = /(^|\/)jsonresume-theme-/;
const SIZE = 250;
/** npm's search stops answering past this offset. */
const LAST = 5000;

/** GitHub paths that look like an owner but aren't one. */
export const NOT_OWNERS = new Set([
  'marketplace',
  'orgs',
  'apps',
  'sponsors',
  'topics',
]);

/** The GitHub owner in a repository or project URL. */
export const ownerOf = (url: string | undefined) => {
  const owner = url?.match(/github\.com[/:]([A-Za-z0-9-]+)\//)?.[1];
  return owner && !NOT_OWNERS.has(owner.toLowerCase()) ? owner : undefined;
};

export const themeCredit = (p: typeof Package.Type): Found | undefined => {
  if (!THEME.test(p.name)) return undefined;
  const owner = ownerOf(p.links?.repository);
  if (owner?.toLowerCase() === ORG) return undefined;
  if (owner)
    return { who: { github: owner }, kind: 'themes', where: p.name, count: 1 };
  if (p.publisher) {
    return {
      who: { npm: p.publisher.username },
      kind: 'themes',
      where: p.name,
      count: 1,
    };
  }
  return undefined;
};

const Named = Schema.Struct({ name: Schema.String });
const THEMES_DIR = new URL('../../themes/', import.meta.url);

/** The themes in this repository (packages/themes), by package name. */
export const ourThemes = Effect.gen(function* () {
  const dirs = yield* Effect.tryPromise(() => readdir(THEMES_DIR));
  const names = new Set<string>();
  for (const dir of dirs) {
    const text = yield* Effect.tryPromise(() =>
      readFile(new URL(`${dir}/package.json`, THEMES_DIR), 'utf8')
    ).pipe(Effect.orElseSucceed(() => undefined));
    if (text === undefined) continue;
    const pkg = yield* Schema.decodeUnknownEffect(Schema.fromJsonString(Named))(
      text
    );
    names.add(pkg.name);
  }
  return names;
});

/**
 * Search pages until they stop turning up themes. `ours` (this repository's
 * themes) are left out: their commits credit the people who wrote them.
 */
export const npmThemes = (ours: ReadonlySet<string>) =>
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;
    const decode = Schema.decodeUnknownEffect(Page);
    const seen = new Map<string, Found>();
    for (const text of ['keywords:jsonresume-theme', 'jsonresume-theme']) {
      for (let from = 0; from < LAST; from += SIZE) {
        const url = `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(
          text
        )}&size=${SIZE}&from=${from}`;
        const response = yield* client.get(url);
        const page = yield* decode(yield* response.json);
        let themes = 0;
        for (const { package: p } of page.objects) {
          const credit = themeCredit(p);
          if (THEME.test(p.name)) themes += 1;
          if (credit && !ours.has(p.name) && !seen.has(p.name)) {
            seen.set(p.name, credit);
          }
        }
        if (page.objects.length < SIZE || themes < 5) break;
      }
    }
    return [...seen.values()];
  });
