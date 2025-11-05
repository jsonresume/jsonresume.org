-- Add retry tracking columns to jobs table
-- This migration adds retry_count and error_message columns to track job processing failures

ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Add comment to explain the columns
COMMENT ON COLUMN jobs.retry_count IS 'Number of times this job has been retried (max 1 retry allowed)';
COMMENT ON COLUMN jobs.error_message IS 'Error message from the last failed processing attempt';

-- Create index for faster queries on failed jobs
CREATE INDEX IF NOT EXISTS idx_jobs_retry_count ON jobs(retry_count) WHERE gpt_content = 'FAILED';
