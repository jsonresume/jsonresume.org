# @repo/accounts

Accounts, following `docs/ACCOUNTS_AND_USERNAMES.md`. `Accounts` signs people
up (email, password, username) and in, with GitHub too: a new GitHub user
claims the ghost at their login, or picks a name if an account holds it;
linking GitHub merges that ghost into the account as a redirect. Sessions
are random tokens stored hashed; passwords are scrypt; verification links
come by email (`Mailer`: Resend with `RESEND_API_KEY`, otherwise logged).
Unverified email accounts give their name back after 7 days.

`PgAccountStore` (`@repo/accounts/sql`) keeps users, sessions and email
tokens in Postgres. Tests run on PGlite with GitHub faked.
