# Ten researched resume families

These are independent implementations of the ten families selected in
[the research report](RESUME_THEME_RESEARCH.md). They preserve the references'
useful composition and hierarchy without importing their source or branding.

| Theme slug             | Design                                                | Useful for                                    |
| ---------------------- | ----------------------------------------------------- | --------------------------------------------- |
| `harvard-classic`      | Centered serif identity, fine rules, one column       | Broad professional applications               |
| `jake-technical`       | Compact sans serif, prominent projects, one column    | Engineering and technical applicants          |
| `awesome-professional` | Typographic masthead, restrained red accent           | Polished professional applications            |
| `stockholm`            | Airy experience column, quiet right sidebar           | Modern business and product roles             |
| `dublin`               | Deep green identity and skills sidebar                | Applicants wanting a stronger visual identity |
| `deedy`                | Large name, asymmetric education and skills column    | Early career technical applicants             |
| `alta`                 | Plum headings, accomplishments in a supporting column | Achievement focused applications              |
| `new-york-corporate`   | Formal serif identity, restrained career timeline     | Corporate and leadership roles                |
| `academic-classic`     | Date gutter, education and publications first         | Extended academic CVs                         |
| `europass-inspired`    | Blue labels, explicit date gutter                     | Structured European CVs                       |

The catalogue uses familiar style, layout and colour facets. The former
`research-informed` filter has been retired. Existing
themes are unchanged. None of these themes is an official or endorsed Harvard,
Europass, Overleaf, or commercial vendor product.

## Use

Every package exports `render(resume): string` and a default object containing
the same function. HTML includes its styles and works without client JavaScript,
a stylesheet loader, or runtime filesystem access. Compiled output is committed.

```ts
import { render } from 'jsonresume-theme-harvard-classic';

const html = render(resume);
```

The hosted renderer accepts the slug, for example
`/@thomasdavis?theme=harvard-classic`. The CLI accepts the slug after installation:

```sh
resume export resume.html --theme harvard-classic
```

Within this checkout, the CLI can use the package directory directly:

```sh
node packages/cli/build/main.js export resume.html \
  --resume packages/sample-data/complete-resume.json \
  --theme ./packages/themes/jsonresume-theme-harvard-classic
```

Publish `@jsonresume/theme-primitives` before the ten theme packages. Workspace
dependencies become versioned dependencies when packed. The shared primitives
bundle the existing core document wrapper; React, React DOM, Effect and the
shared utilities remain external dependencies. Node 18 and React 18/19 are
supported. A workspace build uses the repository's current Node version.

## Content and preferences

The renderer includes all standard JSON Resume sections when populated. It
preserves date precision, escapes applicant text, rejects executable link
schemes, and tolerates absent or malformed optional fields. Photos and full
street addresses are opt-in. No resume content is changed by rendering.

Optional preferences live under `meta.researchThemes`:

```json
{
  "meta": {
    "language": "en-GB",
    "researchThemes": {
      "sectionOrder": ["work", "projects", "education", "skills"],
      "layout": "single",
      "density": "compact",
      "monochrome": true,
      "showPhoto": false,
      "showFullAddress": false
    }
  }
}
```

`sectionOrder` orders sections within their existing columns. Use `layout:
"single"` to apply one continuous order. Unlisted sections still render. The
compact setting reduces spacing rather than hiding entries or shrinking text.
The monochrome setting removes the family colours.

English, French, German and Spanish headings are localised. Other document
languages retain English headings marked with their own language; Arabic,
Persian, Hebrew and Urdu select right-to-left direction. This is not a claim of
complete translation or typographic coverage for every writing system.

Fonts use Google Fonts with local fallbacks. Font requests can fail without
making the document unusable. PDF text remains selectable. Multi-column
extraction order varies by PDF reader and recruiting system; use the single
column preference where a simple reading order matters. There is no universal
ATS certification. Chromium's PDFs are not tagged accessible PDFs.

## Integration and verification

The central metadata powers the gallery, previews and existing MCP `list_themes`
and `set_theme` tools. Both the current hosted renderer and legacy registry
loaders include all ten packages. The two galleries have generated thumbnails.
The hosted renderer's catalogue test compares against central metadata rather
than a hard-coded count.

Reproduce the checks from the repository root:

```sh
pnpm build --concurrency=2
pnpm turbo lint typecheck --filter=app... --concurrency=2
pnpm turbo test --filter=app... --concurrency=1
pnpm --filter registry test -- --run themeRenderQa
pnpm exec playwright install chromium
node scripts/verify-researched-themes.ts
python3 scripts/verify-researched-theme-pdfs.py
```

The PDF inspection script needs Poppler, pdfplumber and Pillow. Add `--gallery`
to the browser script only when regenerating committed gallery images.
Results, HTML, mobile/desktop screenshots, fallback-font screenshots, PDFs and
rendered page contact sheets are saved under `output/researched-themes/`.

The browser matrix covers six fixtures: complete, sparse, long wrapping,
international, dense and user preferences. It checks 320–1280 pixel screens,
WCAG A/AA rules through axe, and A4/Letter print widths: 220 cases in total.
Forty generated PDFs cover both paper sizes and complete/dense content. The PDF
check verifies section and entry sentinels, printable bounds, and blank pages;
page renders are also reviewed visually. Package checks additionally exercise
compiled exports on Node 18, all ten CLI exports, and tarball installation in a
separate project with React 18. Normal workspace tests use React 19.
