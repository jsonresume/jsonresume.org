# @repo/resume-host

Serves `/@username`. `resumeOutcome(url)` parses the handle, finds the
resume through `Profiles` (`@repo/profiles`), and either responds with it (a
themed page, or `.json`, `.yaml`, `.txt`) or returns the `ResumeProblem`
that stopped it, for the app to explain. Theme order: `?theme=`, the
resume's `meta.theme`, then elegant; `?theme=random` redirects to a random
one; `?gistname=` reads another file from the user's gists. Responses are
`no-store` with CORS open, as the registry's were.

Themed pages get, in `<head>` (`seo.ts`): the canonical URL (the clean
`/@username`, whatever the query), a description and Open Graph/Twitter
tags the theme didn't set, and schema.org `ProfilePage` data built from
the resume's public fields only (`profileData.ts`: no email, phone, street
or postcode). Other formats name the page with a `Link: rel="canonical"`
header. The PDF printer gets the theme's page untouched.
