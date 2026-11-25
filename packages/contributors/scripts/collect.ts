/**
 * Collects everyone who has contributed to JSON Resume and writes
 * src/data/contributors.json, which the /contributors page and the
 * list_contributors MCP tool read. Reads public data only:
 *
 * - every public repository of the jsonresume org on GitHub: commits, issues
 *   and pull requests opened, comments, and review comments;
 * - every jsonresume-theme-* package on npm;
 * - the site's team and projects directory.
 *
 * GITHUB_TOKEN (any token; it needs no scopes) is required: the run takes a
 * few hundred requests. The weekly `contributors` workflow runs it.
 *
 *   GITHUB_TOKEN=… node --experimental-strip-types --no-warnings scripts/collect.ts
 */
import { writeFile } from 'node:fs/promises';
import { NodeRuntime } from '@effect/platform-node';
import { Config, Effect } from 'effect';
import { FetchHttpClient, HttpClient } from 'effect/http';
import { foldByName } from '../src/fold.ts';
import { mergeCredits, orderPeople, type Found } from '../src/merge.ts';
import { makeGithub } from './github.ts';
import { npmThemes, ourThemes } from './npm.ts';
import { profiles, siteCredits } from './people.ts';

const OUT = new URL('../src/data/contributors.json', import.meta.url);

const main = Effect.gen(function* () {
  const token = yield* Config.Redacted('GITHUB_TOKEN');
  const client = HttpClient.retryTransient(yield* HttpClient.HttpClient, {
    times: 3,
  });
  const github = makeGithub(client, token);
  const found: Array<Found> = [];

  const repos = yield* github.repos;
  for (const repo of repos) {
    found.push(...(yield* github.code(repo)));
    found.push(...(yield* github.discussion(repo)));
    yield* Effect.logInfo(`${repo}: ${found.length} credits so far`);
  }
  const themes = yield* npmThemes(yield* ourThemes);
  found.push(...themes, ...(yield* siteCredits));
  yield* Effect.logInfo(`${themes.length} themes on npm`);

  const logins = [
    ...new Set(found.flatMap((f) => ('github' in f.who ? [f.who.github] : []))),
  ];
  const known = yield* profiles(client, token, logins);
  const people = orderPeople(foldByName(mergeCredits(found, known)));
  const collected = new Date().toISOString().slice(0, 10);
  yield* Effect.tryPromise(() =>
    writeFile(
      OUT,
      `${JSON.stringify(
        { collected, repositories: repos.length, people },
        null,
        1
      )}\n`
    )
  );
  yield* Effect.logInfo(
    `${people.length} people from ${repos.length} repositories`
  );
});

main.pipe(Effect.provide(FetchHttpClient.layer), NodeRuntime.runMain);
