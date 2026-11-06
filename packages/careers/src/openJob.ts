import { OPEN_DAYS } from '@repo/jobs';

/** Open on the board, as @repo/jobs's openJobs says it (the jobs table as j). */
export const openJob = `
  j.parsed IS NOT NULL AND j.removed_at IS NULL
  AND j.posted_at >= now() - make_interval(days => ${OPEN_DAYS})
  AND NOT EXISTS (
    SELECT 1 FROM app.jobs n
    WHERE n.family_id = j.family_id AND n.posted_at > j.posted_at AND n.removed_at IS NULL
  )`;
