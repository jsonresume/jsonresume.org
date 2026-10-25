import { Context, Effect, Layer, Schema } from 'effect';
import { HttpClient, HttpClientResponse } from 'effect/http';
import type { NewPost } from './store';

const ALGOLIA = 'https://hn.algolia.com/api/v1/search_by_date';

export class HackerNewsUnavailable extends Schema.TaggedError<HackerNewsUnavailable>()(
  'HackerNewsUnavailable',
  { message: Schema.String }
) {}

const Stories = Schema.Struct({
  hits: Schema.Array(
    Schema.Struct({
      objectID: Schema.String,
      title: Schema.String,
      created_at_i: Schema.Number,
    })
  ),
});

const Comments = Schema.Struct({
  hits: Schema.Array(
    Schema.Struct({
      objectID: Schema.String,
      author: Schema.NullOr(Schema.String),
      comment_text: Schema.NullOr(Schema.String),
      created_at_i: Schema.Number,
    })
  ),
});

export interface Thread {
  id: number;
  title: string;
  postedAt: Date;
}

const isHiringThread = (title: string) =>
  /^Ask HN: Who is hiring\?/i.test(title);

/** "Who is hiring?" threads and their posts, from HN's Algolia search. */
export class HackerNews extends Context.Service<
  HackerNews,
  {
    /** The newest threads, newest first. */
    threads(count: number): Effect.Effect<Thread[], HackerNewsUnavailable>;
    /** A thread's top-level comments: one job post each. */
    posts(thread: Thread): Effect.Effect<NewPost[], HackerNewsUnavailable>;
  }
>()('@repo/jobs/HackerNews') {
  static readonly layer = Layer.effect(
    HackerNews,
    Effect.gen(function* () {
      const client = (yield* HttpClient.HttpClient).pipe(
        HttpClient.filterStatusOk,
        HttpClient.retryTransient({ times: 3 })
      );
      const get = <S extends Schema.Constraint>(
        schema: S,
        params: Record<string, string>
      ) =>
        client.get(`${ALGOLIA}?${new URLSearchParams(params)}`).pipe(
          Effect.flatMap(HttpClientResponse.schemaBodyJson(schema)),
          Effect.mapError(
            (e) => new HackerNewsUnavailable({ message: e.message })
          )
        );

      return HackerNews.of({
        threads: (count) =>
          get(Stories, {
            tags: 'story,author_whoishiring',
            // whoishiring posts three stories a month.
            hitsPerPage: String(Math.min(1000, Math.max(30, count * 4))),
          }).pipe(
            Effect.map(({ hits }) =>
              hits
                .filter((h) => isHiringThread(h.title))
                .slice(0, count)
                .map((h) => ({
                  id: Number(h.objectID),
                  title: h.title,
                  postedAt: new Date(h.created_at_i * 1000),
                }))
            )
          ),
        posts: (thread) =>
          get(Comments, {
            tags: `comment,story_${thread.id}`,
            numericFilters: `parent_id=${thread.id}`,
            hitsPerPage: '1000',
          }).pipe(
            Effect.map(({ hits }) =>
              hits.flatMap((h) =>
                h.comment_text && h.author
                  ? [
                      {
                        id: Number(h.objectID),
                        threadId: thread.id,
                        author: h.author,
                        html: h.comment_text,
                        postedAt: new Date(h.created_at_i * 1000),
                      },
                    ]
                  : []
              )
            )
          ),
      });
    })
  );
}
