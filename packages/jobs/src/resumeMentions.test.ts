import { describe, expect, it } from 'vitest';
import { resumeMentions } from './resumeMentions';

const resume = {
  basics: {
    label: 'Principal Engineer, AI',
    summary: 'I build developer tools.',
  },
  skills: [{ name: 'Frontend', keywords: ['React', 'PyTorch'] }],
  work: [
    {
      name: 'Acme',
      position: 'Senior Security Engineer',
      highlights: [
        'Built an LLM-as-judge quality gate for every response.',
        'Wrote a purpose agent execution harness for persistent sessions.',
        'Analytics ports oracle-verified for parity; can run on Claude agents.',
        'Shipped machine learning features with RAG over Postgres.',
      ],
    },
  ],
  education: [{ studyType: 'BSc', area: 'Computer Science' }],
  languages: [{ language: 'English', fluency: 'Native speaker' }],
};
const mentions = resumeMentions(resume);

describe('resumeMentions', () => {
  it('finds a skill the resume names, plurals aside', () => {
    expect(mentions('LLMs')).toBe(true);
    expect(mentions('Agent harnesses')).toBe(true);
    expect(mentions('developer tool')).toBe(true);
    expect(mentions('Machine Learning')).toBe(true);
    expect(mentions('PyTorch')).toBe(true);
    expect(mentions('claude')).toBe(true);
    expect(mentions('RAG')).toBe(true);
    expect(mentions('English')).toBe(true);
  });

  it('finds one of the skills a combined name lists', () => {
    expect(mentions('Postgres/MySQL')).toBe(true);
    expect(mentions('Vue or React')).toBe(true);
  });

  it('skips filler words in the name', () => {
    expect(mentions('experience with RAG')).toBe(true);
  });

  it('needs capitals written as capitals for one-word names', () => {
    expect(mentions('Oracle')).toBe(false);
    expect(mentions('CAN')).toBe(false);
  });

  it('reads a capital that only starts a sentence as no name', () => {
    expect(mentions('Shipped')).toBe(false);
    expect(mentions('Analytics')).toBe(false);
  });

  it('takes a plain lower-case word only as a known skill or a name', () => {
    expect(mentions('response')).toBe(false);
    expect(mentions('sessions')).toBe(false);
    expect(mentions('security')).toBe(false);
    expect(mentions('react')).toBe(true);
  });

  it('reads a list in a sentence by its skills, not its plain words', () => {
    expect(mentions('fluent in two of mech/EE/firmware/response')).toBe(false);
    expect(mentions('read code in Go, Postgres or Bash')).toBe(true);
  });

  it('never matches what the resume doesn’t say', () => {
    expect(mentions('Kubernetes')).toBe(false);
    expect(mentions('Machine Vision')).toBe(false);
    expect(mentions('quality assurance')).toBe(false);
  });

  it('ignores very short names and sentences', () => {
    expect(mentions('AI')).toBe(false);
    expect(mentions('shipped LLM features to real users at scale')).toBe(false);
  });

  it('allows one word between, not more', () => {
    expect(mentions('agent harness')).toBe(true);
    expect(mentions('agent sessions')).toBe(false);
  });

  it('reads nothing from an empty resume', () => {
    expect(resumeMentions(null)('React')).toBe(false);
  });
});
