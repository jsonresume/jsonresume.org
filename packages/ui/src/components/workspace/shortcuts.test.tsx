import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useShortcut } from './shortcuts';

function Save({ onSave }: { onSave: () => void }) {
  useShortcut('mod+s', onSave);
  return null;
}

describe('useShortcut', () => {
  const errors: unknown[] = [];
  const record = (e: ErrorEvent) => errors.push(e.error);
  afterEach(() => {
    window.removeEventListener('error', record);
    errors.length = 0;
  });

  it('ignores keydown events without a key, as autofill sends them', () => {
    window.addEventListener('error', record);
    const onSave = vi.fn();
    render(<Save onSave={onSave} />);
    window.dispatchEvent(new Event('keydown'));
    expect(errors).toEqual([]);
    expect(onSave).not.toHaveBeenCalled();
  });

  it('still runs on the shortcut itself', () => {
    const onSave = vi.fn();
    render(<Save onSave={onSave} />);
    const mac = /Mac|iPhone|iPad/.test(navigator.platform);
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'S', metaKey: mac, ctrlKey: !mac })
    );
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
