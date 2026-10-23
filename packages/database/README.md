# @repo/database

The app's Postgres. `PgLive` connects with `DATABASE_URL` and runs every
pending migration in `src/migrations.ts` before anything queries. Tables
live in the `app` schema; the stores that use them live with their features
(`@repo/profiles/sql`, `@repo/accounts/sql`, `@repo/analytics/sql`).
Migrations that have shipped are never edited, only followed.
