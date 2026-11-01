import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { TreeLegend } from './tree-legend';

it('names each tone, with its mark hidden from screen readers', async () => {
  const { container } = render(
    <TreeLegend
      label="What the squares mean"
      items={[
        { tone: 'success', label: 'You show it' },
        { tone: 'attention', label: 'Asked for, not shown yet' },
        { tone: 'open', label: 'Open roles' },
      ]}
    />
  );
  const list = screen.getByRole('list', { name: 'What the squares mean' });
  expect(list.querySelectorAll('li')).toHaveLength(3);
  expect(screen.getByText('Asked for, not shown yet')).toBeTruthy();
  expect(list.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3);
  expect(await axeViolations(container)).toEqual([]);
});
