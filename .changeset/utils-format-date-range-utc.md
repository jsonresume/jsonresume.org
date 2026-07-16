---
'@jsonresume/utils': patch
---

formatDateRange now formats date-only ISO strings (YYYY/YYYY-MM/YYYY-MM-DD) in UTC, so first-of-month dates no longer shift back a month in non-UTC environments (output changes for such dates when running west of UTC)
