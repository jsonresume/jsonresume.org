import { Predicate } from 'effect';
import { resumeLines } from './resumeText';
import { choiceNames, isKnownSkill, skillKey } from './skillNames';

/** Words a requirement can carry that say nothing about the skill. */
const FILLER = new Set([
  'a',
  'an',
  'and',
  'or',
  'of',
  'the',
  'with',
  'in',
  'for',
  'to',
  'on',
  'experience',
  'knowledge',
  'familiarity',
  'proficiency',
  'strong',
  'skills',
]);

/** Most words a name can have and still be a skill rather than a sentence. */
const MOST_WORDS = 3;

/** Words as written: letters, digits and the marks in skill names ("C++", "C#", "Node.js"). */
const tokens = (text: string) =>
  text
    .split(/[^A-Za-z0-9+#.]+/)
    .map((t) => t.replace(/\.+$/, ''))
    .filter((t) => t.length > 0);

/** The forms a word may be compared as: itself, and without a plural ending. */
const forms = (word: string) => {
  const w = word.toLowerCase();
  return [
    w,
    ...(w.length > 3 && w.endsWith('s') ? [w.slice(0, -1)] : []),
    ...(w.length > 4 && w.endsWith('es') ? [w.slice(0, -2)] : []),
  ];
};

/** The languages a resume lists ("English"), one to a line. */
const languages = (resume: unknown): string[] => {
  const list = Predicate.isObject(resume)
    ? (resume as Record<string, unknown>)['languages']
    : undefined;
  return (Array.isArray(list) ? list : []).flatMap((l: unknown) => {
    const name = Predicate.isObject(l)
      ? (l as Record<string, unknown>)['language']
      : undefined;
    return Predicate.isString(name) ? [name] : [];
  });
};

const capitals = (word: string) => word.replace(/[^A-Z]/g, '').length;

/**
 * Whether one word of the resume is a one-word name: "AWS" and "PyTorch"
 * as written, with their capitals; "Python" capitalised but not just for
 * starting a sentence (so "Support ..." isn't support); a lower-case name
 * when it is a known skill ("kubernetes"), or the resume writes it
 * as a name ("claude" in "agents on Claude", "runs Claude Agent SDK"),
 * not inside a title ("Senior Software Engineer") or as a plain word
 * ("network").
 */
const sameWord = (name: string, words: ReadonlyArray<string>, i: number) => {
  const word = words[i] ?? '';
  const caps = capitals(name);
  if (caps >= 2) return capitals(word) >= 2;
  const named = capitals(word) >= 1 && (i > 0 || words.length <= 3);
  if (caps === 1) return named;
  // Inside a title, capitals stand on both sides; a product name ("Claude
  // Agent SDK") has its own word before it.
  const titled = [words[i - 1], words[i + 1]].every(
    (w) => w !== undefined && /^[A-Z]/.test(w)
  );
  return (named && !titled) || isKnownSkill(skillKey(name));
};

/**
 * Whether a resume names a skill in its own text: every word of the name
 * (plurals aside, at most one word between), so "LLMs" is in "LLM-as-judge"
 * and "Agent harnesses" in "agent execution harness"; a one-word name as
 * sameWord reads it. Names of one or two letters, or of more than three
 * words, never match. A name that lists several ("React/TypeScript") is
 * named when any of them is.
 */
export const resumeMentions = (resume: unknown) => {
  const sentences = [
    // Employers' names say nothing of skills: "Electronic Frontier
    // Foundation" isn't electronics.
    ...resumeLines(resume, { employers: false }),
    ...languages(resume),
  ]
    .flatMap((line) => line.split(/(?<=[.!?])\s+/))
    .map(tokens);
  const at = new Map<string, Array<{ line: number; i: number }>>();
  sentences.forEach((words, line) =>
    words.forEach((word, i) => {
      for (const f of forms(word)) {
        const seen = at.get(f) ?? [];
        seen.push({ line, i });
        at.set(f, seen);
      }
    })
  );
  const alike = (a: string, b: string) =>
    forms(a).some((f) => forms(b).includes(f));

  const names = (name: string) => {
    const want = tokens(name).filter((w) => !FILLER.has(w.toLowerCase()));
    const [first, ...rest] = want;
    if (!first || want.length > MOST_WORDS) return false;
    if (want.length === 1 && first.length <= 2) return false;
    const found = new Set(forms(first).flatMap((f) => at.get(f) ?? []));
    return [...found].some(({ line, i }) => {
      const words = sentences[line] ?? [];
      if (rest.length === 0) return sameWord(first, words, i);
      let last = i;
      for (const next of rest) {
        const j = words.findIndex(
          (w, k) => k > last && k <= last + 2 && alike(w, next)
        );
        if (j < 0) return false;
        last = j;
      }
      return true;
    });
  };
  return (name: string) => names(name) || choiceNames(name).some(names);
};
