import { RegistryProvider, useAtom } from '@effect/atom-react';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { SaveBar } from './Actions';
import { IMPORT_PATH, isUntouchedExample, Start } from './Start';
import { draftAtom, savedAtom, serialize } from './state';

/** The editor's start and save, as ResumeEditor wires them. */
function Harness() {
  const [draft, setDraft] = useAtom(draftAtom);
  if (draft === null) return <Start onStart={setDraft} />;
  return (
    <>
      <button
        onClick={() =>
          setDraft({ ...(draft as object), basics: { name: 'Ada' } })
        }
      >
        Edit
      </button>
      <SaveBar
        saving={false}
        saveLabel="Save"
        blocked={isUntouchedExample(draft)}
        onSave={() => undefined}
      />
    </>
  );
}

it('never saves the untouched example as someone’s resume', () => {
  render(
    <RegistryProvider initialValues={[[savedAtom, serialize(null)]]}>
      <Harness />
    </RegistryProvider>
  );
  fireEvent.click(
    screen.getByRole('button', { name: 'Start from an example' })
  );
  expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();

  fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
  expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
  expect(isUntouchedExample(null)).toBe(false);
  expect(isUntouchedExample({ basics: { name: '' } })).toBe(false);
});

it('offers to import a resume first, read on /start and saved back here', () => {
  render(<Start onStart={() => undefined} />);
  const link = screen.getByRole('link', { name: 'Import your resume' });
  expect(link).toHaveAttribute('href', IMPORT_PATH);
  expect(screen.getByRole('button', { name: 'Start blank' })).toBeEnabled();
});
