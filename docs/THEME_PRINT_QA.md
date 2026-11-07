# Theme PDF verification

Every registered gallery theme must print on both A4 and Letter. The audit
discovers the catalogue from the hosted renderer, so new themes join the check
automatically. `.github/workflows/theme-pdf.yml` runs it for print-related changes.

```sh
pnpm exec turbo build --filter=@repo/resume-themes... --concurrency=4
pnpm exec playwright install chromium
node scripts/verify-all-theme-pdfs.ts --exporter
python3 scripts/check-all-theme-pdfs.py --render
```

The exporter mode calls the actual `ResumePdf` service, including disabled
scripts, public-resource restrictions, font readiness, backgrounds, and paper
selection. Four fixtures exercise complete, sparse, unusually long, and dense
resumes; additional native-language fixtures cover the relevant regional themes.
Dense resumes contain twelve distinct work-entry markers and fourteen paragraph
markers to detect lost content on continuation pages.

The checker uses extracted text and actual word coordinates on **every page**.
It rejects missing required content, missing files, nearly blank pages, text
within 10 points of a sheet edge, and incorrect page dimensions. Older designs
that omit an optional field are checked against their rendered HTML; they cannot
silently drop a work entry or narrative paragraph supplied by their HTML renderer.

`--render` renders complete and dense A4 PDFs and creates per-theme contact
sheets for visual review. `--render-all` renders every fixture and paper size.
Both scripts accept `--themes=slug,slug` for focused repair checks. Output lives
in `output/all-theme-pdfs/`; these generated files are not committed.

Shared core print defaults provide repeating page margins and wrapping. Sections
can span pages while headings stay with their following content. Owned theme
packages include these fixes in their builds. Hosted compatibility styles also
repair older third-party npm themes; those overrides do not change upstream npm
packages. Font families retain readable fallbacks when external fonts cannot load.

These checks verify document rendering, not hiring outcomes, ATS compatibility,
or PDF/UA certification. Visual review remains necessary for spacing, contrast,
column balance, and glyph quality.
