import { RegistryProvider } from '@effect/atom-react';
import schemaJson from '@jsonresume/schema/schema.json';
import { decodeJsonSchema } from '@repo/schema-explorer';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CheckPane } from '../CheckPane';
import { formSections } from '../model';
import { draftAtom } from '../state';
import { FormProvider } from './FormProvider';
import { fieldTarget } from './goTo';
import { ResumeForm } from './ResumeForm';

const sections = formSections(decodeJsonSchema(schemaJson));

describe('going from an ATS issue to its field', () => {
  it('maps issue fields to sections and form paths', () => {
    expect(fieldTarget('basics.summary')).toEqual({
      section: 'basics',
      path: 'basics.summary',
    });
    expect(fieldTarget('work[].highlights')).toEqual({
      section: 'work',
      path: 'work.0.highlights',
    });
    expect(fieldTarget('skills')).toEqual({
      section: 'skills',
      path: 'skills',
    });
  });

  it('opens the section and focuses the field', async () => {
    const issues = new Map<string, string>();
    render(
      <RegistryProvider
        initialValues={[
          [
            draftAtom,
            {
              basics: { name: 'Ada', email: 'ada@example.com', label: 'Dev' },
              work: [{ name: 'Engines', position: 'Programmer' }],
            },
          ],
        ]}
      >
        <FormProvider issues={issues}>
          <ResumeForm sections={sections} issues={issues} />
        </FormProvider>
        <CheckPane />
      </RegistryProvider>
    );
    // The issue in the to-fix list (the checklist names it too).
    const summary = screen
      .getAllByText('No summary')
      .map((e) => e.closest('li'))
      .find((li) => li?.querySelector('button'));
    const goTo = summary?.querySelector('button');
    expect(goTo).toHaveTextContent('Go to it');
    await act(async () => {
      if (goTo) fireEvent.click(goTo);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    });
    expect(document.activeElement?.tagName).toBe('TEXTAREA');
    expect(
      document.activeElement?.closest('[data-path]')?.getAttribute('data-path')
    ).toBe('basics.summary');
  });
});
