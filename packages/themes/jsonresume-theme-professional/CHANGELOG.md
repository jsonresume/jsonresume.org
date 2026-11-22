# @jsonresume/jsonresume-theme-professional

## 1.0.31

### Patch Changes

- Updated dependencies [601e883]
  - @jsonresume/core@0.4.1

## 1.0.30

### Patch Changes

- e327eb3: Load Latin Modern from https://jsonresume.org/fonts/ (served with CORS), so the theme shows in its own typeface wherever it renders, a PDF or a resume built with resume-cli, and fall back to a serif rather than Courier. Drop the Latin Modern Sans faces it declared but never used.
- Updated dependencies [a6ba9ed]
  - @jsonresume/core@0.4.0

## 1.0.29

### Patch Changes

- 04aae6e: Improve PDF printing with repeating page margins, wrapping for long content, section pagination, and A4/Letter paper selection. Rebuild themes with the shared print fixes.
- Updated dependencies [04aae6e]
  - @jsonresume/core@0.3.8

## 1.0.28

### Patch Changes

- @jsonresume/core@0.3.7

## 1.0.27

### Patch Changes

- @jsonresume/core@0.3.6

## 1.0.26

### Patch Changes

- @jsonresume/core@0.3.5

## 1.0.25

### Patch Changes

- @jsonresume/core@0.3.4

## 1.0.24

### Patch Changes

- Updated dependencies [2fa869c]
  - @jsonresume/core@0.3.3

## 1.0.23

### Patch Changes

- 609b91c: Publish compiled entry points so Node and resume-cli consumers never load raw JSX.

## 1.0.22

### Patch Changes

- Republish: 1.0.21 collided with a previously published version on npm.

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
