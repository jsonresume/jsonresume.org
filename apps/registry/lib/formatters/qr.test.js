import { describe, it, expect, vi } from 'vitest';
import qrFormatter from './qr';

// Mock qr-image
vi.mock('qr-image', () => ({
  default: {
    image: vi.fn((url, options) => ({
      mockQRCode: true,
      url,
      options,
    })),
  },
}));

describe('qr formatter', () => {
  it('generates QR code for username', async () => {
    const resume = { basics: { name: 'Test' } };
    const options = { username: 'johndoe' };

    const result = await qrFormatter.format(resume, options);

    expect(result.content.url).toContain('johndoe');
  });

  it('uses registry URL', async () => {
    const resume = {};
    const options = { username: 'test' };

    const result = await qrFormatter.format(resume, options);

    expect(result.content.url).toBe('https://registry.jsonresume.org/test');
  });

  it('returns PNG content type header', async () => {
    const resume = {};
    const options = { username: 'user' };

    const result = await qrFormatter.format(resume, options);

    expect(result.headers).toEqual([
      { key: 'Content-Type', value: 'image/png' },
    ]);
  });

  it('configures QR code options', async () => {
    const resume = {};
    const options = { username: 'test' };

    const result = await qrFormatter.format(resume, options);

    expect(result.content.options).toEqual({
      type: 'png',
      ec_level: 'S',
      size: 60,
      margin: 1,
    });
  });

  it('ignores resume content', async () => {
    const resume = {
      basics: { name: 'John Doe', email: 'test@example.com' },
    };
    const options = { username: 'johndoe' };

    const result = await qrFormatter.format(resume, options);

    // Only username matters for QR code
    expect(result.content.url).toContain('johndoe');
  });

  it('returns content and headers', async () => {
    const resume = {};
    const options = { username: 'test' };

    const result = await qrFormatter.format(resume, options);

    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('headers');
  });

  it('uses small error correction level', async () => {
    const resume = {};
    const options = { username: 'test' };

    const result = await qrFormatter.format(resume, options);

    expect(result.content.options.ec_level).toBe('S');
  });

  it('sets size to 60', async () => {
    const resume = {};
    const options = { username: 'test' };

    const result = await qrFormatter.format(resume, options);

    expect(result.content.options.size).toBe(60);
  });

  it('sets margin to 1', async () => {
    const resume = {};
    const options = { username: 'test' };

    const result = await qrFormatter.format(resume, options);

    expect(result.content.options.margin).toBe(1);
  });

  it('format is async function', () => {
    const result = qrFormatter.format({}, { username: 'test' });

    expect(result).toBeInstanceOf(Promise);
  });
});
