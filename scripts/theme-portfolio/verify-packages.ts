import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { portfolioIdeas } from './ideas.ts';
const execute = promisify(execFile);
const repo = process.cwd();
const node = process.env.THEME_VERIFY_NODE ?? 'node';
const workspace = await mkdtemp(
  join(tmpdir(), 'jsonresume-portfolio-packages-')
);
const tarballs = join(workspace, 'tarballs');
await mkdir(tarballs);
const ideas = portfolioIdeas();
const packages = [
  'packages/utils',
  'packages/theme-primitives',
  ...ideas.map((i) => `packages/themes/jsonresume-theme-${i.slug}`),
];
const queue = [...packages];
await Promise.all(
  Array.from({ length: 3 }, async () => {
    for (let folder; (folder = queue.shift()); ) {
      await execute('pnpm', ['pack', '--pack-destination', tarballs], {
        cwd: resolve(folder),
        maxBuffer: 4_000_000,
      });
    }
  })
);
const { readdir } = await import('node:fs/promises');
const files = (await readdir(tarballs))
  .filter((name) => name.endsWith('.tgz'))
  .map((name) => join(tarballs, name));
await writeFile(
  join(workspace, 'package.json'),
  JSON.stringify({
    name: 'portfolio-verification',
    private: true,
    type: 'module',
  })
);
await execute(
  'npm',
  [
    'install',
    '--ignore-scripts',
    '--offline',
    '--legacy-peer-deps',
    'react@18.3.1',
    'react-dom@18.3.1',
    ...files,
  ],
  { cwd: workspace, maxBuffer: 8_000_000 }
);
await writeFile(
  join(workspace, 'resume.json'),
  await readFile('packages/sample-data/complete-resume.json')
);
const slugs = ideas.map((i) => i.slug);
await writeFile(
  join(workspace, 'verify.mjs'),
  `import fs from 'node:fs';
const resume = JSON.parse(fs.readFileSync('./resume.json', 'utf8'));
for (const slug of ${JSON.stringify(slugs)}) {
 const theme = await import('jsonresume-theme-' + slug);
 const html = theme.render(resume);
 if (!html.includes('Jane Developer') || !html.includes('<style>') || html.includes('__JSONRESUME_INLINE_CSS__')) throw Error(slug);
 if (theme.default.render !== theme.render) throw Error('Default export: ' + slug);
}
console.log('${ideas.length} packed themes rendered with React 18.');
`
);
const result = await execute(node, ['verify.mjs'], { cwd: workspace });
process.stdout.write(result.stdout);
const cli = resolve(repo, 'packages/cli/build/main.js');
await mkdir(join(workspace, 'cli-output'));
for (const slug of slugs) {
  await execute(
    node,
    [
      cli,
      'export',
      `cli-output/${slug}.html`,
      '--resume',
      'resume.json',
      '--theme',
      slug,
    ],
    { cwd: workspace, maxBuffer: 4_000_000 }
  );
  const html = await readFile(
    join(workspace, 'cli-output', `${slug}.html`),
    'utf8'
  );
  if (!html.includes('Jane Developer') || !html.includes('<style>'))
    throw new Error(`CLI export: ${slug}`);
}
process.stdout.write(
  `${slugs.length} installed-package CLI exports passed. Artifacts: ${workspace}\n`
);
