# @repo/explore

Explore (`/explore`, the `search_resumes` MCP tool): every public resume,
searchable by name, headline, place, skill and employer.

- **Who is listed:** ghosts (gist resumes mirrored here), verified accounts
  that haven't opted out (`app.profiles.listed`), and the registry's resumes
  (`public.resumes`, where the copy exists) whose names nobody here holds.
  Resumes with only a name are left out.
- **Search:** every word must match; skills count most, then name and
  headline. No query shows the fullest resumes first. 24 per page.
- **Index:** built in memory from Postgres (only basics, skills and work),
  kept ten minutes, and rebuilt at once when someone opts in or out.
