import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { TreeMapSkeleton } from './tree-map-skeleton';

it('holds the tree’s shape, busy, with its caption in a live region', async () => {
  const { container } = render(
    <TreeMapSkeleton label="Your career graph" rows={[2, 5, 3]}>
      Reading your resume
    </TreeMapSkeleton>
  );
  const region = screen.getByRole('group', { name: 'Your career graph' });
  expect(region.getAttribute('aria-busy')).toBe('true');
  // Bands top first: 3, 5, 2 squares, all hidden from screen readers.
  const bands = region.querySelectorAll('[aria-hidden="true"] > div');
  expect([...bands].map((b) => b.querySelectorAll('span span').length)).toEqual(
    [3, 5, 2]
  );
  expect(screen.getByRole('status').textContent).toBe('Reading your resume');
  expect(await axeViolations(container)).toEqual([]);
});

it('draws no caption when given none', () => {
  render(<TreeMapSkeleton label="Loading" />);
  expect(screen.queryByRole('status')).toBeNull();
});
