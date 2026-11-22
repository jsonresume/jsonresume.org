import { expect, it } from 'vitest';
import { jsonbText } from './jsonb';

it('drops the NUL characters jsonb refuses, and nothing else', () => {
  const resume = {
    basics: { name: 'Ada\u0000' },
    courses: ['Protocol Buffers \u0000', 'Plain'],
    escaped: 'a literal \\u0000 stays',
    n: 1,
  };
  expect(JSON.parse(jsonbText(resume))).toEqual({
    basics: { name: 'Ada' },
    courses: ['Protocol Buffers ', 'Plain'],
    escaped: 'a literal \\u0000 stays',
    n: 1,
  });
  expect(jsonbText(null)).toBe('null');
});
