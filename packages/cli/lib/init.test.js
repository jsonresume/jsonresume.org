import fs from 'fs';
import os from 'os';
import path from 'path';
import init from './init';

describe('init without an interactive terminal', () => {
  let dir;
  let log;
  let error;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'resume-cli-init-'));
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
    error = jest.spyOn(console, 'error').mockImplementation(() => {});
    process.exitCode = undefined;
  });

  afterEach(() => {
    log.mockRestore();
    error.mockRestore();
    process.exitCode = undefined;
  });

  it('writes a resume with blank name and email instead of exiting silently', async () => {
    const resumePath = path.join(dir, 'resume.json');

    await init({ resumePath, interactive: false });

    const written = JSON.parse(fs.readFileSync(resumePath, 'utf8'));
    expect(written.basics.name).toBe('');
    expect(written.basics.email).toBe('');
    expect(log).toHaveBeenCalledWith(
      expect.stringContaining('not interactive'),
    );
  });

  it('refuses to overwrite an existing resume and exits non-zero', async () => {
    const resumePath = path.join(dir, 'resume.json');
    fs.writeFileSync(resumePath, '{"basics":{"name":"Keep me"}}');

    await init({ resumePath, interactive: false });

    expect(JSON.parse(fs.readFileSync(resumePath, 'utf8')).basics.name).toBe(
      'Keep me',
    );
    expect(process.exitCode).toBe(1);
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('Not overwriting'),
    );
  });
});
