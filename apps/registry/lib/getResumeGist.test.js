import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import getResumeGist from './getResumeGist';

vi.mock('axios', () => {
  const axiosFn = vi.fn();
  axiosFn.get = vi.fn();
  return { default: axiosFn };
});

vi.mock('../app/providers/ResumeProvider', () => ({
  RESUME_GIST_NAME: 'resume.json',
}));

vi.mock('./logger', () => ({
  default: { error: vi.fn(), info: vi.fn(), debug: vi.fn(), warn: vi.fn() },
}));

const httpError = (status) =>
  Object.assign(new Error(`Request failed with status code ${status}`), {
    response: { status },
  });

const gistList = { data: [{ id: 'abc', files: { 'resume.json': {} } }] };

describe('getResumeGist', () => {
  let originalToken;

  beforeEach(() => {
    vi.clearAllMocks();
    originalToken = process.env.GITHUB_TOKEN;
    process.env.GITHUB_TOKEN = 'test-token';
  });

  afterEach(() => {
    process.env.GITHUB_TOKEN = originalToken;
  });

  it('returns the resume from the user gist', async () => {
    axios.get.mockResolvedValue(gistList);
    axios.mockResolvedValue({ data: { basics: { name: 'Jane' } } });

    const result = await getResumeGist('jane');

    expect(result).toEqual({ resume: { basics: { name: 'Jane' } } });
    expect(axios.get.mock.calls[0][1].headers.Authorization).toBe(
      'Bearer test-token'
    );
  });

  it('reports a 404 from GitHub as an invalid username', async () => {
    axios.get.mockRejectedValue(httpError(404));

    const result = await getResumeGist('nobody');

    expect(result.error.code).toBe('INVALID_USERNAME');
  });

  it('reports rate limiting as GitHub unavailable, not a bad username', async () => {
    axios.get.mockRejectedValue(httpError(403));

    const result = await getResumeGist('jane');

    expect(result.error.code).toBe('GITHUB_UNAVAILABLE');
  });

  it('retries without the token when GitHub rejects it', async () => {
    axios.get
      .mockRejectedValueOnce(httpError(401))
      .mockResolvedValueOnce(gistList);
    axios.mockResolvedValue({ data: { basics: {} } });

    const result = await getResumeGist('jane');

    expect(result.resume).toEqual({ basics: {} });
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.get.mock.calls[1][1]).toBeUndefined();
  });

  it('reports GitHub unavailable when the unauthenticated retry also fails', async () => {
    axios.get
      .mockRejectedValueOnce(httpError(401))
      .mockRejectedValueOnce(httpError(403));

    const result = await getResumeGist('jane');

    expect(result.error.code).toBe('GITHUB_UNAVAILABLE');
  });

  it('reports a missing resume.json gist', async () => {
    axios.get.mockResolvedValue({ data: [{ id: 'x', files: {} }] });

    const result = await getResumeGist('jane');

    expect(result.error.code).toBe('NON_EXISTENT_GIST');
  });
});
