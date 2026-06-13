import { spawn, exec as execCB } from 'child_process';
import streamToString from 'stream-to-string';
import { promisify } from 'util';
import packageJson from '../package.json';
import { formatAuditReport } from './audit';

const exec = promisify(execCB);

// Spawn the built CLI through the in-memory volume test entry (same harness as
// main.test.js) so `audit` exercises the real load -> render -> validate path.
const run = async (argv, { captureStderr = false } = {}) => {
  let exitCode;
  const child = spawn(
    process.execPath,
    ['build/test-utils/cli-test-entry.js', ...argv],
    {
      stdio: ['pipe', 'pipe', captureStderr ? 'pipe' : 2, 'ipc'],
    },
  );
  const exited = new Promise((resolve) => {
    child.on('exit', (code) => {
      exitCode = code;
      resolve();
    });
  });
  child.stdin.end();
  const stdout = await streamToString(child.stdout);
  const stderr = captureStderr ? await streamToString(child.stderr) : '';
  await exited;
  return { code: exitCode, stdout, stderr };
};

describe('formatAuditReport', () => {
  const result = {
    score: 85,
    grade: 'B',
    atsCompatibility: 'excellent',
    passed: 1,
    failed: 1,
    checks: [
      { name: 'Semantic HTML', score: 10, maxScore: 10, passed: true },
      { name: 'Single-Column Layout', score: 6, maxScore: 15, passed: false },
    ],
  };

  it('renders the headline score, grade, per-check marks and recommendations', () => {
    const report = formatAuditReport(result, ['fix the layout']);
    expect(report).toContain('ATS score: 85/100');
    expect(report).toContain('grade B');
    expect(report).toContain('1/2 checks passed');
    expect(report).toContain('Semantic HTML (10/10)');
    expect(report).toContain('Single-Column Layout (6/15)');
    expect(report).toContain('Recommendations:');
    expect(report).toContain('fix the layout');
  });

  it('omits the recommendations block when there are none', () => {
    const report = formatAuditReport(result, []);
    expect(report).not.toContain('Recommendations:');
  });
});

describe('audit command', () => {
  beforeAll(() => exec(packageJson.scripts.prepare));

  it('prints a score and at least one recommendation for the sample resume, exit 0', async () => {
    const { code, stdout } = await run([
      'audit',
      '/test-resumes/resume.json',
      // `even` is bundled and renders minimal resumes; the default `elegant`
      // theme requires a `basics.location`.
      '--theme',
      'even',
    ]);
    expect(code).toEqual(0);
    expect(stdout).toMatch(/ATS score: \d+\/100/);
    expect(stdout).toContain('grade');
    expect(stdout).toContain('Checks:');
    // The validator always returns at least one check; the sample resume also
    // surfaces a recommendation, proving the recommendations path is wired.
    expect(stdout).toContain('Recommendations:');
  });

  it('uses the bundled `even` theme by default (no --theme needed)', async () => {
    const { code, stdout } = await run(['audit', '/test-resumes/resume.json']);
    expect(code).toEqual(0);
    expect(stdout).toMatch(/ATS score: \d+\/100/);
  });

  it('prints a friendly error and exits non-zero when the resume file is missing', async () => {
    const { code, stderr } = await run(
      ['audit', '/test-resumes/does-not-exist.json', '--theme', 'even'],
      { captureStderr: true },
    );
    expect(code).toEqual(1);
    expect(stderr).toContain(
      'Could not read resume: /test-resumes/does-not-exist.json',
    );
    // No raw Node unhandled-rejection stack trace must leak.
    expect(stderr).not.toContain('triggerUncaughtException');
    expect(stderr).not.toContain('node:internal');
  });

  it('prints a friendly, actionable message and exits non-zero for an uninstalled theme', async () => {
    const { code, stderr } = await run(
      ['audit', '/test-resumes/resume.json', '--theme', 'nonexistent-xyz'],
      { captureStderr: true },
    );
    expect(code).toEqual(1);
    expect(stderr).toContain("Theme 'nonexistent-xyz' not found.");
    expect(stderr).toContain('https://jsonresume.org/themes/');
  });
});
