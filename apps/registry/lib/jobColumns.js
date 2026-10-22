/**
 * Columns of the `jobs` table that list/detail views need. Excludes the
 * embedding vectors (~40KB per row), which made job responses exceed
 * Vercel's 4.5MB response limit.
 */
export const JOB_COLUMNS =
  'id, uuid, created_at, posted_at, url, type, content, gpt_content, salary_usd, salary_min, salary_max, salary_currency';
