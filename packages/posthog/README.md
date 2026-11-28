# @repo/posthog

Product analytics in PostHog (project 134598, US cloud), cookie-free.

- **Browser** (`@repo/posthog/browser`): `startPostHog` loads `posthog-js`
  once the page is idle, in cookieless mode (nothing stored on the device;
  PostHog counts visitors with a daily hash), with page views on History API
  navigation, autocapture, page leaves and exceptions. No session recording:
  the editor's text is resume content. `identify` ties a page load to an
  account (id and username only), `forget` ends it on sign out, `captureError`
  reports errors the router caught. Without `VITE_PUBLIC_POSTHOG_KEY` (set in
  `apps/app/.env.production`; the token is public) it stays off, so `pnpm dev`
  sends nothing.
- **Proxy** (`posthogProxy`): `/ingest` on our domain, passed to PostHog, so
  blockers of third-party analytics don't drop events. Cookies and
  credentials stay behind; the visitor's address is forwarded because
  cookieless mode hashes it.
- **Server** (`ProductEvents`, `track`, `tracker`): events under the account's
  id, batched by `posthog-node`. Off without `POSTHOG_PROJECT_TOKEN` (in
  `/etc/jsonresume/app.env` on the box). Handlers call `track`; plain routes
  and middleware bind `tracker` when their layer is built.

| Event                   | Where                                       | Properties              |
| ----------------------- | ------------------------------------------- | ----------------------- |
| `user_signed_up`        | email sign-up, finishing a GitHub sign-up   | `method`                |
| `user_signed_in`        | email or GitHub sign-in                     | `method`                |
| `email_verified`        | the link in the confirmation email          |                         |
| `resume_saved`          | dashboard, `/api/v1`, OAuth apps            | `via`                   |
| `resume_source_changed` | gist or stored                              | `source`                |
| `username_changed`      | Settings                                    |                         |
| `account_deleted`       | Settings                                    |                         |
| `api_key_created`       | Settings                                    |                         |
| `oauth_app_created`     | Settings, Your OAuth apps                   |                         |
| `oauth_access_granted`  | the consent page                            | `client_id`, `scope`    |
| `mcp_tool_called`       | `/mcp`                                      | `tool`                  |
| `email_sent`            | every automatic email (`@repo/accounts` lifecycle, `@repo/resume-report`, `@repo/job-digest`) | `kind` (welcome, verify_reminder, verify_last_call, empty_page, report, weekly_jobs), `jobs` |
| `email_settings_changed` | `/emails`, Settings → Emails, one-click unsubscribe, MCP | what changed, `via` (link, settings, one-click, mcp) |

Browser events (`track` from `@repo/posthog/browser`):

| Event                   | Where                                       | Properties              |
| ----------------------- | ------------------------------------------- | ----------------------- |
| `start_step`, `start_import_result`, `start_save_clicked` | `/start` | `step`, `kind` (`file`, `text`, or `json`: a resume.json read in the browser, no import), `ok`, `reason`, `shrunk` (a large photo scaled down first), `theme` |
| `start_file_refused`, `start_file_cancelled` | `/start` | `reason` (`type` or `size`), `ext` (the extension, never the name) |
| `sign_in_failed`        | `/signin`                                   | `reason` (no-account, github, password, or the error) |
| `sign_up_failed`        | `/signup`                                   | `reason`                |
| `explore_searched`      | `/explore`                                  | `terms`, `total`, `page`, `skills` (the words, only when all are popular skills) |
| `explore_result_opened` | a result on `/explore`                      | `rank`, `page`, `terms`, `skills` |
| `editor_mode_changed`   | the editor's Form / JSON switch             | `mode`                  |
| `page_not_found`        | the 404 page                                | `path`, `from` (referring host) |

Emails tag links to our pages with `utm_source=email&utm_medium=email&utm_campaign=<kind>` (`compose`'s `campaign`), so PostHog's page views say which email a visit came from.

Never put an email, a name or resume text in an event.
