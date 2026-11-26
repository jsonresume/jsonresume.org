import { RegistryProvider } from '@effect/atom-react';
import type { Job, JobSummary } from '@repo/api';
import { act, fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { filterJobs, noFilters } from './filters';
import { postedText, remoteText, salaryText } from './format';
import { CompanyPage } from './CompanyPage';
import { JobBoardPage } from './JobBoardPage';
import { JobPage } from './JobPage';
import { applyHref } from './Linkified';

const job = (overrides: Partial<JobSummary> = {}): JobSummary => ({
  id: 1,
  title: 'Backend Engineer',
  company: 'Acme',
  location: 'Berlin, DE',
  remote: 'hybrid',
  remoteRegions: [],
  seniority: 'senior',
  employmentType: 'full_time',
  salary: null,
  salaryMin: null,
  salaryMax: null,
  skills: ['Go', 'PostgreSQL'],
  postedAt: '2026-10-01T15:00:00Z',
  months: 1,
  ...overrides,
});

const jobs = [
  job(),
  job({
    id: 2,
    title: 'Rust Engineer',
    company: 'Ferrous',
    remote: 'remote_global',
    skills: ['Rust'],
    salaryMin: 150_000,
    salaryMax: 200_000,
  }),
  job({
    id: 3,
    title: 'Designer',
    company: 'Paperco',
    remote: 'remote_region',
    remoteRegions: ['US'],
    seniority: 'junior',
    skills: ['Figma'],
  }),
];

const violations = async (container: Element) =>
  (
    await axe.run(container, {
      rules: {
        'color-contrast': { enabled: false },
        region: { enabled: false },
      },
    })
  ).violations.map((v) => v.id);

describe('filterJobs', () => {
  it('narrows by words, where, level and pay', () => {
    const ids = (f: Partial<typeof noFilters>) =>
      filterJobs(jobs, { ...noFilters, ...f }).map((j) => j.id);
    expect(ids({ query: 'rust' })).toEqual([2]);
    expect(ids({ query: 'acme go' })).toEqual([1]);
    expect(ids({ where: 'remote' })).toEqual([2, 3]);
    expect(ids({ where: 'anywhere' })).toEqual([2]);
    expect(ids({ where: 'onsite' })).toEqual([1]);
    expect(ids({ seniority: 'junior' })).toEqual([3]);
    expect(ids({ minSalary: 180_000 })).toEqual([2]);
    expect(ids({ query: 'us' })).toEqual([3]);
  });

  it('lists whole-word matches before half-typed ones, still finding both', () => {
    const board = [
      job({ id: 10, title: 'Frontend Engineer', skills: ['JavaScript'] }),
      job({ id: 11, title: 'Platform Engineer', skills: ['Java', 'Kafka'] }),
    ];
    const ids = (query: string) =>
      filterJobs(board, { ...noFilters, query }).map((j) => j.id);
    expect(ids('java')).toEqual([11, 10]);
    expect(ids('jav')).toEqual([10, 11]);
  });
});

describe('format', () => {
  it('words pay, place and age', () => {
    expect(salaryText(jobs[1] as JobSummary)).toBe('$150k–$200k');
    expect(salaryText(job({ salary: 'Competitive' }))).toBe('Competitive');
    expect(remoteText(jobs[2] as JobSummary)).toBe('Remote (US)');
    const now = Date.parse('2026-10-04T12:00:00Z');
    expect(postedText('2026-10-04T08:00:00Z', now)).toBe('Today');
    expect(postedText('2026-10-01T08:00:00Z', now)).toBe('3 days ago');
    expect(postedText('2026-09-01T08:00:00Z', now)).toBe('Sep 1');
  });

  it('finds where to apply', () => {
    expect(applyHref('Email jobs@acme.com with a CV')).toBe(
      'mailto:jobs@acme.com'
    );
    expect(applyHref('https://acme.com/jobs.')).toBe('https://acme.com/jobs');
    expect(applyHref('Reply here')).toBe(null);
  });
});

describe('JobBoardPage', () => {
  it('lists jobs, filters them and passes axe', async () => {
    const { container } = render(
      <RegistryProvider>
        <JobBoardPage
          board={{
            jobs,
            thread: { id: 9, title: 'Ask HN: Who is hiring? (October 2026)' },
          }}
          links={{ job: (id) => `/jobs/${id}`, matches: '/dashboard/jobs' }}
        />
      </RegistryProvider>
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '3 open roles'
    );
    expect(screen.getByRole('link', { name: 'Rust Engineer' })).toHaveAttribute(
      'href',
      '/jobs/2'
    );
    await act(async () => {
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'figma' },
      });
    });
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    ).toEqual(['Designer']);
    expect(await violations(container)).toEqual([]);
  });
});

describe('JobPage', () => {
  it('shows the role and the original post, and passes axe', async () => {
    const full: Job = {
      ...job(),
      summary: 'Acme builds rockets.',
      timezones: null,
      visa: 'yes',
      equity: null,
      skillDetails: [{ name: 'Go', keywords: ['gRPC'] }],
      responsibilities: ['Build APIs'],
      qualifications: ['5 years of Go'],
      apply: 'jobs@acme.com',
      post: ['Acme | Berlin | Hybrid', 'Apply: https://acme.com/jobs'],
      author: 'acme',
      closed: true,
      companySlug: 'acme',
    };
    const { container } = render(
      <JobPage
        job={full}
        boardHref="/jobs"
        ask={(q) => `/ask?q=${encodeURIComponent(q)}`}
      />
    );
    expect(
      screen.getByRole('link', { name: 'Write a cover letter' })
    ).toHaveAttribute(
      'href',
      expect.stringContaining(encodeURIComponent(`(job ${full.id})`))
    );
    expect(screen.getByRole('link', { name: 'Apply' })).toHaveAttribute(
      'href',
      'mailto:jobs@acme.com'
    );
    expect(
      screen.getByRole('link', { name: 'https://acme.com/jobs' })
    ).toBeInTheDocument();
    expect(screen.getByText('No longer on the board')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: `Other jobs at ${full.company}` })
    ).toHaveAttribute('href', '/jobs/companies/acme');
    expect(
      screen.getByRole('link', { name: 'This job (job.json)' })
    ).toHaveAttribute('href', `/api/jobs/${full.id}/document`);
    expect(
      screen.getByRole('link', { name: 'The company (company.json)' })
    ).toHaveAttribute('href', '/api/companies/acme/document');
    expect(await violations(container)).toEqual([]);
  });
});

describe('CompanyPage', () => {
  it('shows what the posts state and the open jobs, and passes axe', async () => {
    const { container } = render(
      <CompanyPage
        profile={{
          slug: 'acme',
          company: {
            $schema: 'https://example.com/company-schema.json',
            name: 'Acme',
            url: 'https://www.acme.com',
            remote: 'Full',
            locations: [{ city: 'Berlin', countryCode: 'DE' }],
            technologies: ['Go'],
            meta: {
              canonical: 'https://jsonresume.org/api/companies/acme/document',
              lastModified: '2026-11-03T10:00:00.000Z',
            },
          },
          jobs: [job()],
        }}
        boardHref="/jobs"
        jobHref={(id) => `/jobs/${id}`}
      />
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Acme');
    expect(screen.getByText(/1 open job from/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'acme.com' })).toHaveAttribute(
      'href',
      'https://www.acme.com'
    );
    expect(screen.getByText('Remote')).toBeInTheDocument();
    expect(screen.getByText('Where').nextElementSibling).toHaveTextContent(
      'Berlin, DE'
    );
    expect(
      screen.getByRole('list', { name: 'Jobs at Acme' })
    ).toBeInTheDocument();
    expect(await violations(container)).toEqual([]);
  });
});
