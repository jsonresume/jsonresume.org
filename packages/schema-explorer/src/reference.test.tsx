import schemaJson from '@jsonresume/schema/schema.json';
import sample from '@jsonresume/schema/sample.resume.json';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { decodeJsonSchema, SchemaReference, schemaSections } from './index';

const sections = schemaSections(decodeJsonSchema(schemaJson));

describe('SchemaReference', () => {
  it('renders an anchored section per property with fields and an example', () => {
    render(
      <SchemaReference
        sections={sections}
        example={sample}
        exampleName="resume.json"
      />
    );
    const work = document.getElementById('work');
    expect(work).not.toBeNull();
    const scope = within(work as HTMLElement);
    expect(
      scope.getByRole('heading', { level: 2, name: 'work' })
    ).toBeInTheDocument();
    expect(
      scope.getByRole('table', { name: 'Fields of work' })
    ).toBeInTheDocument();
    expect(scope.getByText('startDate')).toBeInTheDocument();
    expect(scope.getByText('work in resume.json')).toBeInTheDocument();
    // objective is plain text: it is a row of the top-level table, with its own id.
    expect(
      screen.getByRole('table', { name: 'Top-level fields' })
    ).toBeInTheDocument();
    expect(document.getElementById('objective')?.tagName).toBe('TR');
    const nav = screen.getByRole('navigation', { name: 'Sections' });
    const structured = sections.filter((section) => section.fields.length > 0);
    expect(within(nav).getAllByRole('link')).toHaveLength(
      structured.length + 1
    );
  });
});
