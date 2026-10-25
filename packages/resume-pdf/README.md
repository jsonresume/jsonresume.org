# @repo/resume-pdf

Prints a themed resume to PDF for `/@username.pdf`: `ResumePdf.print(html, paper)`
renders the theme's HTML in headless Chromium (Playwright) with scripts off and
backgrounds on.

- One browser for every print, launched on first use; two prints at a time; a
  page printed again within five minutes comes from memory.
- The browser may only load the public web (`mayFetch`): resumes name images
  and themes name fonts, but nothing may reach the box or its network.
- Paper: `?paper=a4|letter`, else Letter where it's the norm (US, Canada, …),
  else A4 (`paperFor`).

Chromium must be installed for the user the server runs as: the deploy script
runs `playwright-core install chromium-headless-shell` (see `deploy/README.md`).
