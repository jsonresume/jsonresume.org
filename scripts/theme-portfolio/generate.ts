import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { portfolioIdeas, portfolioStyles } from './ideas.ts';
import { googleFonts } from './fonts.ts';
import { designSource } from './design-source.ts';
import type { Recipe } from './recipes.ts';
import type { SectionId } from '../../packages/theme-primitives/src/types.ts';

const ideas = portfolioIdeas();
const template = 'packages/themes/jsonresume-theme-stockholm';
const manifest = JSON.parse(await readFile(`${template}/package.json`, 'utf8'));
const recipeMaps: Record<string, Record<string, Recipe>> = {};
for (const style of portfolioStyles)
  recipeMaps[style] = (await import(`./recipes-${style}.ts`)).default;
const first: Record<string, SectionId[]> = {
  academy: ['education', 'publications', 'work', 'awards'],
  fellowship: ['education', 'publications', 'awards', 'work'],
  merit: ['education', 'projects', 'awards', 'work'],
  stewardship: ['work', 'volunteer', 'projects'],
  'skills-first': ['skills', 'projects', 'work'],
  returner: ['skills', 'projects', 'work'],
  'first-role': ['education', 'projects', 'volunteer', 'work'],
  apprenticeship: ['education', 'work', 'projects'],
  'compact-developer': ['projects', 'skills', 'work'],
  startup: ['projects', 'work'],
  'care-path': ['work', 'certificates', 'volunteer'],
  trades: ['certificates', 'skills', 'work'],
  'research-narrative': ['education', 'publications', 'projects', 'work'],
  'research-engineer': ['projects', 'publications', 'work'],
  maintainer: ['projects', 'work'],
  'studio-folio': ['projects', 'work'],
  illustration: ['projects', 'work'],
  photography: ['projects', 'work'],
  motion: ['projects', 'work'],
  atelier: ['projects', 'work'],
  musician: ['projects', 'work'],
  theatre: ['projects', 'work'],
  independent: ['projects', 'work'],
  'case-study': ['projects', 'work'],
};
const requested = process.argv
  .find((arg) => arg.startsWith('--themes='))
  ?.slice(9)
  .split(',');
const selectedIdeas = ideas.filter(
  (idea) => !requested || requested.includes(idea.slug)
);
for (const idea of selectedIdeas) {
  const r = recipeMaps[idea.style]?.[idea.key];
  if (!r) throw new Error(`Missing composition: ${idea.slug}`);
  const folder = `packages/themes/jsonresume-theme-${idea.slug}`;
  await mkdir(`${folder}/src`, { recursive: true });
  const pkg = {
    ...manifest,
    name: `jsonresume-theme-${idea.slug}`,
    description: idea.brief,
    keywords: [
      'jsonresume',
      'jsonresume-theme',
      idea.style,
      idea.layout,
      idea.color,
    ],
    repository: { ...manifest.repository, directory: folder },
  };
  await writeFile(
    `${folder}/package.json`,
    JSON.stringify(pkg, null, 2) + '\n'
  );
  for (const file of [
    'LICENSE',
    'tsconfig.json',
    'tsconfig.build.json',
    'vite.config.ts',
    'vitest.config.ts',
  ])
    await writeFile(`${folder}/${file}`, await readFile(`${template}/${file}`));
  const layout =
    idea.key === 'contact-rail'
      ? 'single'
      : { columns: 'balanced', dates: 'academic', asymmetric: 'achievement' }[
          idea.layout
        ] ?? idea.layout;
  const options = {
    slug: idea.slug,
    layout,
    defaultLanguage: idea.language,
    fonts: idea.key === 'easy-print' ? [] : googleFonts(idea.fonts),
    ...(first[idea.key] ? { sectionOrder: first[idea.key] } : {}),
    ...(idea.layout === 'columns'
      ? {
          sidebarSections: [
            'education',
            'skills',
            'certificates',
            'languages',
            'interests',
            'awards',
          ],
        }
      : {}),
  };
  await writeFile(
    `${folder}/src/index.ts`,
    `import { createTheme } from '@jsonresume/theme-primitives';\nimport { design } from './design.css';\n\nexport const render = createTheme({ ${JSON.stringify(
      options
    ).slice(
      1,
      -1
    )}, className: design, css: '__JSONRESUME_INLINE_CSS__' });\nexport default { render };\n`
  );
  await writeFile(`${folder}/src/design.css.ts`, designSource(idea, r));
  await writeFile(
    `${folder}/src/theme.test.ts`,
    (
      await readFile(`${template}/src/theme.test.ts`, 'utf8')
    ).replaceAll('stockholm', idea.slug)
  );
  await writeFile(
    `${folder}/README.md`,
    `# ${idea.name}\n\n${idea.brief}\n\n${idea.audience}. Style: ${idea.style}; layout: ${idea.layout}; default language: ${idea.language}.\n\nInstall with \`npm install jsonresume-theme-${idea.slug}\`. The package exports a synchronous \`render(resume)\` function and a default object containing it.\n\nAll standard JSON Resume sections render when populated. Text remains selectable, optional web fonts have system fallbacks, and styles are embedded at build time without runtime filesystem access. Narrow screens stack automatically; long resumes continue across A4 and Letter pages.\n\nSet \`meta.language\` to override the default language. The \`meta.researchThemes\` preferences support \`layout: "single"\`, \`density: "compact"\`, \`monochrome: true\`, \`showPhoto: true\` and \`showFullAddress: true\`. Photos and full addresses are opt-in.\n\nSee the repository's theme portfolio spreadsheet and \`docs/THEME_PORTFOLIO.md\` for design rationale, usage evidence and verification.\n`
  );
}
process.stdout.write(
  `Generated ${selectedIdeas.length} complete theme packages.\n`
);
