import { describe, expect, it } from 'vitest';
import { handlePath, parseHandle } from './username';

describe('parseHandle', () => {
  it('reads a username and format', () => {
    expect(parseHandle('@thomasdavis')).toEqual({
      username: 'thomasdavis',
      extension: 'html',
      format: 'html',
      canonical: true,
    });
    expect(parseHandle('@thomas-davis.json')).toMatchObject({
      username: 'thomas-davis',
      format: 'json',
    });
    expect(parseHandle('@a.yaml')?.format).toBe('yaml');
  });

  it('lowercases, and marks capitals as not canonical', () => {
    expect(parseHandle('@ThomasDavis.JSON')).toMatchObject({
      username: 'thomasdavis',
      format: 'json',
      canonical: false,
    });
  });

  it('keeps an extension it does not serve, with no format', () => {
    expect(parseHandle('@a.pdf')).toMatchObject({
      extension: 'pdf',
      format: undefined,
    });
  });

  it.each([
    'thomasdavis',
    '@',
    '@-a',
    '@a-',
    '@a--b',
    '@a.b.json',
    '@' + 'a'.repeat(40),
    '@a_b',
  ])('rejects %s', (segment) => expect(parseHandle(segment)).toBeUndefined());

  it('builds paths back', () => {
    expect(handlePath('foo')).toBe('/@foo');
    expect(handlePath('foo', 'txt')).toBe('/@foo.txt');
  });
});
