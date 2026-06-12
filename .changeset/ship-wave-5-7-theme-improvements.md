---
'jsonresume-theme-academic-cv-lite': minor
'jsonresume-theme-architects-portfolio': minor
'jsonresume-theme-asymmetric-timeline': minor
'jsonresume-theme-berlin-grid': minor
'jsonresume-theme-bold-header-statement': minor
'jsonresume-theme-californian-warm': minor
'jsonresume-theme-coastal-creative': minor
'@jsonresume/jsonresume-theme-creative-studio': minor
'jsonresume-theme-data-driven': minor
'jsonresume-theme-developer-mono': minor
'jsonresume-theme-diagonal-accent-bar': minor
'jsonresume-theme-executive-slate': minor
'jsonresume-theme-french-atelier': minor
'jsonresume-theme-government-standard': minor
'jsonresume-theme-graph-paper-grid': minor
'jsonresume-theme-investor-brief': minor
'jsonresume-theme-london-bureau': minor
'jsonresume-theme-marketing-narrative': minor
'jsonresume-theme-mid-century-resume': minor
'jsonresume-theme-minimalist-grid': minor
'jsonresume-theme-modern-classic': minor
'jsonresume-theme-monochrome-noir': minor
'jsonresume-theme-new-york-editorial': minor
'jsonresume-theme-nordic-minimal': minor
'jsonresume-theme-operations-precision': minor
'jsonresume-theme-pacific-horizon': minor
'jsonresume-theme-product-manager-canvas': minor
'jsonresume-theme-reference': minor
'jsonresume-theme-sales-hunter': minor
'jsonresume-theme-sidebar': minor
'jsonresume-theme-sidebar-photo-strip': minor
'jsonresume-theme-two-column-modernist': minor
'jsonresume-theme-typewriter-modern': minor
'jsonresume-theme-university-first': minor
'jsonresume-theme-urban-techno': minor
'jsonresume-theme-writers-portfolio': minor
'@jsonresume/jsonresume-theme-consultant-polished': patch
'@jsonresume/jsonresume-theme-tokyo-modernist': patch
'@jsonresume/theme-stackoverflow': patch
'jsonresume-theme-community-garden': patch
'jsonresume-theme-desert-modern': patch
'jsonresume-theme-elegant-pink': patch
---

Add missing JSON Resume sections (certificates/volunteer/publications); visual and crash fixes.

Publishes the wave 5-7 theme improvements that currently exist only in git (refs #275). The
published npm versions are stale: most themes never rendered certificates/volunteer/publications,
and all carried the `@resume/core` import (renamed to `@jsonresume/core`) plus the Date-shadow
rendering crash.

Minor (gained rendered sections via the "render missing sections" batches #363-#366 and the
operations-precision a11y/markdown work): all themes listed above as `minor` now render the
previously-missing certificates/volunteer/publications (and related) sections.

Patch (no new sections; visual, crash and dependency-rename fixes only):

- consultant-polished: stop crash when certificates/publications present (#359).
- tokyo-modernist: exports/CI fixes; styled-components moved to dependencies.
- @jsonresume/theme-stackoverflow: consistent date formatting (#259) + a11y fixes (the
  Yarn-Berry lockfile removal did not change source and does not drive this bump).
- community-garden, desert-modern, elegant-pink: `@resume/core` -> `@jsonresume/core` import
  fix and visual polish; sections were already rendered.

Excludes `@jsonresume/jsonresume-theme-professional` (already current on npm) and the private
themes (claude, creative-confidence, flat, tailwind).
