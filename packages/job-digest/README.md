# @repo/job-digest

The weekly jobs email. People turn it on in their job preferences
(`weeklyEmail`, off by default; the dashboard's Jobs → preferences, or MCP
`set_job_preferences`). On Mondays the `jsonresume-job-digest` timer runs
`apps/app/scripts/job-digest.ts`, which calls `sendDigests`:

- For each person with it on and a confirmed email address, the dashboard's
  decisions (`JobDecisions` in `@repo/careers`) for their current resume.
- `pickJobs`: unmarked apply jobs, then stretch, posted in the last 8 days and
  never sent to them before, at most 5. None: no email.
- `digestEmail`: text and HTML, each job linked to `/jobs/:id`, with a link
  to stop it. `app.job_digests` records what was sent, so a rerun sends
  nothing new.

Stopping: the email links to `/jobs/email/stop?user=…&token=…` (a button,
so mail scanners can't stop it by fetching the link) and carries
`List-Unsubscribe` + `List-Unsubscribe-Post` for one-click stops in mail
apps (RFC 8058). Both call `POST /api/job-digest/stop`, which checks the
token (`digestToken`, an HMAC of the user id under `AUTH_SECRET`).
The footer also links to `/emails`, the settings page every email shares
(`settings.ts` here; see `@repo/accounts` README).

`runDigests` takes plain functions, so a week's run is tested without a
database (`digest.test.ts`); the endpoint is tested in `@repo/api-server`.
