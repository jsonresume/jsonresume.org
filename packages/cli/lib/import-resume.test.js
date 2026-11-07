/* global FormData -- built into Node 18+ */
import fs from 'fs';
import os from 'os';
import path from 'path';
import importResume from './import-resume';

const reply = (status, body) => async () => ({
  ok: status < 400,
  status,
  json: async () => body,
});

describe('resume import', () => {
  let dir;
  let log;
  let error;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'resume-cli-import-'));
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
    error = jest.spyOn(console, 'error').mockImplementation(() => {});
    process.exitCode = undefined;
  });

  afterEach(() => {
    log.mockRestore();
    error.mockRestore();
    process.exitCode = undefined;
  });

  it('sends text files as text, writes resume.json and lists what to check', async () => {
    const file = path.join(dir, 'cv.txt');
    fs.writeFileSync(file, 'Ada Lovelace\nProgrammer');
    const resumePath = path.join(dir, 'resume.json');
    const calls = [];
    await importResume({
      file,
      resumePath,
      fetchImpl: async (url, init) => {
        calls.push({ url, init });
        return reply(200, {
          resume: { basics: { name: 'Ada Lovelace' } },
          confidence: { '/basics/name': 'high', '/basics/label': 'low' },
          warnings: ['Left out work › 0 › endDate'],
          fields: 2,
        })();
      },
    });
    expect(JSON.parse(calls[0].init.body)).toEqual({
      text: 'Ada Lovelace\nProgrammer',
    });
    expect(JSON.parse(fs.readFileSync(resumePath, 'utf8'))).toEqual({
      basics: { name: 'Ada Lovelace' },
    });
    expect(log).toHaveBeenCalledWith('  /basics/label (a guess)');
    expect(process.exitCode).toBeUndefined();
  });

  it('uploads other files as a form, and says why a refusal happened', async () => {
    const file = path.join(dir, 'scan.pdf');
    fs.writeFileSync(file, '%PDF-1.4');
    let sent;
    await importResume({
      file,
      resumePath: path.join(dir, 'resume.json'),
      fetchImpl: async (url, init) => {
        sent = init.body;
        return reply(422, { _tag: 'NothingToImport' })();
      },
    });
    expect(sent).toBeInstanceOf(FormData);
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('No text was found'),
    );
    expect(process.exitCode).toBe(1);
  });

  it('never overwrites resume.json without --force', async () => {
    const file = path.join(dir, 'cv.txt');
    fs.writeFileSync(file, 'x');
    const resumePath = path.join(dir, 'resume.json');
    fs.writeFileSync(resumePath, '{"keep":true}');
    await importResume({ file, resumePath, fetchImpl: reply(200, {}) });
    expect(fs.readFileSync(resumePath, 'utf8')).toBe('{"keep":true}');
    expect(process.exitCode).toBe(1);
  });
});
