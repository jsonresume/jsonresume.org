# @repo/webhooks

Tells the apps a person connected (OAuth, with a resume scope) when their
resume changes. An app's owner sets one HTTPS URL for it; each save of a
resume queues a `resume.updated` delivery to every subscribed app that
person granted, sent at once and retried with backoff for a day.

Deliveries are JSON, signed like Stripe's: the `JSONResume-Signature`
header is `t=<unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<body>" with the
app's signing secret>`. The body names the person (`user.sub`, as in the
app's ID tokens, and `user.username`), not their resume: the app reads it
with its token, so a revoked grant gets nothing.

Only public addresses are called (`@repo/resume-pdf/policy`), redirects
are not followed, and each try has ten seconds.
