import { RegistryProvider } from '@effect/atom-react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DeleteAccount } from './settings/DeleteAccount';

afterEach(() => vi.unstubAllGlobals());

describe('deleting the account', () => {
  it('asks why, optionally, and sends the answer with the deletion', async () => {
    // Refused, so the page stays put and the request can be read.
    const fetch = vi.fn(async () =>
      Response.json(
        { _tag: 'ConfirmationMismatch' },
        { status: 400, headers: { 'content-type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetch);
    render(
      <RegistryProvider>
        <DeleteAccount username="ada" />
      </RegistryProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Delete my account' }));
    const why = screen.getByRole('combobox', {
      name: 'Why are you leaving? (optional)',
    });
    expect(why).toHaveValue('');
    fireEvent.change(why, { target: { value: 'private' } });
    fireEvent.change(
      screen.getByRole('textbox', { name: 'Type ada to confirm' }),
      {
        target: { value: 'ada' },
      }
    );
    const dialog = screen.getByRole('dialog');
    await act(async () => {
      fireEvent.click(
        [...dialog.querySelectorAll('button')].find(
          (b) => b.textContent === 'Delete my account'
        ) ?? dialog
      );
    });
    const [, init] = fetch.mock.calls[0] as unknown as [
      string,
      { body: string }
    ];
    expect(JSON.parse(init.body)).toEqual({
      confirm: 'ada',
      reason: 'private',
    });
  });
});
