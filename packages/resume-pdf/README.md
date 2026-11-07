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
- The requested paper overrides a theme's fixed page size. Fonts get a bounded
  chance to load before printing with the available fallbacks.

Chromium must be installed for the user the server runs as: the deploy script
runs `playwright-core install chromium-headless-shell` (see `deploy/README.md`).

## Fit to one page

`?fit=1` (`print(html, paper, { fit: true })`, MCP `export_resume` `fit`): a
resume that prints on two pages but fits on one at 85% is printed at the
largest scale that fits, found by halving (`fitOnePage`); anything else prints
at full size. Measured locally: fitting adds 0.1–0.8 s.

## Tests

`recommended.test.ts` prints each recommended theme (`RECOMMENDED_THEMES` in
`@jsonresume/theme-metadata`) with the complete sample resume on A4 and
Letter, and checks what a tracking system reads from the PDF: every word of
the resume as text, no icon-font glyphs, the name first and the jobs and
schools in order, and every line a quarter inch inside the page (the margin a
desk printer needs, stricter than the catalogue's clipping check). Page counts and a 120 px thumbnail of page one (A4) are
compared with `baselines/` (2% tolerance); redraw them with
`UPDATE_PDF_BASELINES=1 pnpm --filter @repo/resume-pdf test`. It also asserts
the 95th-percentile print time is under 5 s (locally: p50 0.84 s, p95 0.96 s).
Clipping, blank pages and paper size for every theme are checked separately,
across the whole catalogue. These tests, and the Chromium half of
`fit.test.ts`, run only where Chromium is installed (`playwright-core install
chromium-headless-shell`), not in CI's unit tests, and they load the themes'
web fonts.
