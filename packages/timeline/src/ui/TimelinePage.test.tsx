// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import resume from '@jsonresume/sample-data/complete-resume.json';
import { cleanup, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { afterEach, describe, expect, it } from 'vitest';
import { toTimeline } from '../timeline';
import { TimelinePage } from './TimelinePage';

afterEach(cleanup);

describe('TimelinePage', () => {
  it('shows the career newest first, with stats and links, and passes axe', async () => {
    const today = '2026-10-25';
    const { container } = render(
      <TimelinePage
        username="jane"
        timeline={toTimeline(resume, 'jane', today)}
        today={today}
        links={{ page: '/@jane', pdf: '/@jane.pdf' }}
      />
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      resume.basics.name
    );
    expect(screen.getByRole('link', { name: 'Download PDF' })).toHaveAttribute(
      'href',
      '/@jane.pdf'
    );
    expect(screen.getByText('Years working')).toBeInTheDocument();
    const list = screen.getByRole('list', { name: /timeline/ });
    expect(list.querySelectorAll(':scope > li').length).toBeGreaterThan(3);
    expect(screen.getAllByText(/– present/).length).toBeGreaterThan(0);
    expect(
      (
        await axe.run(container, {
          rules: { 'color-contrast': { enabled: false } },
        })
      ).violations.map((v) => v.id)
    ).toEqual([]);
  });
});
