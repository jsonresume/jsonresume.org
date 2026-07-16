import { describe, it, expect, vi } from 'vitest';

/**
 * Characterization of the date-normalization performed by template/format.js
 * before handing the resume to a theme's render(). normalizeDates() is not
 * exported, so it is exercised through format() with a mock theme whose
 * render() echoes the (post-normalization) resume back as JSON. This locks in
 * the documented "Date-shadow" fix: Date objects in date fields are coerced to
 * YYYY-MM-DD strings so Handlebars/moment themes don't crash.
 *
 * Only non-handlebars theme names go through getTheme(), so we use a custom
 * (non-listed) theme slug and mock getTheme to return an echoing renderer.
 */

const renderSpy = vi.fn((resume) => JSON.stringify(resume));

vi.mock('./getTheme', () => ({
  getTheme: vi.fn((theme) => {
    if (theme === 'missing') {
      return null;
    }
    return { render: renderSpy };
  }),
}));

import { format } from './format';

async function renderedResume(resume, theme = 'echo') {
  renderSpy.mockClear();
  await format(resume, { theme });
  // the resume object handed to render() reflects normalizeDates output
  return renderSpy.mock.calls[0][0];
}

describe('format() normalizeDates', () => {
  it('coerces Date objects in date fields to YYYY-MM-DD strings', async () => {
    const resume = {
      basics: { name: 'X' },
      work: [
        {
          name: 'Co',
          startDate: new Date('2021-03-15T10:00:00Z'),
          endDate: new Date('2022-06-01T00:00:00Z'),
        },
      ],
    };
    const out = await renderedResume(resume);
    expect(out.work[0].startDate).toBe('2021-03-15');
    expect(out.work[0].endDate).toBe('2022-06-01');
  });

  it('leaves already-string date fields untouched', async () => {
    const resume = {
      basics: { name: 'X' },
      education: [
        { institution: 'U', startDate: '2015-09', endDate: '2019-05' },
      ],
    };
    const out = await renderedResume(resume);
    expect(out.education[0].startDate).toBe('2015-09');
    expect(out.education[0].endDate).toBe('2019-05');
  });

  it('normalizes the "date" and "releaseDate" fields too', async () => {
    const resume = {
      basics: { name: 'X' },
      awards: [{ title: 'A', date: new Date('2023-01-02T00:00:00Z') }],
      publications: [
        { name: 'P', releaseDate: new Date('2020-12-31T00:00:00Z') },
      ],
    };
    const out = await renderedResume(resume);
    expect(out.awards[0].date).toBe('2023-01-02');
    expect(out.publications[0].releaseDate).toBe('2020-12-31');
  });

  it('normalizes dates across all handled sections', async () => {
    const d = new Date('2021-01-01T00:00:00Z');
    const resume = {
      basics: { name: 'X' },
      work: [{ startDate: d }],
      education: [{ startDate: d }],
      volunteer: [{ startDate: d }],
      projects: [{ startDate: d }],
      awards: [{ date: d }],
      publications: [{ releaseDate: d }],
    };
    const out = await renderedResume(resume);
    expect(out.work[0].startDate).toBe('2021-01-01');
    expect(out.education[0].startDate).toBe('2021-01-01');
    expect(out.volunteer[0].startDate).toBe('2021-01-01');
    expect(out.projects[0].startDate).toBe('2021-01-01');
    expect(out.awards[0].date).toBe('2021-01-01');
    expect(out.publications[0].releaseDate).toBe('2021-01-01');
  });

  it('does NOT normalize date fields in unhandled sections (e.g. skills)', async () => {
    // skills is not in normalizeDates' section list, so a Date there is left
    // untouched (still a Date instance handed to render()).
    const resume = {
      basics: { name: 'X' },
      skills: [{ name: 'S', startDate: new Date('2021-03-15T10:00:00Z') }],
    };
    const out = await renderedResume(resume);
    expect(out.skills[0].startDate).toBeInstanceOf(Date);
  });

  it('does not mutate the caller-supplied resume object', async () => {
    const original = new Date('2021-03-15T10:00:00Z');
    const resume = { basics: { name: 'X' }, work: [{ startDate: original }] };
    await format(resume, { theme: 'echo' });
    // original resume.work[0].startDate is still a Date instance
    expect(resume.work[0].startDate).toBeInstanceOf(Date);
  });

  it('handles sections that are absent or not arrays without throwing', async () => {
    const resume = { basics: { name: 'X' }, work: 'not-an-array' };
    const out = await renderedResume(resume);
    expect(out.work).toBe('not-an-array');
    expect(out.basics.name).toBe('X');
  });

  it('passes resume through unchanged when there are no date fields', async () => {
    const resume = {
      basics: { name: 'X' },
      work: [{ name: 'Co', position: 'Dev' }],
    };
    const out = await renderedResume(resume);
    expect(out.work[0]).toEqual({ name: 'Co', position: 'Dev' });
  });

  it('leaves a malformed (plain object) date value untouched instead of coercing to "[object Object]"', async () => {
    // Regression: a non-Date object in a date field was String()-coerced to the
    // literal "[object Object]", which would render as garbage. Such values are
    // left as-is so the theme can decide how to handle them.
    const bogus = { year: 2020, month: 3 };
    const resume = {
      basics: { name: 'X' },
      work: [{ name: 'Co', startDate: bogus }],
    };
    const out = await renderedResume(resume);
    expect(out.work[0].startDate).not.toBe('[object Object]');
    expect(out.work[0].startDate).toEqual({ year: 2020, month: 3 });
  });

  it('leaves an array date value untouched instead of joining its elements', async () => {
    // String([...]) silently joins array elements, mangling the value; the
    // array is now left intact.
    const resume = {
      basics: { name: 'X' },
      work: [{ name: 'Co', endDate: ['2020', '01'] }],
    };
    const out = await renderedResume(resume);
    expect(out.work[0].endDate).toEqual(['2020', '01']);
  });

  it('leaves a null date value untouched', async () => {
    const resume = {
      basics: { name: 'X' },
      education: [{ institution: 'U', endDate: null }],
    };
    const out = await renderedResume(resume);
    expect(out.education[0].endDate).toBeNull();
  });

  it('still coerces real Date objects even though they are typeof object', async () => {
    // Guard: the defensive change must not regress the core Date -> ISO path.
    const resume = {
      basics: { name: 'X' },
      work: [{ name: 'Co', startDate: new Date('2021-03-15T10:00:00Z') }],
    };
    const out = await renderedResume(resume);
    expect(out.work[0].startDate).toBe('2021-03-15');
  });
});

describe('format() theme resolution and headers', () => {
  it('throws "theme-missing" when getTheme returns null', async () => {
    await expect(
      format({ basics: { name: 'X' } }, { theme: 'missing' })
    ).rejects.toThrow('theme-missing');
  });

  it('returns text/html content-type and cache headers', async () => {
    const { headers } = await format({ basics: { name: 'X' } }, {});
    expect(headers).toEqual([
      { key: 'Cache-control', value: 'public, max-age=90' },
      { key: 'Content-Type', value: 'text/html; charset=utf-8' },
    ]);
  });

  it('returns the rendered HTML as content', async () => {
    const { content } = await format(
      { basics: { name: 'Jane' } },
      { theme: 'echo' }
    );
    // echo renderer returns JSON of the resume
    expect(content).toContain('Jane');
  });

  it('defaults to the elegant theme when no theme option is given', async () => {
    const { getTheme } = await import('./getTheme');
    getTheme.mockClear();
    await format({ basics: { name: 'X' } }, {});
    expect(getTheme).toHaveBeenCalledWith('elegant');
  });
});
