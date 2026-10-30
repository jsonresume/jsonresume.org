import { expect, it } from 'vitest';
import { isSkillKey, skillKey } from './skillNames';

const isSkill = (name: string) => isSkillKey(skillKey(name));

it('keeps skills, however compound', () => {
  for (const name of [
    'PostgreSQL',
    'C#',
    'LLM evaluation',
    'Terraform / Pulumi / AWS CDK',
    'LLVM IR and pass development',
    'AWS Certified Solutions Architect - Professional',
  ])
    expect(isSkill(name), name).toBe(true);
});

it('drops kinds of work, qualifications and notes models file as skills', () => {
  for (const name of [
    'Backend',
    '(no specific techs listed)',
    '5+ years experience',
    'Work location: NYC or SF, hybrid (2x/week)',
    '(see linked open positions)',
    'U.S. citizenship',
    'Relevant master’s degree',
    'shipped real native iOS apps',
  ])
    expect(isSkill(name), name).toBe(false);
});
