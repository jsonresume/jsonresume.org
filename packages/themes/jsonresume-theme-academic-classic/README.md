# Academic Classic

An extended scholarly CV with a date gutter, clear publication entries and deliberate continuation pages.

An original implementation of family 9 in the repository's resume theme research. This theme renders every standard JSON Resume section; its HTML includes all styles and requires no JavaScript or runtime filesystem access.

```sh
npm install jsonresume-theme-academic-classic
resume export resume.html --theme academic-classic
```

```js
import { render } from 'jsonresume-theme-academic-classic';
const html = render(resume);
```

Hosted preview: `https://jsonresume.org/@thomasdavis?theme=academic-classic`.

Preferences are optional under `meta.researchThemes`: `sectionOrder` moves named sections first within each column without hiding others; `layout: "single"` selects one column; `density: "compact"` reduces spacing; `monochrome: true` removes colour; `showPhoto: true` opts into the supplied photo. `meta.language` controls document language and English, French, German or Spanish section headings. Other languages use English headings with their language identified.

The document adapts to mobile screens and prints on A4 or Letter. Font links use Google Fonts with local fallback stacks. PDF text remains selectable; no universal ATS certification is claimed. This is an independently designed theme, not an official or endorsed template from the reference institution or vendor.

Run `pnpm --filter jsonresume-theme-academic-classic build`, `test`, `typecheck` and `lint` from the monorepo. Build output is committed for Node and CLI consumers.
