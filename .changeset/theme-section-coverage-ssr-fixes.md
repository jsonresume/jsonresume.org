---
'@jsonresume/jsonresume-theme-professional': patch
'@jsonresume/jsonresume-theme-tokyo-modernist': patch
'@jsonresume/theme-metadata': patch
'jsonresume-theme-bold-header-statement': patch
'jsonresume-theme-coastal-creative': patch
'jsonresume-theme-community-garden': patch
'jsonresume-theme-data-driven': patch
'jsonresume-theme-desert-modern': patch
'jsonresume-theme-developer-mono': patch
'jsonresume-theme-elegant-pink': patch
'jsonresume-theme-executive-slate': patch
'jsonresume-theme-graph-paper-grid': patch
'jsonresume-theme-investor-brief': patch
'jsonresume-theme-minimalist-grid': patch
'jsonresume-theme-monochrome-noir': patch
'jsonresume-theme-nordic-minimal': patch
'jsonresume-theme-product-manager-canvas': patch
'jsonresume-theme-sidebar': patch
'jsonresume-theme-two-column-modernist': patch
'jsonresume-theme-urban-techno': patch
---

Theme curation wave: full JSON Resume section coverage and SSR fixes.

- Add missing sections (Interests, Certificates, et al.) across 15+ themes so every registered theme renders all schema sections
- tokyo-modernist: inline styled-components (fixes webpack resolution SSR crash) — re-enabled in the registry
- tailwind: fix social-icon SSR crash, add 7 missing sections with missing-data guards — re-enabled in the registry
- Register previously orphaned desert-modern and elegant-pink themes with metadata
