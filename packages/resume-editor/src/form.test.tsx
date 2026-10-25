import { RegistryProvider, useAtomValue } from '@effect/atom-react';
import schemaJson from '@jsonresume/schema/schema.json';
import { decodeJsonSchema } from '@repo/schema-explorer';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormProvider } from './form/FormProvider';
import { ResumeForm } from './form/ResumeForm';
import { formSections } from './model';
import { draftAtom } from './state';

const schema = decodeJsonSchema(schemaJson);
const sections = formSections(schema);

function Draft() {
  return (
    <output data-testid="draft">
      {JSON.stringify(useAtomValue(draftAtom))}
    </output>
  );
}

const renderForm = (draft: unknown, issues = new Map<string, string>()) =>
  render(
    <RegistryProvider initialValues={[[draftAtom, draft]]}>
      <FormProvider issues={issues}>
        <ResumeForm sections={sections} issues={issues} />
      </FormProvider>
      <Draft />
    </RegistryProvider>
  );

describe('ResumeForm', () => {
  it('shows every section, with entry counts, Basics open', () => {
    renderForm({
      basics: { name: 'Ada' },
      work: [{ name: 'Engines' }, { name: 'Looms' }],
    });
    for (const label of [
      'Basics',
      'Work',
      'Education',
      'Skills',
      'Projects',
      'References',
    ]) {
      expect(
        screen.getByRole('button', { name: new RegExp(`^${label}`) })
      ).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: /^Work/ })).toHaveTextContent(
      '2'
    );
    expect(screen.getByLabelText('Name')).toHaveValue('Ada');
  });

  it('writes edits into the draft, dropping cleared fields', () => {
    renderForm({ basics: { name: 'Ada', label: 'Analyst' } });
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Ada Lovelace' },
    });
    fireEvent.change(screen.getByLabelText('Label'), { target: { value: '' } });
    expect(JSON.parse(screen.getByTestId('draft').textContent ?? '')).toEqual({
      basics: { name: 'Ada Lovelace' },
    });
  });

  it('puts a problem under its field and on its section', () => {
    renderForm(
      { basics: { email: 'nope' } },
      new Map([['basics.email', 'Should be an email address.']])
    );
    expect(screen.getByText('Should be an email address.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Basics/ })).toHaveTextContent(
      '1 to fix'
    );
  });
});
