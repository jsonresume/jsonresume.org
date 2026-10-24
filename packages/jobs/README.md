# @repo/jobs

Jobs from Hacker News "Who is hiring?" threads, server side.

- **Pipeline** (`runPipeline`): imports the two newest threads' posts from
  HN's Algolia search, parses new ones into a `Posting` with OpenAI
  (`JobParser`), embeds each posting's fields (`Embedder`,
  text-embedding-3-large), and groups a company's monthly reposts into
  families. Every run is recorded in `app.job_runs`. On the box it runs from
  `apps/app/server/jobs.ts` every two hours (`deploy/systemd/jsonresume-jobs.*`).
- **Board** (`JobBoard`): the open jobs (the last 62 days, newest of each
  family), one job, and the pipeline's status.
- **Matching** (`JobMatcher`): open jobs ranked by cosine against an
  embedding of the resume, nudged toward jobs the user marked interested or
  applied and away from those marked not for me; and the marks themselves.

Vectors are float32s in a `bytea` and compared in memory: a few thousand
jobs is a few milliseconds, and PGlite (tests, `pnpm dev`) has no pgvector.

`OpenAiJobs` provides the parser and embedder from `OPENAI_API_KEY`; without
the key they fail each call, so the rest of the app still runs.

Tests run the whole pipeline on PGlite with HN, the model and embeddings
faked (`src/test/fixtures.ts`).
