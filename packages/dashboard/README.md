# @repo/dashboard

The signed-in app at `/dashboard`. `DashboardShell` is the full-screen layout
(`AppShell` with the sidebar and account menu) and waits for the session,
sending visitors without one to sign in. `OverviewPage` shows who reads the
resume for a range kept in `?range=`: views, visitors, median time on page
and read depth against the range before, a chart per day, sources,
countries, devices, browsers, themes and recent views. `ResumePage` picks
where `/@username` reads the resume (the GitHub gist or an uploaded copy);
`SettingsPage` shows the account and links GitHub.

Everything renders in the browser only, from `@repo/api-client` atoms; the
prerendered pages are an empty shell.
