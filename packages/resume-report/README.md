# @repo/resume-report

The monthly resume report email: how many people read your resume in the
last 30 days, how that compares with the 30 days before, where they came
from and where they were, with a link to the dashboard's numbers.

- **When:** from 09:00 UTC on the 1st through the 7th of each month
  (`reportMonth`), at most `DAILY_CAP` a day. `@repo/api-server`'s
  `AccountJobs` calls `sendReports` every 15 minutes.
- **Who:** confirmed accounts (email or GitHub) with a real address, the
  report on (`app.users.monthly_report`, default on) and page views in the
  last 30 days. Nobody read it: no email. Owners' own visits are never
  counted (`@repo/analytics`).
- **Once:** each month's send is claimed as a row in `app.account_emails`
  (kind `report:YYYY-MM`) before it goes, so a rerun or a second server sends
  nothing new.
- **Numbers:** `AnalyticsStore.overview(username, '30d')`, the same as the
  dashboard's.
- **Stopping:** the footer links to `/emails` and the email carries
  `List-Unsubscribe` one-click headers (kind `report`). The switch is also in
  Settings → Emails and MCP `set_email_settings` (`monthlyReport`).

`runReports` takes plain functions, so a month's run is tested without a
database (`report.test.ts`).
