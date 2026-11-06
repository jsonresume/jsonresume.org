import { expect, it } from 'vitest';
import { listedSkills, sentenceNaming } from './listedSkills';

it('lists each skill once, however it is written', () => {
  const listed = listedSkills({
    skills: [
      { name: 'Frontend', keywords: ['React', 'react.js', 'ReactJS'] },
      { name: 'Data', keywords: ['ML', 'Machine Learning', 'Java'] },
      { name: 'Languages', keywords: ['JavaScript', 'JS'] },
    ],
  });
  expect(listed.map((s) => s.name)).toEqual([
    'React',
    'ML',
    'Java',
    'JavaScript',
  ]);
});

it('finds the sentence naming a skill, by any of its names', () => {
  const text = 'Joined in 2020. Trained machine learning models in PyTorch.';
  expect(sentenceNaming(text, 'ML')).toBe(
    'Trained machine learning models in PyTorch.'
  );
  expect(sentenceNaming(text, 'pytorch')).toBe(
    'Trained machine learning models in PyTorch.'
  );
});

it('does not find a skill inside another, or a word-like one in prose', () => {
  const prose =
    'Led the go-to-market plan. Wrote C++ and C# services. Ran R&D for JavaScript tools. We go fast.';
  expect(sentenceNaming(prose, 'C')).toBeUndefined();
  expect(sentenceNaming(prose, 'Java')).toBeUndefined();
  expect(sentenceNaming(prose, 'Go')).toBeUndefined();
  expect(sentenceNaming(prose, 'go')).toBeUndefined();
  expect(sentenceNaming(prose, 'R')).toBeUndefined();
  expect(sentenceNaming(prose, 'C++')).toBe('Wrote C++ and C# services.');
  expect(sentenceNaming('Built the API in Go.', 'golang')).toBe(
    'Built the API in Go.'
  );
  expect(sentenceNaming('Wrote a parser in C, then Rust.', 'C')).toBe(
    'Wrote a parser in C, then Rust.'
  );
});
