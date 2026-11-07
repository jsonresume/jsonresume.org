import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { ProgressSteps } from './progress-steps';

it('says in words which steps are done, under way and still to come', async () => {
  const { container } = render(
    <ProgressSteps
      label="Growing your tree"
      steps={[
        { id: 'a', label: 'Your resume', state: 'done' },
        {
          id: 'b',
          label: 'Today’s jobs',
          detail: 'Usually under 30 seconds',
          state: 'active',
        },
        { id: 'c', label: 'The tree', state: 'waiting' },
      ]}
    />
  );
  const list = screen.getByRole('list', { name: 'Growing your tree' });
  const items = list.querySelectorAll('li');
  expect(items).toHaveLength(3);
  expect(items[0]?.textContent).toContain('Done: Your resume');
  expect(items[1]?.textContent).toContain('Under way: Today’s jobs');
  expect(items[1]?.textContent).toContain('Usually under 30 seconds');
  expect(items[2]?.textContent).toContain('Still to come: The tree');
  expect(await axeViolations(container)).toEqual([]);
});
