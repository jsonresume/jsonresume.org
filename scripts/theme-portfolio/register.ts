import { readFile, writeFile } from 'node:fs/promises';
import { portfolioIdeas, portfolioStyles } from './ideas.ts';
const ideas = portfolioIdeas();
for (const style of portfolioStyles) {
  const rows = ideas
    .filter((i) => i.style === style)
    .map((i) => [i.slug, i.name, i.brief, i.layout, i.color, i.audience]);
  await writeFile(
    `packages/theme-config/src/portfolio-${style}.js`,
    `export default ${JSON.stringify(rows, null, 2)};\n`
  );
}
await writeFile(
  'packages/theme-config/src/portfolio.js',
  `${portfolioStyles
    .map((style) => `import ${style} from './portfolio-${style}.js';`)
    .join('\n')}

/** Original portfolio designs; public usage remains zero until measured. */
export const PORTFOLIO_THEME_METADATA = Object.fromEntries([
${portfolioStyles
  .map((style) => `  ...${style}.map(row => [row, '${style}']),`)
  .join('\n')}
].map(([[slug, name, description, layout, color, audience], style]) => [slug, {
  name, description, style, layout, color, author: 'JSON Resume Team',
  tags: [audience.toLowerCase()],
}]));
`
);
const metadataPath = 'packages/theme-config/src/metadata.js';
let metadata = await readFile(metadataPath, 'utf8');
if (!metadata.includes("from './portfolio.js'"))
  metadata =
    "import { PORTFOLIO_THEME_METADATA } from './portfolio.js';\n" +
    metadata.replace(
      'const METADATA = {',
      'const METADATA = {\n  ...PORTFOLIO_THEME_METADATA,'
    );
await writeFile(metadataPath, metadata);
const entries = ideas
  .map((i) => `  '${i.slug}': () => import('jsonresume-theme-${i.slug}'),`)
  .join('\n');
await writeFile(
  'packages/resume-themes/src/portfolio-loaders.ts',
  `/** Static lazy imports preserve per-theme isolation in the hosted renderer. */\nexport const portfolioLoaders: Readonly<Record<string, () => Promise<unknown>>> = {\n${entries}\n};\n`
);
await writeFile(
  'apps/registry/lib/formatters/template/portfolioLoaders.js',
  `/** Portfolio imports remain lazy so one theme cannot break other renders. */\nexport const portfolioLoaders = {\n${entries}\n};\n`
);
for (const [path, declaration, importLine] of [
  [
    'packages/resume-themes/src/loaders.ts',
    'export const themeLoaders: Readonly<Record<string, () => Promise<unknown>>> = {',
    "import { portfolioLoaders } from './portfolio-loaders.ts';",
  ],
  [
    'apps/registry/lib/formatters/template/themeConfig.js',
    'export const THEMES = {',
    "import { portfolioLoaders } from './portfolioLoaders';",
  ],
]) {
  let source = await readFile(path, 'utf8');
  if (!source.includes(importLine))
    source = source.replace(
      declaration,
      `${importLine}\n\n${declaration}\n  ...portfolioLoaders,`
    );
  await writeFile(path, source);
}
for (const path of [
  'packages/resume-themes/package.json',
  'apps/registry/package.json',
]) {
  const pkg = JSON.parse(await readFile(path, 'utf8'));
  for (const i of ideas)
    pkg.dependencies[`jsonresume-theme-${i.slug}`] = 'workspace:*';
  pkg.dependencies = Object.fromEntries(
    Object.entries(pkg.dependencies).sort(([a], [b]) => a.localeCompare(b))
  );
  await writeFile(path, JSON.stringify(pkg, null, 2) + '\n');
}
