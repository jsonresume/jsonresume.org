import { spawn, exec as execCB } from 'child_process';
import streamToString from 'stream-to-string';
import { promisify } from 'util';
import packageJson from '../package.json';

const exec = promisify(execCB);

const run = async (
  argv,
  { waitForVolumeExport = true, stdin = '', captureStderr = false } = {},
) => {
  let volume;
  let exitCode;
  const child = spawn(
    process.execPath,
    ['build/test-utils/cli-test-entry.js', ...argv],
    {
      // When captureStderr is set, pipe fd 2 so the test can read the
      // friendly error output; otherwise inherit it (existing behavior).
      stdio: ['pipe', 'pipe', captureStderr ? 'pipe' : 2, 'ipc'],
    },
  );
  const allChecks = Promise.all([
    waitForVolumeExport
      ? new Promise((volumeSet) => {
          child.on('message', async (message) => {
            if (message.type === 'volumeExport') {
              volume = message.data;
              volumeSet();
            }
          });
        })
      : true,
    new Promise((processExited) => {
      child.on('exit', (code) => {
        exitCode = code;
        processExited();
      });
    }),
  ]);
  child.stdin.write(stdin);
  child.stdin.end();
  const stdoutPromise = streamToString(child.stdout);
  const stderrPromise = captureStderr
    ? streamToString(child.stderr)
    : Promise.resolve('');
  const stdout = await stdoutPromise;
  const stderr = await stderrPromise;
  await allChecks;
  return {
    volume,
    code: exitCode,
    stdout,
    stderr,
  };
};

describe('cli configuration', () => {
  beforeAll(() => exec(packageJson.scripts.prepare));
  it('should show help', async () => {
    const { stdout } = await run(['help'], { waitForVolumeExport: false });
    expect(stdout).toMatchInlineSnapshot(`
      "Usage: resume [command] [options]

      Options:
        -V, --version                       output the version number
        -F, --force                         Used by \`publish\` and \`export\` - bypasses
                                            schema testing.
        -t, --theme <theme name>            Theme used by \`export\` and \`serve\`
                                            (browse themes at
                                            https://jsonresume.org/themes/), or a
                                            path starting with . (use . for current
                                            directory or ../some/other/dir) (default:
                                            "jsonresume-theme-elegant")
        -f, --format <file type extension>  Used by \`export\`.
        -r, --resume <resume filename>      path to the resume in json format. Use
                                            '-' to read from stdin (default:
                                            "resume.json")
        -p, --port <port>                   Used by \`serve\` (default: 4000) (default:
                                            4000)
        -s, --silent                        Used by \`serve\` to tell it if open
                                            browser auto or not. (default: false)
        -d, --dir <path>                    Used by \`serve\` to indicate a public
                                            directory path. (default: "public")
        --schema <relativePath>             Used by \`validate\` to validate against a
                                            custom schema.
        -h, --help                          display help for command

      Commands:
        init                                Initialize a resume.json file
        validate                            Validate your resume's schema
        export [fileName]                   Export locally to .html, .pdf, .md
                                            (markdown) or .txt (text). Supply a
                                            --format <file format> flag and argument
                                            to specify export format. .md and .txt
                                            need no theme; pick a theme for
                                            .html/.pdf with --theme
                                            (https://jsonresume.org/themes/).
        serve                               Serve resume at http://localhost:4000/
        help [command]                      display help for command
      "
    `);
  });
  describe('validate', () => {
    it('should use the schema override arg', async () => {
      const { stdout } = await run([
        'validate',
        '--schema',
        '/test-resumes/only-number-schema.json',
        '--resume',
        '/test-resumes/only-number.json',
      ]);
      expect(stdout).toMatchInlineSnapshot(`
        "✓ /test-resumes/only-number.json is valid
        "
      `);
    });
    it('should fail when trying to validate an invalid resume specified by the --resume option', async () => {
      expect(
        (
          await run([
            'validate',
            '--resume',
            '/test-resumes/invalid-resume.json',
          ])
        ).code,
      ).toEqual(1);
    });
    it('should print the per-field error list (not a success line) when validation fails', async () => {
      const { code, stdout, stderr } = await run(
        ['validate', '--resume', '/test-resumes/invalid-resume.json'],
        { waitForVolumeExport: false, captureStderr: true },
      );
      expect(code).toEqual(1);
      expect(stderr).toContain('Invalid resume:');
      expect(stderr).toContain('data/basics/name must be string');
      // The success line must not appear for an invalid resume.
      expect(stdout).not.toContain('is valid');
    });
    it('should validate a resume specified by the --resume option', async () => {
      const { stdout } = await run([
        'validate',
        '--resume',
        '/test-resumes/resume.json',
      ]);
      expect(stdout).toMatchInlineSnapshot(`
        "✓ /test-resumes/resume.json is valid
        "
      `);
    });
  });
  describe('export', () => {
    it('should read from stdin when path is a dash', async () => {
      const { stdout, volume } = await run(
        [
          'export',
          '/test-resumes/exported-resume-from-stdin.html',
          '--resume',
          '-', // this is the dash
          // The default theme (elegant) throws on resumes missing a
          // `basics.location`; `even` renders minimal resumes, and this test
          // only exercises the export plumbing, not a specific theme.
          '--theme',
          'even',
        ],
        { stdin: JSON.stringify({ basics: { name: 'thomas-from-stdin' } }) },
      );
      expect(volume['/test-resumes/exported-resume-from-stdin.html']).toEqual(
        expect.stringContaining('thomas-from-stdin'),
      );
      expect(stdout).toMatchInlineSnapshot(`
        "
        Done! Find your new .html resume at:
         /test-resumes/exported-resume-from-stdin.html
        "
      `);
    });
    it('should export a resume from the path specified by --resume to the path specified immediately after the export command', async () => {
      const { stdout } = await run([
        'export',
        '/test-resumes/exported-resume.html',
        '--resume',
        '/test-resumes/resume.json',
        // See note above: `even` renders minimal resumes; the default
        // `elegant` theme requires a `basics.location`.
        '--theme',
        'even',
      ]);
      expect(stdout).toMatchInlineSnapshot(`
        "
        Done! Find your new .html resume at:
         /test-resumes/exported-resume.html
        "
      `);
    });
    it('should export markdown without requiring a theme', async () => {
      const { stdout, volume } = await run(
        [
          'export',
          '/test-resumes/exported-resume.md',
          '--resume',
          '-',
          '--format',
          'markdown',
        ],
        {
          stdin: JSON.stringify({
            basics: { name: 'thomas-md' },
            skills: [{ name: 'JS', keywords: ['Node'] }],
          }),
        },
      );
      const output = volume['/test-resumes/exported-resume.md'];
      expect(output).toEqual(expect.stringContaining('# thomas-md'));
      expect(output).toEqual(expect.stringContaining('## Skills'));
      expect(stdout).toContain('.md resume at:');
    });
    it('should export plain text without requiring a theme', async () => {
      const { stdout, volume } = await run(
        [
          'export',
          '/test-resumes/exported-resume.txt',
          '--resume',
          '-',
          '--format',
          'text',
        ],
        {
          stdin: JSON.stringify({ basics: { name: 'thomas-txt' } }),
        },
      );
      const output = volume['/test-resumes/exported-resume.txt'];
      expect(output).toEqual(expect.stringContaining('thomas-txt'));
      expect(stdout).toContain('.txt resume at:');
    });
    it('should print a friendly, actionable message and exit non-zero when the theme is not installed', async () => {
      const { code, stderr } = await run(
        [
          'export',
          '/test-resumes/exported-resume.html',
          '--resume',
          '/test-resumes/resume.json',
          '--theme',
          'nonexistent-xyz',
        ],
        { waitForVolumeExport: false, captureStderr: true },
      );
      expect(code).toEqual(1);
      expect(stderr).toContain("Theme 'nonexistent-xyz' not found.");
      expect(stderr).toContain('npm install jsonresume-theme-nonexistent-xyz');
      expect(stderr).toContain('https://jsonresume.org/themes/');
      // The raw stack trace must not leak to the user.
      expect(stderr).not.toContain('at _default');
    });
  });
});
