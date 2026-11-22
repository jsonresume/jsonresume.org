import sink from 'node:console';
import { Effect } from 'effect';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { quietly } from './quiet.ts';
import { renderTheme } from './render.ts';

afterEach(() => vi.restoreAllMocks());

describe('themes render quietly', () => {
  it('drops what a theme prints, and puts the console back', () => {
    const log = vi.spyOn(sink, 'log');
    expect(
      quietly(() => {
        sink.log('Rendering section: work');
        return 'html';
      })
    ).toBe('html');
    expect(log).not.toHaveBeenCalled();
    sink.log('after');
    expect(log).toHaveBeenCalledWith('after');
  });

  it('puts the console back when the theme throws', () => {
    const before = sink.warn;
    expect(() =>
      quietly(() => {
        throw new Error('broken theme');
      })
    ).toThrow('broken theme');
    expect(sink.warn).toBe(before);
  });

  it('keeps rickosborne, which logs every section, out of the logs', async () => {
    const log = vi.spyOn(sink, 'log');
    const html = await Effect.runPromise(
      renderTheme('rickosborne', { basics: { name: 'Ada Lovelace' } })
    );
    expect(html).toContain('Ada Lovelace');
    expect(log).not.toHaveBeenCalled();
  });
});
