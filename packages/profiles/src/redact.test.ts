import { describe, expect, it } from 'vitest';
import { redact } from './redact';

const resume = {
  basics: {
    name: 'Ada',
    email: 'ada@example.com',
    phone: '+44 20 0000 0000',
    location: { address: '12 Byron St', postalCode: 'W1', city: 'London' },
  },
  work: [{ name: 'Engines' }],
};

describe('redact', () => {
  it('takes out what was hidden, and only that', () => {
    expect(redact(resume, ['email', 'address'])).toEqual({
      basics: {
        name: 'Ada',
        phone: '+44 20 0000 0000',
        location: { city: 'London' },
      },
      work: [{ name: 'Engines' }],
    });
    expect(redact(resume, [])).toBe(resume);
    expect(redact({ work: [] }, ['email'])).toEqual({ work: [] });
    expect(redact('not a resume', ['phone'])).toBe('not a resume');
  });
});
