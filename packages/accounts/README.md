# @repo/accounts

Accounts, following `docs/ACCOUNTS_AND_USERNAMES.md`. `Accounts` signs people
up (email, password, username) and in, with GitHub too: a new GitHub user
claims the ghost at their login, or picks a name if an account holds it;
linking GitHub merges that ghost into the account as a redirect. Sessions
are random tokens stored hashed; passwords are scrypt; verification links
come by email (`Mailer`: Resend with `RESEND_API_KEY`, otherwise logged).
Unverified email accounts give their name back after 7 days.

Account emails (`lifecycle.ts`, sent every five minutes by `AccountJobs` in
`@repo/api-server`) go to accounts made in the last eight days, each kind at
most once (claimed in `app.account_emails` first, so two servers never both
send). Unconfirmed: a fresh link after a day, and a last call the day before
the name is freed. Confirmed or GitHub: a welcome within two hours of
confirming, then one nudge if the page is still empty two to four days in.
GitHub relay addresses (`users.noreply.github.com`) get nothing. Every email,
the weekly jobs email included, is built by `compose` (`emailLayout.ts`):
tables and inline styles for Gmail and Outlook, dark mode where supported,
and a text version with the links written out.

Stopping them takes a click or two. Every optional email links to
`/emails?user=…&token=…` (`emailLinks`; the token is an HMAC of the user id
under `AUTH_SECRET`, `emailToken.ts`), which shows a switch per kind and
"Unsubscribe from all", without signing in, and carries `List-Unsubscribe` +
`List-Unsubscribe-Post` so mail apps offer their own one-click button. The
account's switch is `app.users.account_emails`; the weekly jobs email's is
job preferences' `weeklyEmail`. Both are read and changed together by
`emailSettings`/`setEmailSettings` in `@repo/job-digest`, behind
`/api/email-settings` (by token), `/api/account/emails` (signed in, the
dashboard's Settings → Emails) and MCP `get_email_settings`/`set_email_settings`.

`PgAccountStore` (`@repo/accounts/sql`) keeps users, sessions and email
tokens in Postgres. Tests run on PGlite with GitHub faked.
