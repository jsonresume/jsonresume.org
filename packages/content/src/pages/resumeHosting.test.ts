import { describe, expect, it } from 'vitest';
import { problems } from './resumeHosting';

describe('the missing gist message', () => {
  it('says no resume when resume.json is missing', () => {
    expect(problems['no-gist']({ username: 'jane' }).title).toBe(
      '@jane hasn’t published a resume'
    );
  });

  it('names the file asked for with ?gistname=, and points to the main resume', () => {
    const copy = problems['no-gist']({
      username: 'jane',
      file: 'resume-fr.json',
    });
    expect(copy.title).toBe('@jane has no resume-fr.json');
    expect(copy.body).toContain('/@jane');
  });
});
