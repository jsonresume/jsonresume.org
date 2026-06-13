import { describe, it, expect, vi } from 'vitest';

/**
 * Characterization of the formatter registry map (formatters.js). This module
 * is the lookup table the registry uses to resolve a requested output format
 * to its formatter. It is pure (a static import map), but was previously
 * untested — so an accidental rename/drop of a format key or a broken alias
 * (html -> template) would slip through.
 *
 * Heavy/native side modules pulled in transitively are mocked so importing the
 * map never touches the network, an LLM, a browser, or theme packages.
 */

vi.mock('ai', () => ({ generateText: vi.fn() }));
vi.mock('@ai-sdk/openai', () => ({ openai: vi.fn() }));
vi.mock('qr-image', () => ({ default: { image: vi.fn() } }));
vi.mock('playwright', () => ({ chromium: { launch: vi.fn() } }));
vi.mock('json-to-pretty-yaml', () => ({
  default: { stringify: vi.fn(() => '') },
}));
vi.mock(
  '../../../../packages/converters/jsonresume-to-rendercv/convert',
  () => ({
    convert: vi.fn(async () => ''),
  })
);

import formatters from './formatters';

const EXPECTED_KEYS = [
  'agent',
  'qr',
  'json',
  'tex',
  'txt',
  'template',
  'html',
  'yaml',
  'rendercv',
  'pdf',
];

describe('formatters registry map', () => {
  it('exposes exactly the expected format keys', () => {
    expect(Object.keys(formatters).sort()).toEqual([...EXPECTED_KEYS].sort());
  });

  it('every registered formatter exposes a format() function', () => {
    for (const key of EXPECTED_KEYS) {
      expect(formatters[key], `formatters.${key} missing`).toBeDefined();
      expect(
        typeof formatters[key].format,
        `formatters.${key}.format not a function`
      ).toBe('function');
    }
  });

  it('aliases html to the template formatter (same module)', () => {
    expect(formatters.html).toBe(formatters.template);
  });

  it('uses "txt" (not "text") as the plain-text key', () => {
    expect(formatters.txt).toBeDefined();
    expect(formatters.text).toBeUndefined();
  });

  it('does not expose unknown/extra format keys', () => {
    const extra = Object.keys(formatters).filter(
      (k) => !EXPECTED_KEYS.includes(k)
    );
    expect(extra).toEqual([]);
  });

  it('json and yaml formatters are distinct modules', () => {
    expect(formatters.json).not.toBe(formatters.yaml);
  });
});
