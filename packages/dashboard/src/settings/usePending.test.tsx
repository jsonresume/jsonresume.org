import { act, renderHook } from '@testing-library/react';
import { Exit } from 'effect';
import { describe, expect, it } from 'vitest';
import { usePending } from './usePending';

describe('usePending', () => {
  it('shows the new value at once, until the server agrees', async () => {
    const { result, rerender } = renderHook(
      ({ server }) => usePending(server),
      {
        initialProps: { server: false },
      }
    );
    await act(() => result.current[1](true, async () => Exit.void));
    expect(result.current[0]).toBe(true);
    rerender({ server: true });
    expect(result.current[0]).toBe(true);
    rerender({ server: false });
    expect(result.current[0]).toBe(false);
  });

  it('puts it back when the save fails', async () => {
    const { result } = renderHook(() => usePending(false));
    await act(() => result.current[1](true, async () => Exit.fail('no')));
    expect(result.current[0]).toBe(false);
  });
});
