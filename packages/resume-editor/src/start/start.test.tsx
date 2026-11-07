import { RegistryProvider, useAtomValue } from '@effect/atom-react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { clearStartDraft, readStartDraft, writeStartDraft } from './draft';
import { parseSkills, skillsText, tidy } from './guided';
import { Guided } from './Guided';
import { pathOf, pointerLabel } from './pointer';
import { foundSummary, Review } from './Review';
import {
  startImportAtom,
  startResumeAtom,
  startStepAtom,
  withTheme,
} from './state';

function Resume() {
  return (
    <output data-testid="resume">
      {JSON.stringify(useAtomValue(startResumeAtom))}
    </output>
  );
}
const resumeShown = (): unknown =>
  JSON.parse(screen.getByTestId('resume').textContent ?? 'null');

describe('start helpers', () => {
  afterEach(clearStartDraft);

  it('reads pointers as paths and as words', () => {
    expect(pathOf('/work/0/startDate')).toEqual(['work', 0, 'startDate']);
    expect(pathOf('/a~1b/c~0d')).toEqual(['a/b', 'c~d']);
    expect(pointerLabel('/work/0/startDate')).toBe('Work 1 › start date');
    expect(pointerLabel('/basics/location/city')).toBe('Location › city');
  });

  it('tidies empty answers away and keeps the rest', () => {
    expect(
      tidy({
        basics: { name: ' Ada ', email: '', location: { city: '' } },
        work: [{ name: 'Engines', highlights: ['Bernoulli', ''] }, {}],
        education: [{ institution: '' }],
      })
    ).toEqual({
      basics: { name: 'Ada' },
      work: [{ name: 'Engines', highlights: ['Bernoulli'] }],
    });
  });

  it('writes skills as lines and reads them back', () => {
    const skills = parseSkills('Frontend: React, CSS\nLeadership\n\n');
    expect(skills).toEqual([
      { name: 'Frontend', keywords: ['React', 'CSS'] },
      { name: 'Leadership' },
    ]);
    expect(skillsText(skills)).toBe('Frontend: React, CSS\nLeadership');
  });

  it('sets the theme in meta, keeping what meta had', () => {
    expect(withTheme({ meta: { version: 'v1' } }, 'pro')).toEqual({
      meta: { version: 'v1', theme: 'pro' },
    });
  });

  it('keeps a draft through sign-up, but not a day-old one', () => {
    writeStartDraft({ basics: { name: 'Ada' } });
    expect(readStartDraft()?.resume).toEqual({ basics: { name: 'Ada' } });
    expect(readStartDraft(Date.now() + 25 * 3600_000)).toBeUndefined();
  });
});

describe('Review', () => {
  it('puts guesses first, and edits them in place', () => {
    render(
      <RegistryProvider
        initialValues={[
          [startStepAtom, 'review'],
          [
            startResumeAtom,
            { basics: { name: 'Ada', label: 'Prog' }, work: [{ name: 'X' }] },
          ],
          [
            startImportAtom,
            {
              resume: {},
              confidence: {
                '/basics/name': 'high',
                '/basics/label': 'medium',
                '/work/0/name': 'low',
              },
              kind: 'pdf',
              warnings: ['Left out work › 0 › endDate'],
              fields: 3,
              cached: false,
              ms: 10,
            },
          ],
        ]}
      >
        <Review />
        <Resume />
      </RegistryProvider>
    );
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.map((i) => i.getAttribute('value'))).toEqual(['X', 'Prog']);
    expect(screen.getByText('Work 1 › name')).toBeInTheDocument();
    expect(screen.getByText('Left out work › 0 › endDate')).toBeVisible();
    fireEvent.change(screen.getByDisplayValue('X'), {
      target: { value: 'Analytical Engines' },
    });
    expect(resumeShown()).toMatchObject({
      work: [{ name: 'Analytical Engines' }],
    });
    expect(foundSummary(resumeShown())).toBe(
      'Ada · 1 job · 0 schools · 0 skill groups'
    );
  });
});

describe('Guided', () => {
  it('asks a section at a time and adds entries', () => {
    render(
      <RegistryProvider initialValues={[[startStepAtom, 'guided']]}>
        <Guided />
        <Resume />
      </RegistryProvider>
    );
    fireEvent.change(screen.getByLabelText('Full name'), {
      target: { value: 'Ada Lovelace' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.change(screen.getByLabelText('Company'), {
      target: { value: 'Engines' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add another' }));
    expect(screen.getAllByLabelText('Company')).toHaveLength(2);
    fireEvent.change(screen.getAllByLabelText('Company')[1] as HTMLElement, {
      target: { value: 'Looms' },
    });
    expect(resumeShown()).toEqual({
      basics: { name: 'Ada Lovelace' },
      work: [{ name: 'Engines' }, { name: 'Looms' }],
    });
  });
});
