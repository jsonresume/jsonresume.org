---
title: Registry
description: Host your resume at registry.jsonresume.org from a GitHub gist.
---

The registry renders any public GitHub gist named `resume.json`. There is no
sign-up: create the gist and the URL works.

## Publish

1. Create a **public** gist at [gist.github.com](https://gist.github.com/) with
   a file named `resume.json`.
2. Open `https://registry.jsonresume.org/<your-github-username>`.

Edit the gist to update your resume. Rendered pages can be cached, so a change
may take a while to show; error pages are never cached.

## Themes

The theme is chosen in this order:

1. `?theme=<name>` in the URL, e.g. `registry.jsonresume.org/jane?theme=even`
2. `meta.theme` in your resume: `{ "meta": { "theme": "even" } }`
3. the default theme

`?theme=random` picks a random theme. The full list is in the
[theme gallery](https://jsonresume.org/themes/).

## Formats

Add an extension to get your resume in another format:

| URL | Output |
| --- | --- |
| `/<username>` | HTML, rendered with your theme |
| `/<username>.json` | the raw resume JSON |
| `/<username>.yaml` | YAML |
| `/<username>.txt` | plain text |
| `/<username>.rendercv` | [RenderCV](https://rendercv.com/) YAML |
| `/<username>.qr` | a QR code linking to your resume |
| `/<username>.agent` | Markdown written for AI agents and LLM tools |

## More than one resume

Keep several resume gists and pick one with `?gistname=`:

```
https://registry.jsonresume.org/jane?gistname=resume-de.json
```

## Errors

| Status | Meaning |
| --- | --- |
| 404 | No GitHub user with that name, no public `resume.json` gist, or an unknown theme |
| 400 | The resume is not valid JSON or doesn't match the [schema](/guides/schema); the page lists each problem |
| 503 | GitHub could not be reached (rate limit or outage); try again shortly |

Data formats (`.json`, `.yaml`, ...) return errors as JSON; page requests
return an HTML error page.
