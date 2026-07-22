# @jsonresume/jsonresume-theme-professional

## 1.0.21

### Patch Changes

- 304a130: Theme curation wave: full JSON Resume section coverage and SSR fixes.

  - Add missing sections (Interests, Certificates, et al.) across 15+ themes so every registered theme renders all schema sections
  - tokyo-modernist: inline styled-components (fixes webpack resolution SSR crash) — re-enabled in the registry
  - tailwind: fix social-icon SSR crash, add 7 missing sections with missing-data guards — re-enabled in the registry
  - Register previously orphaned desert-modern and elegant-pink themes with metadata
  - @jsonresume/core@0.3.2

## 1.0.20

### Patch Changes

- 965cf57: use @jsonresume/core/ssr renderResumeDocument
- Updated dependencies [ff09f75]
  - @jsonresume/core@0.3.1
