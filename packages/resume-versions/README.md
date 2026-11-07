# @repo/resume-versions

Every save of an account's resume is a version (`app.resume_versions`):
append-only, numbered from 1, with who made it (`user`, an `app` by OAuth
client or API key, an `assistant` over MCP, or a `restore`) and an optional
note. `profiles.stored_resume` (or the gist) stays the latest copy; this is
the history behind it.

- `ResumeVersions.record` runs inside `@repo/accounts`' `saveResume`, in the
  same transaction as the profile's write, and skips a save whose JSON is
  the same as the last version's.
- `list` pages newest first, each with what changed since the one before;
  `get` returns one with its JSON; `diff` compares any two.
- Restoring (`Accounts.restoreVersion`) saves an old version's JSON again as
  a new version: history is never rewritten.
- `diffResumes` is a small structural diff (`work[0].highlights` changed).
- `isRealResume` tells someone's own resume from our sample, for the
  `resume_saved` event's `real` property.

The resume column is `json`, not `jsonb`, so a restore gives back the exact
JSON, key order included. Rows belong to the account (`user_id`): profiles
are keyed by username, which changes on a rename. Tests run on PGlite.
