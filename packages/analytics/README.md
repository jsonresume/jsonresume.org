# @repo/analytics

Resume views for the dashboard. `withTracking` adds a small script to themed
resume pages that reports the view, then how long the page was visible and
how far down it was read. `Analytics` records views without cookies or IP
addresses: bots are skipped, readers become a daily salted hash, referrers a
host. `PgAnalyticsStore` (`@repo/analytics/sql`) stores them and answers the
dashboard's overview for a range: totals and the previous range's, a row per
day, top referrers, countries, devices, browsers, themes, and recent views.
