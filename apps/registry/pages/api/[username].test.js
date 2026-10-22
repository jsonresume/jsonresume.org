import { describe, it, expect, vi, beforeEach } from 'vitest';
import generateResume from '../../lib/generateResume';
import handler from './[username]';

vi.mock('../../lib/generateResume', () => ({ default: vi.fn() }));
vi.mock('../../lib/trackView', () => ({ default: vi.fn() }));

const mockRes = () => {
  const res = { headers: {} };
  res.setHeader = vi.fn((key, value) => {
    res.headers[key] = value;
  });
  res.status = vi.fn((code) => {
    res.statusCode = code;
    return res;
  });
  res.send = vi.fn((body) => {
    res.body = body;
    return res;
  });
  res.json = vi.fn((body) => {
    res.jsonBody = body;
    return res;
  });
  return res;
};

const fail = (error) => generateResume.mockResolvedValue({ error });

describe('GET /:username error responses', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders an uncached 404 page for an unknown user', async () => {
    fail({ code: 'INVALID_USERNAME', message: 'not a user' });
    const res = mockRes();

    await handler({ query: { username: 'nobody' } }, res);

    expect(res.statusCode).toBe(404);
    expect(res.headers['Cache-Control']).toBe('no-store');
    expect(res.headers['Content-Type']).toContain('text/html');
    expect(res.body).toContain('not a user');
  });

  it('returns JSON for data formats', async () => {
    fail({ code: 'INVALID_USERNAME', message: 'not a user' });
    const res = mockRes();

    await handler({ query: { username: 'nobody.json' } }, res);

    expect(res.statusCode).toBe(404);
    expect(res.jsonBody.code).toBe('INVALID_USERNAME');
  });

  it('returns JSON validation errors for data formats', async () => {
    fail({ code: 'RESUME_SCHEMA_ERROR', extra: { validation: [{}] } });
    const res = mockRes();

    await handler({ query: { username: 'jane.json' } }, res);

    expect(res.statusCode).toBe(400);
    expect(res.jsonBody.extra.validation).toHaveLength(1);
    expect(res.send).not.toHaveBeenCalled();
  });

  it('honors forceJSON on page requests', async () => {
    fail({ code: 'TEMPLATE_MISSING', extra: { themeName: 'x' } });
    const res = mockRes();

    await handler({ query: { username: 'jane', forceJSON: '' } }, res);

    expect(res.statusCode).toBe(404);
    expect(res.jsonBody.code).toBe('TEMPLATE_MISSING');
  });

  it('returns 503 with Retry-After when GitHub is unavailable', async () => {
    fail({ code: 'GITHUB_UNAVAILABLE', message: 'try later' });
    const res = mockRes();

    await handler({ query: { username: 'jane' } }, res);

    expect(res.statusCode).toBe(503);
    expect(res.headers['Retry-After']).toBe('60');
  });

  it('sends no-store on success so Cloudflare does not hold resumes for hours', async () => {
    generateResume.mockResolvedValue({ content: '<html></html>', headers: [] });
    const res = mockRes();

    await handler({ query: { username: 'jane' } }, res);

    expect(res.statusCode).toBe(200);
    expect(res.headers['Cache-Control']).toBe('no-store');
  });
});
