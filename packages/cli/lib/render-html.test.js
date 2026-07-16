import fs from 'fs';
import os from 'os';
import path from 'path';
import renderHTML, { resolveThemePath } from './render-html';
import { ThemeNotFoundError } from './theme-errors';

describe('renderHTML', () => {
  beforeAll(() => {
    const originalRequireResolve = require.resolve;
    const mockThemePath = 'mock/path/to/jsonresume-theme-even';
    require.resolve = (...args) => {
      if (args[0] === 'jsonresume-theme-even') {
        return mockThemePath;
      }
      return originalRequireResolve.apply(require, ...args);
    };
    require.cache[mockThemePath] = {
      render: () => 'here-is-your-mocked-theme',
    };
  });
  const resume = {
    basics: {
      name: 'test',
      label: 'Programmer',
      email: 'test4@test.com',
    },
  };

  it('should reject when theme is not available', async () => {
    await expect(
      renderHTML({ resume, themePath: 'unknown' }),
    ).rejects.toBeTruthy();
  });

  describe('should render html when theme is available', () => {
    it('with long theme name', async () => {
      expect(
        await renderHTML({ resume, themePath: 'jsonresume-theme-even' }),
      ).toStartWith('<!doctype html>');
    });

    it('with short theme name', async () => {
      expect(await renderHTML({ resume, themePath: 'even' })).toStartWith(
        '<!doctype html>',
      );
    });

    it('should reject theme with invalid path', async () => {
      await expect(
        renderHTML({ resume, themePath: './unknown' }),
      ).rejects.toBeTruthy();
    });

    it('with local theme path', async () => {
      expect(
        await renderHTML({
          resume,
          themePath: './node_modules/jsonresume-theme-even',
        }),
      ).toStartWith('<!doctype html>');
    });
  });
});

describe('resolveThemePath', () => {
  // On-disk fixtures: a fake install root with a node_modules directory so we
  // can exercise real require.resolve behavior without touching the repo.
  let root;
  let cwdSpy;

  const makeTheme = (dirName, { main } = {}) => {
    const themeDir = path.join(root, 'node_modules', dirName);
    const entryFile = path.join(themeDir, main || 'index.js');
    fs.mkdirSync(path.dirname(entryFile), { recursive: true });
    const pkg = { name: dirName, version: '1.0.0' };
    if (main) {
      pkg.main = main;
    }
    fs.writeFileSync(path.join(themeDir, 'package.json'), JSON.stringify(pkg));
    fs.writeFileSync(
      entryFile,
      'module.exports = { render: () => "<!doctype html>" };',
    );
  };

  beforeAll(() => {
    root = fs.realpathSync(
      fs.mkdtempSync(path.join(os.tmpdir(), 'resume-cli-themes-')),
    );
    makeTheme('jsonresume-theme-short');
    // A literal directory the (previously broken) prefix fallback would have
    // matched for the scoped-looking specifier "@scoped".
    makeTheme('jsonresume-theme-@scoped');
    makeTheme('jsonresume-theme-nested', { main: 'lib/entry.js' });
    fs.mkdirSync(path.join(root, 'sub'), { recursive: true });
  });

  afterAll(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  afterEach(() => {
    if (cwdSpy) {
      cwdSpy.mockRestore();
      cwdSpy = undefined;
    }
  });

  const mockCwd = (dir) => {
    cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(dir);
  };

  it('adds the jsonresume-theme- prefix for bare short names', () => {
    mockCwd(root);
    expect(resolveThemePath('short')).toBe(
      path.join(root, 'node_modules', 'jsonresume-theme-short', 'index.js'),
    );
  });

  it('does not apply the prefix fallback to scoped specifiers', () => {
    mockCwd(root);
    // The old guard tested the wrong variable (`path`, always false here) and
    // coerced it to the string "false", so the fallback ran unconditionally
    // and "@scoped" would have resolved to jsonresume-theme-@scoped.
    expect(() => resolveThemePath('@scoped')).toThrow(ThemeNotFoundError);
  });

  it('resolves themes hoisted to a parent node_modules', () => {
    mockCwd(path.join(root, 'sub'));
    expect(resolveThemePath('jsonresume-theme-short')).toBe(
      path.join(root, 'node_modules', 'jsonresume-theme-short', 'index.js'),
    );
  });

  it('resolves package.json main entries that are not index.js', () => {
    mockCwd(root);
    expect(resolveThemePath('jsonresume-theme-nested')).toBe(
      path.join(
        root,
        'node_modules',
        'jsonresume-theme-nested',
        'lib',
        'entry.js',
      ),
    );
  });

  it('throws ThemeNotFoundError for unknown themes', () => {
    mockCwd(root);
    expect(() => resolveThemePath('definitely-not-installed')).toThrow(
      ThemeNotFoundError,
    );
  });

  it('throws ThemeNotFoundError for unresolvable relative paths', () => {
    mockCwd(root);
    expect(() => resolveThemePath('./missing-local-theme')).toThrow(
      ThemeNotFoundError,
    );
  });
});
