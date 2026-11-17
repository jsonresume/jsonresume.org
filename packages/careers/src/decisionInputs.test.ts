import { describe, expect, it } from 'vitest';
import { asShown, needsOf } from './decisionInputs';
import type { Requirement, Skill } from './services';
import { posting } from './test/fixtures';

const skill = (id: number, key: string, name: string): Skill => ({
  id,
  key,
  name,
});
const required = (s: Skill): Requirement => ({
  skill: s,
  need: 'required',
  years: null,
});

describe('requirements as the resume meets them', () => {
  const ts = skill(1, 'typescript', 'TypeScript');
  const combined = skill(9, 'react/typescript', 'React/TypeScript');
  const go = skill(3, 'go', 'Go');

  it('turns a combined requirement into the skill the resume shows', () => {
    const met = asShown(
      [required(combined), required(go)],
      new Set([1]),
      new Map([['typescript', ts]])
    );
    expect(met.map((r) => r.skill.name)).toEqual(['TypeScript', 'Go']);
  });

  it('leaves shown skills and unmet requirements as they are', () => {
    const met = asShown(
      [required(ts), required(combined)],
      new Set([1]),
      new Map()
    );
    expect(met.map((r) => r.skill.id)).toEqual([1, 9]);
    const twice = asShown(
      [required(ts), required(combined)],
      new Set([1]),
      new Map([['typescript', ts]])
    );
    expect(twice.map((r) => r.skill.id)).toEqual([1]);
  });
});

describe('what a job asks for', () => {
  it('leaves out kinds of work and qualifications', () => {
    const needs = needsOf(
      null,
      posting({
        skills: [
          { name: 'TypeScript', keywords: [] },
          { name: 'Frontend', keywords: [] },
          { name: 'AI', keywords: [] },
          { name: '5+ years experience', keywords: [] },
        ],
      })
    );
    expect(needs?.map((n) => n.name)).toEqual(['TypeScript']);
    expect(
      needsOf(null, posting({ skills: [{ name: 'Backend', keywords: [] }] }))
    ).toBeNull();
  });
});
