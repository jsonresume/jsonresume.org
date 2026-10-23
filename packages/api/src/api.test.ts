import { Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import { Health, JsonResumeApi } from './index';

describe('JsonResumeApi', () => {
  it('serves health under /api', () => {
    const paths = Object.values(JsonResumeApi.groups).flatMap((group) =>
      Object.values(group.endpoints).map((endpoint) => endpoint.path)
    );
    expect(paths).toContain('/api/health');
  });

  it('decodes a health payload', () => {
    expect(
      Schema.decodeUnknownSync(Health)({ status: 'ok', version: 'abc123' })
        .version
    ).toBe('abc123');
    expect(() =>
      Schema.decodeUnknownSync(Health)({ status: 'down', version: 'x' })
    ).toThrow();
  });
});
