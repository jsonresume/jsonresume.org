import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { checkAts } from '../ats';
import { AtsReportView } from './AtsReport';

const report = checkAts({
  basics: { name: 'Ada', label: 'Engineer' },
  work: [{ name: 'Engines', position: 'Analyst', startDate: 'May 1843' }],
});

describe('AtsReportView', () => {
  it('shows the score, the checks and the most important fix first', async () => {
    const { container } = render(<AtsReportView report={report} limit={3} />);
    expect(screen.getByRole('meter', { name: 'ATS score' })).toHaveAttribute(
      'aria-valuenow',
      String(report.score)
    );
    expect(screen.getByRole('list', { name: 'Checks' })).toBeInTheDocument();
    const fixes = screen
      .getAllByRole('listitem')
      .filter((li) => li.textContent?.startsWith('Must fix'));
    expect(fixes[0]).toHaveTextContent('basics.email');
    expect(screen.getByText(/^And \d+ more\.$/)).toBeInTheDocument();
    const { violations } = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(violations.map((v) => v.id)).toEqual([]);
  });
});
