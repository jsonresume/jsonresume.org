import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { JobDetail } from './JobDetail';

afterEach(cleanup);

const baseJob = {
  id: 1,
  title: 'Backend Engineer',
  company: 'Acme',
  description: 'Build APIs',
  url: 'https://example.com/job',
  gpt_content: JSON.stringify({
    title: 'Senior Backend Engineer',
    company: 'Acme Corp',
    skills: ['Go', { name: 'Postgres' }],
    bonusSkills: ['Kubernetes'],
    location: { city: 'Berlin', country: 'Germany' },
    remote: true,
    timezone: 'CET',
    minYearsExperience: 5,
    startWithinWeeks: 4,
    salary: { min: 100000, max: 150000, currency: 'EUR' },
    workRightsRequired: true,
  }),
};

describe('JobDetail', () => {
  it('renders gpt-enriched title/company and core sections', () => {
    render(<JobDetail job={baseJob} onBack={vi.fn()} />);
    expect(screen.getByText('Senior Backend Engineer')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Job Description')).toBeInTheDocument();
    expect(screen.getByText('Required Skills')).toBeInTheDocument();
    expect(screen.getByText('Bonus Skills')).toBeInTheDocument();
    expect(screen.getByText('Job Requirements')).toBeInTheDocument();
    expect(screen.getByText('Go')).toBeInTheDocument();
    expect(screen.getByText('Postgres')).toBeInTheDocument();
    expect(screen.getByText('Kubernetes')).toBeInTheDocument();
  });

  it('falls back to raw title/company without gpt_content', () => {
    render(
      <JobDetail job={{ ...baseJob, gpt_content: null }} onBack={vi.fn()} />
    );
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
    expect(screen.getByText('Acme')).toBeInTheDocument();
  });

  it('shows the animated loading match summary', () => {
    render(
      <JobDetail
        job={baseJob}
        onBack={vi.fn()}
        matchResult={{
          outcome: 'loading',
          bucket: 'Analyzing…',
          reasons: [['Skills', 'checking']],
        }}
      />
    );
    expect(screen.getByText('AI Match Analysis')).toBeInTheDocument();
    expect(screen.getByText('Analyzing…')).toBeInTheDocument();
  });

  it('shows a result match summary with score and expand toggle', () => {
    render(
      <JobDetail
        job={baseJob}
        onBack={vi.fn()}
        matchResult={{
          outcome: 'strongMatch',
          bucket: '✅ Strong Match',
          score: 87,
          reasons: [
            ['A', 'a'],
            ['B', 'b'],
            ['C', 'c'],
          ],
        }}
      />
    );
    expect(screen.getByText('✅ Strong Match')).toBeInTheDocument();
    expect(screen.getByText('(87% match)')).toBeInTheDocument();
    // 3 reasons → collapsed shows toggle to reveal all
    expect(screen.getByText('Show All 3 Criteria')).toBeInTheDocument();
  });

  it('alerts when deciding while logged out', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<JobDetail job={baseJob} onBack={vi.fn()} />);
    fireEvent.click(screen.getByText('Interested'));
    expect(alertSpy).toHaveBeenCalledWith(
      'Please log in to save job decisions'
    );
    alertSpy.mockRestore();
  });
});
