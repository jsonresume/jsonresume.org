# jsonresume-theme-pro

A typeset, single-column serif résumé for [JSON Resume](https://jsonresume.org).
It has a centered masthead, one reading column with a shared left edge, fine
section rules, and consistent treatments for roles, organizations and dates.
Print is designed for both A4 and Letter.

```bash
npm install jsonresume-theme-pro
resume export resume.html --theme pro
```

```js
import { render } from 'jsonresume-theme-pro';

const html = render(resume); // a complete, self-contained HTML document
```

On the registry, use `https://registry.jsonresume.org/<username>?theme=pro`.

Optional settings go in `meta.pro`: `sectionOrder`, `showPortrait` and
`showFullAddress`. [DESIGN.md](./DESIGN.md) covers the design system, the
field mapping, the date policy and the verification record.

Fonts: Source Serif 4, © Adobe, SIL Open Font License 1.1
([fonts/LICENSE.md](./fonts/LICENSE.md)). Theme code: MIT.
