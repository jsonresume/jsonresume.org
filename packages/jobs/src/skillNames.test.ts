import { describe, expect, it } from 'vitest';
import { SKILL_ALIASES } from './skillAliases';
import { foldSkill, isKnownSkill, skillKey, skillName } from './skillNames';

const same = (...names: string[]) =>
  expect(new Set(names.map(skillKey)).size, names.join(', ')).toBe(1);
const apart = (a: string, b: string) =>
  expect(skillKey(a), `${a} vs ${b}`).not.toBe(skillKey(b));

describe('skill keys', () => {
  it('fold case, spacing and punctuation', () => {
    same('React', 'react', 'REACT', ' React ');
    same('Node.js', 'nodejs', 'NodeJS', 'Node JS', 'node.JS', 'Node');
    same('open-source', 'open source', 'Open Source', 'open_source');
    same('CI/CD', 'ci / cd', 'CI-CD', 'cicd', 'CI CD');
    same('React / TypeScript', 'react/typescript');
    same('Real‑time', 'real-time', 'real time');
    same('Python.', 'python');
  });

  it('resolve known short forms to one skill', () => {
    same('ML', 'Machine Learning', 'machine-learning', 'AI/ML');
    same('JS', 'JavaScript', 'javascript');
    same('TS', 'TypeScript');
    same('k8s', 'Kubernetes', 'Kubernetes (k8s)');
    same('Postgres', 'PostgreSQL', 'postgresql', 'pg');
    same('GCP', 'Google Cloud', 'Google Cloud Platform (GCP)');
    same('AWS', 'Amazon Web Services');
    same('NLP', 'Natural Language Processing');
    same('LLM', 'LLMs', 'Large Language Models');
    same('golang', 'Go', 'go');
    same('C#', 'csharp', 'C Sharp');
    same('C++', 'cpp');
    same('Rails', 'Ruby on Rails', 'RoR');
    same('Tailwind', 'TailwindCSS', 'Tailwind CSS');
  });

  it('keep apart skills that only look alike', () => {
    apart('C', 'C++');
    apart('C', 'C#');
    apart('C++', 'C#');
    apart('C', 'Objective-C');
    apart('C/C++', 'C++');
    apart('Java', 'JavaScript');
    apart('R', 'Rust');
    apart('R', 'Ruby');
    apart('Go', 'Google Cloud');
    apart('React', 'React Native');
    apart('Angular', 'AngularJS');
    apart('SQL', 'MySQL');
    apart('SQL', 'NoSQL');
    apart('.NET', 'NET');
    apart('ML', 'MLOps');
    apart('AWS', 'AWS Lambda');
    apart('Kubernetes', 'Kube operators');
    apart('AWS (S3)', 'AWS');
  });

  it('are keys of themselves', () => {
    for (const name of [
      'Node.js',
      'CI/CD',
      'Objective-C',
      'Next.js',
      'Machine Learning',
      'High-performance Computing',
      'RAG (Retrieval-Augmented Generation)',
      'Terraform / Pulumi / AWS CDK',
      'U.S. citizenship',
      'three.js',
    ])
      expect(skillKey(skillKey(name)), name).toBe(skillKey(name));
  });

  it('come from one list, each name claimed once', () => {
    const owner = new Map<string, string>();
    for (const [shown, names] of Object.entries(SKILL_ALIASES)) {
      const key = names[0] ?? '';
      expect(skillKey(shown), shown).toBe(key);
      expect(skillKey(key), key).toBe(key);
      expect(isKnownSkill(key)).toBe(true);
      for (const name of [shown, ...names]) {
        const was = owner.get(foldSkill(name));
        expect(was === undefined || was === key, `${name}: ${was}`).toBe(true);
        owner.set(foldSkill(name), key);
      }
    }
  });
});

describe('skill names', () => {
  it('show the known name, however it was written', () => {
    expect(skillName('ML')).toBe('Machine Learning');
    expect(skillName('machine learning')).toBe('Machine Learning');
    expect(skillName('react')).toBe('React');
    expect(skillName('nodejs')).toBe('Node.js');
    expect(skillName('k8s')).toBe('Kubernetes');
    expect(skillName('golang')).toBe('Go');
  });

  it('keep an unknown name as written, not lower-cased', () => {
    expect(skillName('  LangGraph ')).toBe('LangGraph');
    expect(skillName('Restate (durable  execution)')).toBe(
      'Restate (durable execution)'
    );
  });
});
