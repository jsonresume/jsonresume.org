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

Never put an email, a name or resume text in an event.
