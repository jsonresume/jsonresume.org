import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  discoverThemes,
  listThemesInDir,
  formatThemesList,
} from './list-themes';

// Build a throwaway project directory on the real filesystem whose
// `node_modules` mirrors a typical install: a couple of real themes, a broken
// theme folder (no package.json), and unrelated packages that must be ignored.
const buildFixtureProject = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'resume-cli-themes-'));
  const nodeModules = path.join(root, 'node_modules');

  const writePkg = (dirName, pkg) => {
    const dir = path.join(nodeModules, dirName);
    fs.mkdirSync(dir, { recursive: true });
    if (pkg) {
      fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg));
    }
  };

  // Two valid themes (out of alphabetical order to prove sorting).
  writePkg('jsonresume-theme-even', {
    name: 'jsonresume-theme-even',
    version: '0.6.0',
    description: 'A flat JSON Resume theme.',
  });
  writePkg('jsonresume-theme-elegant', {
    name: 'jsonresume-theme-elegant',
    version: '1.16.1',
  });
  // A theme-prefixed folder with no package.json — half-installed/broken;
  // must be skipped, not crash discovery.
  writePkg('jsonresume-theme-broken', null);
  // Non-theme packages that must never appear in the list.
  writePkg('chalk', { name: 'chalk', version: '4.1.0' });
  writePkg('jsonresume-other', { name: 'jsonresume-other', version: '1.0.0' });

  return { root, nodeModules };
};

describe('list-themes discovery', () => {
  let fixture;

  beforeAll(() => {
    fixture = buildFixtureProject();
  });

  afterAll(() => {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  });

  it('lists installed jsonresume-theme-* packages by slug, sorted', () => {
    const themes = discoverThemes({ cwd: fixture.root });
    expect(themes.map((t) => t.slug)).toEqual(['elegant', 'even']);
  });

  it('ignores non-theme packages and broken theme folders', () => {
    const slugs = discoverThemes({ cwd: fixture.root }).map((t) => t.slug);
    expect(slugs).not.toContain('broken');
    expect(slugs).not.toContain('other');
    expect(slugs).not.toContain('chalk');
  });

  it('captures the package name, version and description of each theme', () => {
    const themes = discoverThemes({ cwd: fixture.root });
    const even = themes.find((t) => t.slug === 'even');
    expect(even).toEqual({
      slug: 'even',
      name: 'jsonresume-theme-even',
      version: '0.6.0',
      description: 'A flat JSON Resume theme.',
    });
    // A theme without a description still resolves, with description null.
    const elegant = themes.find((t) => t.slug === 'elegant');
    expect(elegant.version).toEqual('1.16.1');
    expect(elegant.description).toBeNull();
  });

  it('returns an empty list when node_modules is missing', () => {
    const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'resume-cli-empty-'));
    try {
      expect(discoverThemes({ cwd: empty })).toEqual([]);
    } finally {
      fs.rmSync(empty, { recursive: true, force: true });
    }
  });

  it('de-duplicates a slug installed in multiple node_modules (local wins)', () => {
    // A second node_modules (e.g. a global root) also ships `even`, plus a
    // theme not present locally. The local `even` should win; `global-only`
    // should be added.
    const globalRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), 'resume-cli-global-'),
    );
    try {
      const writeGlobalPkg = (dirName, pkg) => {
        const dir = path.join(globalRoot, dirName);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg));
      };
      writeGlobalPkg('jsonresume-theme-even', {
        name: 'jsonresume-theme-even',
        version: '9.9.9',
      });
      writeGlobalPkg('jsonresume-theme-global-only', {
        name: 'jsonresume-theme-global-only',
        version: '2.0.0',
      });

      const themes = discoverThemes({
        cwd: fixture.root,
        extraNodeModules: [globalRoot],
      });
      const slugs = themes.map((t) => t.slug);
      expect(slugs).toEqual(['elegant', 'even', 'global-only']);
      // Local install shadows the global one (version stays 0.6.0).
      expect(themes.find((t) => t.slug === 'even').version).toEqual('0.6.0');
    } finally {
      fs.rmSync(globalRoot, { recursive: true, force: true });
    }
  });

  it('listThemesInDir returns [] for a non-existent directory', () => {
    expect(listThemesInDir('/no/such/dir/node_modules')).toEqual([]);
  });
});

describe('formatThemesList', () => {
  it('prints each slug and a usage example when themes are installed', () => {
    const output = formatThemesList([
      { slug: 'elegant', name: 'jsonresume-theme-elegant', version: '1.16.1' },
      { slug: 'even', name: 'jsonresume-theme-even', version: '0.6.0' },
    ]);
    expect(output).toContain('Installed themes (2)');
    expect(output).toContain('elegant');
    expect(output).toContain('even');
    expect(output).toContain('--theme elegant');
    expect(output).toContain('https://jsonresume.org/themes/');
  });

  it('prints an install hint and the gallery link when nothing is installed', () => {
    const output = formatThemesList([]);
    expect(output).toContain('No JSON Resume themes found');
    expect(output).toContain('npm install jsonresume-theme-even');
    expect(output).toContain('https://jsonresume.org/themes/');
  });
});
