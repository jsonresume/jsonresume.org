import { RegistryProvider, useAtomSet } from '@effect/atom-react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CheckPane } from './CheckPane';
import { draftAtom } from './state';

function AddEmail() {
  const setDraft = useAtomSet(draftAtom);
  return (
    <button
      onClick={() =>
        setDraft({ basics: { name: 'Ada', email: 'ada@example.com' } })
      }
    >
      Add email
    </button>
  );
}

const score = () =>
  Number(
    screen
      .getByRole('meter', { name: 'ATS score' })
      .getAttribute('aria-valuenow')
  );

describe('CheckPane', () => {
  it('checks the draft and follows it as it changes', () => {
    render(
      <RegistryProvider initialValues={[[draftAtom, { basics: {} }]]}>
        <CheckPane />
        <AddEmail />
      </RegistryProvider>
    );
    const before = score();
    expect(screen.getAllByText('No name').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Add email' }));
    expect(score()).toBeGreaterThan(before);
    expect(screen.queryAllByText('No name')).toHaveLength(0);
  });
});
