# styleguide

The JSON Resume design system site, [styleguide.jsonresume.org](https://styleguide.jsonresume.org). It documents and dogfoods `@jsonresume/ui`.

- `lib/components.ts`: guidance for each component page.
- `examples/<component>/<example>.tsx`: live examples; each page renders the example and shows its exact source.
- `scripts/generate.mjs`: generates props tables from the component types and the examples index (`generated/`, not committed).

```bash
pnpm --filter styleguide dev     # http://localhost:3005
pnpm --filter styleguide build
```
