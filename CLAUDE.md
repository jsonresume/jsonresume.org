# Claude Repository Instructions

Follow AGENTS.md for all new code (stack, packages, conventions): @AGENTS.md

## Project

- **Org/Repo:** `jsonresume/jsonresume.org`. Always use `owner: "jsonresume"`.
- **The site:** jsonresume.org is `apps/app`, live since 2026-10-24 on our own box (`deploy/README.md`). It is React 19 + Vite, TanStack Router SSR, Effect 4 (Schema, HttpApi, SQL), Effect Atom and `@jsonresume/ui`, with the logic in `packages/*`. Production is Postgres on the box; `/docs` is `apps/docs` (a static Fumadocs export on GitHub Pages, proxied by Caddy).
- **Legacy, reference only:** `apps/registry` and `apps/homepage2` (Next.js, Vercel, Supabase). registry.jsonresume.org redirects here: resumes to `/@username`, the rest to `/registry`, which lists what hasn't been ported. Read them for behaviour; never copy their code or patterns, and don't register new things there. Supabase, CockroachDB and the copy in `public.resumes` are kept on purpose: never delete them.
- **Archived repos:** `resume-schema`, `resume-cli` and `rust-json-resume` live here now (`packages/schema`, `packages/cli`, `packages/core-rust`). Never link the old repos as live (#275).
- **AI:** Effect AI (`effect/ai` + `@effect/ai-openai`, see `@repo/jobs`). The legacy apps use the Vercel AI SDK. Never call vendor SDKs directly.

## Features worth knowing before touching them

- **MCP:** every feature ships MCP tools (`@repo/mcp`, served at /mcp and documented on that page from its catalog). Auth is API keys (`jr_`) or OAuth 2.1 with dynamic registration (`jro_` tokens; `/.well-known/oauth-*`, the `/oauth/authorize` consent page, `/api/oauth/*`). /mcp only takes OAuth tokens granted the `mcp` scope.
- **OAuth provider** ("Sign in with JSON Resume", /developers):
  - Apps are registered under Settings → Your OAuth apps (`jrc_` id, `jrs_` secret, stored hashed).
  - Scopes (`@repo/api` `SCOPES`): `openid`, `profile`, `email`, `resume:read`, `resume:write`, `mcp`.
  - Apps with a secret may skip PKCE; self-registered clients must use it.
  - Endpoints: `/api/oauth/userinfo`, `GET`/`PUT /api/oauth/resume`, `/api/oauth/revoke`.
  - `openid` adds an RS256 `id_token` (`@repo/api-server` `oidc.ts`; keys at `/api/oauth/jwks`, discovery at `/.well-known/openid-configuration`). The signing key is `OIDC_SIGNING_KEY` in `/etc/jsonresume/app.env`. Without it a key is made at startup, and ID tokens stop verifying after a restart.
- **Resume pages:** `/@username` renders a theme. The same resume is also served as:

  - `.pdf`: Chromium via `@repo/resume-pdf`, printing the HTML on `about:blank` and loading only the public web. Relative URLs don't resolve there, and cross-origin fonts need CORS (the site's `/fonts/` sends it).
  - `.docx`, via `@repo/resume-formats`.
  - `.json`, `.yaml`, `.txt`, `.rendercv` and `.qr`.

  There are also variants at `/@username/<slug>` and `/@username/timeline`. Gist resumes are mirrored, so a stored copy is served while GitHub is down. Explore (`/explore`) indexes every public resume.

- **Jobs:** Hacker News posts live in `app.jobs`. The pipeline is `@repo/jobs` on the box: `jsonresume-jobs.timer` runs every 2 hours, with status at `/api/jobs/status`.
  - The jobs CLI (`packages/job-search`) and the hunt skill call `/api/v1` with API keys.
  - The registry's old `gpt_content_full` text, and the embeddings made from it, were model filler for at least a year: don't reuse them.
- **Job matching** (`JobMatcher.rank`):
  - Jobs the resume's country rules out are dropped (`eligibility.ts`).
  - Embeddings order the rest.
  - For a signed-in user, `gpt-5-mini` judges the top 150 posts against the resume (`fitter.ts`). Results are cached in `app.job_fits` by resume hash + `FIT_VERSION`.
  - Pay, role level or an office the resume can't place caps the score (`level.ts`).
- **Job decisions** (`docs/jobs-ranking/DECISION-MODEL.md`, `/dashboard/jobs`, MCP `decide_jobs`): dealbreakers, then a chance and an appeal, give apply, stretch, skip or ruled out. Marks are kept with their decision in `app.job_mark_events`.
  - Replay decisions with `apps/app/scripts/replay-decisions.ts`. It is read-only and fetches the live resume, so pin a copy when comparing runs.
- **Pathways → Tree** (`@repo/careers`, README there): models read each resume version into skill evidence and role families, and each job post into roles and requirements. `refreshMoves` (the weekly `jsonresume-career-moves` timer) learns where people go next. One vocabulary ties these together: `families.ts`.
  - Both model steps start when a resume is saved by any route (`ResumeSaved` in `@repo/accounts`, settling for 25s) or when the dashboard opens. Runs are shared by content hash.
  - `/api/me/career` waits 5s, then answers `pending`.
  - Tests use `@repo/careers/testing`, which calls no models.
- **Skill names** are compared only through `skillKey`/`skillName` (`@repo/jobs`). Aliases are in `skillAliases.ts`, the one list. The jobs timer's `mergeSkills` folds stored duplicates and `embedSkills` gives missing vectors.

## Themes

Themes are npm packages (`packages/themes/*` or community ones from npm), rendered in Node by `@repo/resume-themes` from its own `node_modules`. The full guide is `docs/CREATING_A_THEME.md`; the scaffold is `pnpm gen:theme <slug> "Name"`. To register a theme:

1. Add a dependency in `packages/resume-themes/package.json`: `workspace:*` for ours, an exact version for a community theme (read its code first: no disk or network access while rendering, escapes resume text).
2. Add a loader in `packages/resume-themes/src/loaders.ts`.
3. Add gallery metadata in `packages/theme-config/src/metadata.js` (`@jsonresume/theme-metadata`; `THEME_NAMES` comes from its keys, and `render.test` checks they match the loaders).
4. Classify it in `packages/theme-config/src/classification.js`, as `[style, layout, colour]`.
5. Make the previews with `pnpm theme:preview --themes=<slug>`. It writes `apps/app/public/img/themes/<slug>.webp` and the legacy `apps/homepage2/.../<slug>.png`.
6. Add a changeset for `@jsonresume/theme-metadata` (and for the theme package, if it is ours).

Then check:

- **Tests:** `pnpm --filter @repo/resume-themes test` renders every theme.
- **Preview:** `pnpm --filter app dev`, then open http://localhost:5173/@thomasdavis?theme=<slug>.
- **Built files:** theme `dist/` is committed and CI's `Theme dist sync` compares it with `src/`. Rebuild with `pnpm build` in the theme after editing; our workspace themes load from `dist/`.
- **Console output:** themes render with the console muted (`quiet.ts`), so a theme can't write resume text into the server's logs.
- **Fonts:** use absolute URLs (Google Fonts, or `https://jsonresume.org/fonts/...`) or embed them, so PDFs get them too.

Don't remove or deprecate themes without the maintainer's approval. 27 legacy themes were removed on purpose (2025-10-31): don't restore them.

## Working locally

- `pnpm install`, then `pnpm --filter app dev`: http://localhost:5173, every page server-rendered, always on an in-memory PGlite database. No secrets are needed. Resumes come from public gists, so `/@thomasdavis` works.
- **Never sign up test accounts on production.** Use the dev server.
- **Scripts read `DATABASE_URL`** (`PgLive` in `@repo/database`), and a shell's `DATABASE_URL` may be production. Against production, scripts must be read-only: `pgReadOnly` + `ensureReadOnly`, or psql with `PGOPTIONS='-c default_transaction_read_only=on'`.
- **Tests:** build and test one package at a time: `pnpm --filter <name> test`, `pnpm --filter <name> typecheck`. For everything the app uses: `pnpm turbo typecheck lint test --filter=app...`.
- **TypeScript scripts:** there is no `tsx`. Run them with `node --experimental-strip-types --no-warnings <file>.ts`.
- **Stopping a server:** find its pid by port (`ss -ltnp`) and kill that. `pkill -f` kills the shell running it.

## Production (the box)

- Deploy: `sudo deploy/scripts/deploy.sh app <sha>`, after the PR has merged. Check the sha is non-empty first; `--rollback` goes back one release.
- Logs: `journalctl -u jsonresume@app` (the app) and `journalctl -u caddy -o cat` (JSON access logs, for status codes and latency).
- Secrets live only in `/etc/jsonresume/*.env` (root, 600). Never commit or print them.
- Product analytics: PostHog project 134598, cookie-free, queried with HogQL.

## Code standards

- Files ≤200 lines (tests and config ≤500). No `console.*`, no `any`, no non-null `!`.
- Effect style, with Schema to parse anything untrusted. Style with vanilla-extract and `vars` tokens. Every feature gets MCP tools.
- Never remove a feature: open an issue for the maintainer if something is broken beyond repair.

## Git, CI and releases

- Use local git (`add` → `commit` → `push`), never the GitHub API for file changes. Stage files by name: never `git add -A`, never a bare `git stash`.
- Commits: `type(scope): description` (feat/fix/refactor/test/docs/chore/perf).
- CI (`ci.yml`) required checks:
  - `Lint + Typecheck` (`turbo lint typecheck prettier`);
  - `build`;
  - `unit-test` (`turbo test --filter=app...`);
  - `test` (Playwright e2e);
  - `dev-script` (still boots the registry).
- Branches must be up to date to merge. Queue one PR at a time: `gh pr update-branch N`, then `gh pr merge N --squash --auto`.
- **Fork PRs get every secret as an empty string.** Default env with `||=`, not `??=` (which keeps `''`), and skip tests that need credentials when they're absent (see `apps/registry/tests/render.spec.js`). `github.token` can't read gists.
- **Turbo's remote cache needs `TURBO_TOKEN`** (a Vercel token for the `jsonresume` team, as a repo secret). Without a working one, every CI run builds all ~220 tasks (about 9 minutes).
- **LINT GOTCHA:** `eslint-config-next` is pinned to `^15` in `@repo/eslint-config-custom`. v16's flat config crashes ESLint 8, and turbo's cache can hide it. Verify lint changes with `turbo lint --force`.
- **Releases:** Changesets (`docs/RELEASING.md`). Merging to `master` updates the "Version Packages" PR; merging that publishes to npm. Add a changeset with any change to a published package.
- `pnpm.overrides` in the root `package.json` holds security patches. Dependabot runs weekly.

## Issues and community

- Track work in GitHub issues; point contributors to `CONTRIBUTING.md`.
- Schema issues are handled here (`packages/schema`), under CONTRIBUTING.md → Proposing Schema Changes.
- Be skeptical of external issues: verify before implementing.
- Comments are terse, with no emoji, and agent-authored ones are signed `— AI` on their own line. Write `@name` only to notify a real person.
- Post to the Discord webhook only when asked.

## Schema gotchas

- `schema.json` allows additional properties, so unknown fields are valid. Invalid-case fixtures must use type violations.
- Schema PRs regenerate `@jsonresume/types` (`pnpm --filter @jsonresume/types build`). `apps/registry/lib/schema.test.js` fails if the registry's copy of the schema lacks a field the published schema declares.
- `objective` is in the schema (#604). No theme or format renders it, but it steers job matching when the person hasn't stated a direction (`directionOf` in `@repo/jobs`).
- **Before defining a field, check live resumes for the name** (read-only psql on `app.profiles`; `jsonb_` functions there). A document that already uses the name with another type stops validating. That is why #315's object is `languages[].scale` (`proficiency` and `level` were taken as text) and entry `skills` accept skill objects (#313). Check by validating every live resume against the old and new schema: none may stop validating.
- The normative description is `packages/schema/SPEC.md`; update it with the schema. Decisions are recorded in `packages/schema/DECISIONS.md`.
- `packages/core-rust` (Rust, `json-resume-serde`) follows the schema: add new fields there too. CI's `Rust crate` job runs fmt, clippy and tests. serde_valid takes the last string-valued `serde` attribute as a field's name, so each field ends with an explicit `#[serde(rename = "…")]`.

## Legacy app gotchas (only when touching apps/registry or homepage2)

- A theme that 400s with `reading 'withConfig'` under webpack has styled-components in a `.js` file: move them into `.jsx`.
- Next 16 `next dev` writes `apps/*/AGENTS.md`, `apps/*/CLAUDE.md` and `next-env.d.ts`. Don't commit them.

## Principles

- Bias toward action, ship incrementally, user experience first. Bugs and features before refactors.
- Check facts (counts, dates, commands) against the source before writing them on the site or here.
- Update this file when you learn something a future session needs.
