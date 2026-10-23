# Self-hosting plan: off Vercel and Supabase

**Goal:** run jsonresume.org on our own server, ending our dependence on Vercel
(hosting) and Supabase (Postgres, auth). Nothing is shut down until its
replacement is live and verified.

## The box

|         |                                                               |
| ------- | ------------------------------------------------------------- |
| Host    | `vps-27b4fa5a.vps.ovh.ca` (OVH Canada)                        |
| IPv4    | `54.39.111.72`                                                |
| IPv6    | `2607:5300:205:200::e13a`                                     |
| Login   | `ssh ubuntu@54.39.111.72` (key only; sudo without password)   |
| Spec    | Ubuntu 26.04, 6 cores, 11 GB RAM, 96 GB disk                  |
| Tooling | Node 24, pnpm 8 (corepack), gh, Vercel CLI, Claude Code, tmux |
| Repo    | `~/code/jsonresume.org`                                       |

## What runs where today

| Piece                          | Today                                                                                                 | Notes                                                                                                                                                                                                  |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Registry (`apps/registry`)     | Vercel project `jsonresume-org-registry`                                                              | Next.js, serverless routes, `@vercel/functions` `waitUntil`, `@vercel/analytics`                                                                                                                       |
| Homepage (`apps/homepage2`)    | Vercel project `jsonresume-org-homepage2`                                                             | Next.js                                                                                                                                                                                                |
| Styleguide (`apps/styleguide`) | Vercel project `jsonresume-org-styleguide`                                                            | Next.js 16 (webpack, for vanilla-extract)                                                                                                                                                              |
| Docs (`apps/docs`)             | GitHub Pages (`deploy-docs.yml`)                                                                      | Static export; can stay where it is                                                                                                                                                                    |
| Database                       | Supabase Postgres                                                                                     | Prisma (`DATABASE_URL`) plus supabase-js queries; pgvector `vector(3072)`; RPCs `match_jobs*`, `increment_retry_count`; 19 migrations in `supabase/migrations` and `apps/registry/supabase/migrations` |
| Auth                           | Supabase Auth (GitHub OAuth, email and password) **and** NextAuth (`apps/registry/auth.js`)           | Two systems; settle on one                                                                                                                                                                             |
| Scheduled jobs                 | GitHub Actions (`process_hn_jobs`, `enrich_resume_companies`, `uptime-check`, `vercel_error_monitor`) | They hit the database and APIs, not Vercel cron                                                                                                                                                        |
| DNS and CDN                    | Cloudflare (proxied)                                                                                  | Stays; only origins change                                                                                                                                                                             |
| Secrets                        | Vercel env (`vercel env pull`)                                                                        | `OPENAI_API_KEY`, `PERPLEXITY_API_KEY`, `GITHUB_TOKEN`, `AUTH_GITHUB_*`, `SUPABASE_*`, `DISCORD_WEBHOOK_URL`, …                                                                                        |

## Target

- **Postgres 17 + pgvector** on the box, bound to localhost. Nightly
  `pg_dump` sent off-box (e.g. R2 or B2) with a tested restore.
- **Apps as long-running Node processes** (`next build && next start`) under
  systemd, one unit per app, restart on failure.
- **Caddy** in front: one site per hostname, reverse proxy to each app's port.
  TLS via Cloudflare origin certificates, Cloudflare in Full (strict) mode.
- **Auth: NextAuth (Auth.js) only**, with GitHub OAuth and sessions stored in
  our Postgres. This replaces Supabase Auth.
- **Data access:** Prisma or plain `pg` against local Postgres. supabase-js
  calls are rewritten; RPCs become SQL functions (already Postgres functions,
  so they move with the dump).
- **Deploys:** push to `master` → GitHub Action SSHes in (deploy key) →
  `git pull && pnpm install && turbo build --filter=<app>` → swap and restart.
  Keep the previous build for instant rollback.
- **Observability:** journald logs, plus an uptime check and error alerts to
  Discord (reusing the existing webhook). Replace `@vercel/analytics` with a
  self-hosted option (e.g. Plausible or Umami) or drop it.

## Phases

1. **Harden the box.** ufw (22, 80 and 443 only; 80 and 443 limited to
   Cloudflare IP ranges), fail2ban, unattended upgrades, swap, a `deploy`
   user, password SSH off.
2. **Postgres.** Install Postgres 17 + pgvector. Restore a Supabase dump
   (`pg_dump` of the `public` schema; `auth` users exported separately). Check
   row counts, indexes, functions and vector search results against
   Supabase.
3. **Registry on the box, still on Supabase.** Build and run under systemd
   behind Caddy at a test hostname (e.g. `next.jsonresume.org`). Replace
   Vercel-only APIs: `waitUntil` → fire-and-forget or a small job queue;
   `VERCEL_*` env checks → our own `APP_URL`; analytics. Compare pages, PDF
   export and theme rendering with production.
4. **Switch the database.** Point the box's registry at local Postgres. Port
   supabase-js queries to Prisma or `pg`. Re-run checks.
5. **Switch auth.** Move all sign-in to NextAuth with a Postgres adapter.
   Migrate users by matching GitHub IDs and emails so existing accounts keep
   their resumes. Email and password users need a reset flow or a one-time
   migration of bcrypt hashes from `auth.users`.
6. **Cut over.** Lower the DNS TTL, freeze writes briefly, take a final
   Supabase dump and restore it, and point `registry.jsonresume.org` at the box.
   Watch errors for 48 hours. Vercel stays deployable as a fallback.
7. **Homepage and styleguide.** Same pattern; these are simpler (no database).
8. **Decommission.** After two quiet weeks, remove the Vercel projects and
   pause, then delete, the Supabase project. Move GitHub Actions secrets
   from `SUPABASE_*` to the new `DATABASE_URL`.

## Rules for the move

- Every phase has a rollback, and nothing is deleted until its replacement has
  run cleanly in production.
- No feature is removed to make the migration easier without approval.
- Secrets live in `/etc/jsonresume/<app>.env` (root-owned, 600), never in
  the repo.

## Open questions

- Supabase storage and realtime: a code scan found no use of either; confirm in the Supabase dashboard before deleting the project.
- Should the AI features keep calling OpenAI directly? (Not a hosting question,
  but it affects secrets.)
- Do we want staging on the same box (separate ports and database), or
  preview deploys per PR?
