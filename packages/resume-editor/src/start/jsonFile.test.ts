import { describe, expect, it } from 'vitest';
import { readResumeJson } from './jsonFile';

const file = (text: string, name = 'resume.json', type = 'application/json') =>
  new File([text], name, { type });

describe('readResumeJson', () => {
  it('reads a resume.json as it is', async () => {
    const resume = { basics: { name: 'Ada' }, work: [], custom: 1 };
    expect(await readResumeJson(file(JSON.stringify(resume)))).toEqual(resume);
  });

  it('unwraps { resume: … }, and knows .json by name alone', async () => {
    const text = JSON.stringify({ resume: { basics: { name: 'Ada' } } });
    expect(await readResumeJson(file(text, 'CV.JSON', ''))).toEqual({
      basics: { name: 'Ada' },
    });
  });

  it('leaves other files, broken JSON and non-resumes to the import', async () => {
    expect(
      await readResumeJson(file('{"basics":{}}', 'cv.txt', 'text/plain'))
    ).toBeNull();
    expect(await readResumeJson(file('{"basics":'))).toBeNull();
    expect(await readResumeJson(file('[{"basics":{}}]'))).toBeNull();
    expect(await readResumeJson(file('{"name":"Ada","jobs":[]}'))).toBeNull();
  });
});
