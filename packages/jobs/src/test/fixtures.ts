import { Effect, Layer } from 'effect';
import { embedderFrom } from '../embedder';
import { HackerNews, type Thread } from '../hackerNews';
import { JobParser, ParseFailed } from '../parser';
import type { Posting } from '../posting';
import type { NewPost } from '../store';
import { DIMENSIONS, normalize } from '../vectors';

/** Bag-of-words vectors: texts sharing words point the same way. */
export const wordVector = (text: string): Float32Array => {
  const v = new Float32Array(DIMENSIONS);
  for (const word of text.toLowerCase().match(/[a-z0-9.+#]+/g) ?? []) {
    let h = 0;
    for (const c of word) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    v[h % DIMENSIONS] += 1;
  }
  return normalize(v);
};

export const FakeEmbedder = embedderFrom(wordVector);

export const posting = (overrides: Partial<Posting> = {}): Posting => ({
  title: 'Software Engineer',
  company: 'Acme',
  summary: 'Acme builds rockets.',
  city: 'Berlin',
  region: null,
  countryCode: 'DE',
  remote: 'hybrid',
  remoteRegions: [],
  timezones: null,
  seniority: 'senior',
  employmentType: 'full_time',
  salary: null,
  salaryMin: null,
  salaryMax: null,
  visa: 'unspecified',
  equity: null,
  skills: [{ name: 'TypeScript', keywords: ['React'] }],
  responsibilities: [],
  qualifications: [],
  apply: null,
  ...overrides,
});

/**
 * A parser that reads "Title | Company | skill skill" from the post's
 * text, and fails on posts saying "unparseable".
 */
export const FakeParser = Layer.succeed(
  JobParser,
  JobParser.of({
    parse: (html) => {
      if (html.includes('unparseable')) {
        return Effect.fail(new ParseFailed({ message: 'model refused' }));
      }
      const [title = '', company = '', skills = ''] = html.split(' | ');
      return Effect.succeed(
        posting({
          title,
          company,
          skills: skills
            .split(' ')
            .filter(Boolean)
            .map((name) => ({ name, keywords: [] })),
        })
      );
    },
  })
);

/** An HN with the threads and posts given; replace them between runs. */
export const fakeHackerNews = (state: {
  threads: Thread[];
  posts: Record<number, NewPost[]>;
}) =>
  Layer.succeed(
    HackerNews,
    HackerNews.of({
      threads: (count) => Effect.succeed(state.threads.slice(0, count)),
      posts: (thread) => Effect.succeed(state.posts[thread.id] ?? []),
    })
  );

export const daysAgo = (days: number) =>
  new Date(Date.now() - days * 86_400_000);

export const post = (
  id: number,
  threadId: number,
  text: string,
  postedAt: Date
): NewPost => ({ id, threadId, author: `user${id}`, html: text, postedAt });
