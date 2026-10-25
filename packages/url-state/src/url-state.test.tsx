import '@testing-library/jest-dom/vitest';
import { RegistryProvider, useAtom } from '@effect/atom-react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { Atom } from 'effect/reactivity';
import { afterEach, describe, expect, it } from 'vitest';
import { optionParam, textParam, useAtomsInUrl } from './index';

const query = Atom.make('');
const tag = Atom.make<string | null>(null);
const bindings = [textParam('q', query), optionParam('tag', tag)];

function Filters() {
  useAtomsInUrl(bindings);
  const [q, setQ] = useAtom(query);
  const [t, setT] = useAtom(tag);
  return (
    <>
      <input aria-label="q" value={q} onChange={(e) => setQ(e.target.value)} />
      <button onClick={() => setT(t ? null : 'minimal')}>tag</button>
      <output>{`${q}|${t ?? ''}`}</output>
    </>
  );
}

const mount = () =>
  act(async () => {
    render(
      <RegistryProvider>
        <Filters />
      </RegistryProvider>
    );
  });

afterEach(cleanup);

describe('useAtomsInUrl', () => {
  it('reads params after mount and keeps unrelated params', async () => {
    window.history.replaceState(null, '', '/x?q=react&tag=dark&page=2');
    await mount();
    expect(screen.getByRole('status')).toHaveTextContent('react|dark');
    await act(async () =>
      fireEvent.change(screen.getByLabelText('q'), { target: { value: '' } })
    );
    expect(window.location.search).toBe('?tag=dark&page=2');
  });

  it('writes changes back to the URL', async () => {
    window.history.replaceState(null, '', '/x');
    await mount();
    await act(async () =>
      fireEvent.change(screen.getByLabelText('q'), { target: { value: 'go' } })
    );
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'tag' }))
    );
    expect(window.location.search).toBe('?q=go&tag=minimal');
  });
});
