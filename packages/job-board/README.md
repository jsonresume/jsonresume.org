# @repo/job-board

The job board in React: `JobCard`, the filter bar (search, where, level and
pay, kept in the URL), `JobList`, and the `/jobs` and `/jobs/:id` pages. The
pages take their data as props (the server reads it with `@repo/jobs` and
renders the route); the dashboard's "Jobs for you" reuses the card and
filters. Imports only types from `@repo/api`.
