---
title: Hosting and downloads
description: Host your resume at jsonresume.org/@username, and download it as PDF, Word, JSON and more.
---

Every resume on jsonresume.org has a page at `https://jsonresume.org/@<username>`.

## Publish

Two ways, both free:

- **On jsonresume.org.** [Sign up](https://jsonresume.org/signup), then write
  or import your resume in the editor and save. The page is live at once.
- **From a GitHub gist.** Sign in with GitHub and keep your resume in a
  public gist with a file named `resume.json`. Edit the gist to update the
  page. Rendered pages can be cached, so a change may take a minute to show.

Old `registry.jsonresume.org/<username>` links redirect to the new address.

## Download: PDF, Word and more

Add an extension to the address to get the resume in another format:

| URL | Output |
| --- | --- |
| `/@<username>` | the page, in your theme |
| `/@<username>.pdf` | PDF, printed from the page in your theme |
| `/@<username>.docx` | Word document |
| `/@<username>.json` | the resume JSON |
| `/@<username>.yaml` | YAML |
| `/@<username>.txt` | plain text |
| `/@<username>.rendercv` | [RenderCV](https://rendercv.com/) YAML |
| `/@<username>.qr` | a QR code linking to the page |

PDF and Word options:

- `?paper=a4` or `?paper=letter` sets the paper size; otherwise it follows
  the country in your resume.
- `?fit=1` shrinks a PDF that runs slightly over a page onto one.

## Themes

The theme is chosen in this order:

1. `?theme=<name>` in the URL, e.g. `jsonresume.org/@jane?theme=even`
2. `meta.theme` in your resume: `{ "meta": { "theme": "even" } }`
3. the default theme

`?theme=random` picks a random theme. The full list is in the
[theme gallery](https://jsonresume.org/themes/). Themes work for `.pdf` too:
`/@jane.pdf?theme=even`.

## More than one resume

With a gist, keep several resume gists and pick one with `?gistname=`:

```
https://jsonresume.org/@jane?gistname=resume-de.json
```

## Errors

| Status | Meaning |
| --- | --- |
| 404 | No such user, no public `resume.json` gist, no resume published yet, or an unknown theme or format |
| 400 | The resume is not valid JSON, or not a JSON object |
| 500 | The theme could not render this resume; try another theme |
| 503 | GitHub could not be reached, or the PDF could not be made; try again shortly |

Data formats (`.json`, `.yaml`, ...) return errors as JSON; page requests
return an HTML error page.

## For programs and agents

The same resume is available to AI agents over MCP at
`https://jsonresume.org/mcp`, and to apps through the
[HTTP API](https://jsonresume.org/api/openapi.json). See
[llms.txt](https://jsonresume.org/llms.txt).
