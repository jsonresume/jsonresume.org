# @repo/api-server

The server side of `@repo/api`. `apiRoutes(version)` is every `/api` route:
the HttpApi groups with their handlers, the session middleware (the
`jr_session` cookie, checked against stored sessions) and the GitHub sign-in
redirects (`/api/auth/github`, its callback, and `/api/auth/verify` for email
links), which are plain routes because they are all redirects.
`PurgeUnverified` frees the names of email accounts never verified.

The app provides the services: `Accounts`, `RateLimiter`, `GithubOAuth`
(`@repo/accounts`) and `Analytics`, `AnalyticsStore` (`@repo/analytics`).
The tests run the whole API over HTTP against PGlite with GitHub faked.
