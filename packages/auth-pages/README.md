# @repo/auth-pages

The pages for getting an account: `SignInPage` (GitHub, or email and
password), `SignUpPage` (username checked live against the rules in
`docs/ACCOUNTS_AND_USERNAMES.md`, then GitHub or email) and
`ChooseUsernamePage` (after GitHub sign-in, when the login is taken here).
They talk to `@repo/api` through `@repo/api-client` atoms and leave links to
the app's router (passed in as props).
