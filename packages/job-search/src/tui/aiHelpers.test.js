import { describe, it, expect } from 'vitest';
import {
  buildResumeText,
  buildJobText,
  buildSummaryResumeText,
  buildSummaryJobText,
  buildBatchJobsList,
  buildDossierPrompt,
  statusLineForTool,
  composeDossierText,
  extractEnrichment,
  dossierFilename,
} from './aiHelpers.js';

const resume = {
  basics: { name: 'Ada Lovelace', label: 'Engineer', summary: 'Builds things' },
  skills: [{ name: 'JS', keywords: ['react', 'node'] }, { name: 'Go' }],
  work: [
    { position: 'Eng', name: 'Acme', startDate: '2020', summary: 'Did work' },
  ],
  projects: [{ name: 'Proj', description: 'A project' }],
};

const job = {
  title: 'Senior Dev',
  company: 'BigCo',
  salary: '$200k',
  remote: 'Full',
  experience: 'Senior',
  type: 'Full-time',
  url: 'https://news.ycombinator.com/item?id=1',
  description: 'Build cool stuff',
  skills: [{ name: 'JS' }, 'Python'],
  qualifications: ['5y exp'],
  responsibilities: ['Ship code'],
};

describe('buildResumeText', () => {
  it('includes name, label, summary, skills, work and projects', () => {
    const out = buildResumeText(resume);
    expect(out).toContain('Ada Lovelace');
    expect(out).toContain('Engineer');
    expect(out).toContain('JS: react, node');
    expect(out).toContain('Eng at Acme (2020): Did work');
    expect(out).toContain('Project: Proj — A project');
  });

  it('skill without keywords renders empty keyword list', () => {
    expect(buildResumeText(resume)).toContain('Go: ');
  });

  it('handles undefined resume without throwing', () => {
    expect(buildResumeText(undefined)).toBe('');
    expect(buildResumeText(null)).toBe('');
  });

  it('caps work at 5 and projects at 3', () => {
    const big = {
      work: Array.from({ length: 8 }, (_, i) => ({
        position: `P${i}`,
        name: `C${i}`,
      })),
      projects: Array.from({ length: 6 }, (_, i) => ({ name: `Pj${i}` })),
    };
    const out = buildResumeText(big);
    expect(out).toContain('P4 at C4');
    expect(out).not.toContain('P5 at C5');
    expect(out).toContain('Project: Pj2');
    expect(out).not.toContain('Project: Pj3');
  });
});

describe('buildJobText', () => {
  it('includes all listed fields and skills with name-or-string fallback', () => {
    const out = buildJobText(job, '');
    expect(out).toContain('Title: Senior Dev');
    expect(out).toContain('Company: BigCo');
    expect(out).toContain('Salary: $200k');
    expect(out).toContain('Skills: JS, Python');
    expect(out).toContain('Qualification: 5y exp');
    expect(out).toContain('Responsibility: Ship code');
  });

  it('appends raw content when present', () => {
    const out = buildJobText(job, 'ORIGINAL POSTING BODY');
    expect(out).toContain('Full original posting:\nORIGINAL POSTING BODY');
  });

  it('omits raw content section when empty', () => {
    expect(buildJobText(job, '')).not.toContain('Full original posting');
  });

  it('uses fallbacks for missing salary/remote', () => {
    const out = buildJobText({ title: 't', company: 'c' }, '');
    expect(out).toContain('Salary: Not listed');
    expect(out).toContain('Remote: Not specified');
  });
});

describe('buildSummaryResumeText / buildSummaryJobText', () => {
  it('summary resume omits name but keeps label/summary/skills', () => {
    const out = buildSummaryResumeText(resume);
    expect(out).not.toContain('Ada Lovelace');
    expect(out).toContain('Engineer');
    expect(out).toContain('JS: react, node');
  });

  it('summary job uses skill.name only (no string fallback)', () => {
    const out = buildSummaryJobText(job);
    // 'Python' is a bare string → s.name is undefined
    expect(out).toContain('Skills: JS, ');
    expect(out).toContain('Title: Senior Dev');
  });
});

describe('buildBatchJobsList', () => {
  it('numbers jobs and caps at 15', () => {
    const jobs = Array.from({ length: 20 }, (_, i) => ({
      similarity: '0.9',
      title: `T${i}`,
      company: `C${i}`,
    }));
    const out = buildBatchJobsList(jobs);
    expect(out).toContain('1. [0.9] T0 at C0 | no salary | no remote info');
    expect(out).toContain('15. [0.9] T14 at C14');
    expect(out).not.toContain('16. [0.9] T15');
  });
});

describe('buildDossierPrompt', () => {
  it('embeds resume and job text and the enrichment block', () => {
    const out = buildDossierPrompt('RESUME_HERE', 'JOB_HERE');
    expect(out).toContain('## Candidate Resume\nRESUME_HERE');
    expect(out).toContain('## Job Posting\nJOB_HERE');
    expect(out).toContain('```enrichment');
    expect(out).toContain('AI-Forward / AI-Friendly');
  });
});

describe('statusLineForTool', () => {
  it('formats WebSearch with query', () => {
    expect(
      statusLineForTool({ name: 'WebSearch', input: { query: 'foo' } })
    ).toBe('🔍 WebSearch: foo');
  });
  it('formats WebFetch with url', () => {
    expect(
      statusLineForTool({ name: 'WebFetch', input: { url: 'http://x' } })
    ).toBe('🔍 WebFetch: http://x');
  });
  it('formats other tools generically', () => {
    expect(statusLineForTool({ name: 'Bash' })).toBe('⚙ Using Bash…');
    expect(statusLineForTool({})).toBe('⚙ Using tool…');
  });
});

describe('composeDossierText', () => {
  it('joins status and result when both present', () => {
    expect(composeDossierText('STATUS', 'RESULT')).toBe('STATUS\n\nRESULT');
  });
  it('returns result alone when no status', () => {
    expect(composeDossierText('', 'RESULT')).toBe('RESULT');
  });
  it('returns status alone when no result', () => {
    expect(composeDossierText('STATUS', '')).toBe('STATUS');
  });
  it('returns empty string when neither present', () => {
    expect(composeDossierText('', '')).toBe('');
  });
});

describe('extractEnrichment', () => {
  it('parses a valid enrichment block', () => {
    const text = 'prose\n```enrichment\n{"salary":"$1"}\n```\nmore';
    expect(extractEnrichment(text)).toEqual({ salary: '$1' });
  });
  it('returns null when no block present', () => {
    expect(extractEnrichment('no block here')).toBeNull();
  });
  it('returns null on invalid JSON', () => {
    expect(extractEnrichment('```enrichment\nnot json\n```')).toBeNull();
  });
});

describe('dossierFilename', () => {
  it('slugifies the company name', () => {
    expect(dossierFilename({ company: 'Big Co, Inc.' })).toBe(
      'dossier-big-co-inc.md'
    );
  });
  it('falls back to unknown', () => {
    expect(dossierFilename(null)).toBe('dossier-unknown.md');
    expect(dossierFilename({})).toBe('dossier-unknown.md');
  });
  it('truncates to 50 chars of slug', () => {
    const long = 'a'.repeat(80);
    const out = dossierFilename({ company: long });
    expect(out).toBe(`dossier-${'a'.repeat(50)}.md`);
  });
});
