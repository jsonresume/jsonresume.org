# @repo/resume-host

Serves `/@username`. `resumeOutcome(url)` parses the handle, finds the
resume through `Profiles` (`@repo/profiles`), and either responds with it (a
themed page, or `.json`, `.yaml`, `.txt`) or returns the `ResumeProblem`
that stopped it, for the app to explain. Theme order: `?theme=`, the
resume's `meta.theme`, then elegant; `?theme=random` redirects to a random
one; `?gistname=` reads another file from the user's gists. Responses are
`no-store` with CORS open, as the registry's were.
