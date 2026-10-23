# @repo/profiles

Who `/@username` belongs to, following `docs/ACCOUNTS_AND_USERNAMES.md`.

- `parseHandle` reads `@name` or `@name.json` from a path; `Username` is the
  schema (GitHub's login rules, lowercase).
- `Profiles` resolves a username to a resume. Today every profile is a ghost:
  the GitHub user's `resume.json` gist, stored and refreshed after a minute,
  removed when GitHub says it is gone and served stale while GitHub is down.
- `GithubGists` reads gists, authenticating with `GITHUB_TOKEN`, then the
  OAuth app (`AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET`), then anonymously.
- `ProfileStore` keeps profiles: `ProfileStore.memory` for tests and
  `PgProfileStoreLive` (`@repo/profiles/sql`) on Postgres from `DATABASE_URL`,
  which migrates the `app` schema at startup.
