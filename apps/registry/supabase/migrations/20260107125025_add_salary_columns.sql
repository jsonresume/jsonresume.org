-- Add normalized salary columns to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_usd INTEGER;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_min INTEGER;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_max INTEGER;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_currency VARCHAR(3);

-- Add indexes for salary filtering and sorting
CREATE INDEX IF NOT EXISTS idx_jobs_salary_usd ON jobs(salary_usd) WHERE salary_usd IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_salary_range ON jobs(salary_min, salary_max) WHERE salary_min IS NOT NULL;

-- Add comment explaining the columns
COMMENT ON COLUMN jobs.salary_usd IS 'Normalized average annual salary in USD, rounded to nearest 1000';
COMMENT ON COLUMN jobs.salary_min IS 'Normalized minimum annual salary in USD, rounded to nearest 1000';
COMMENT ON COLUMN jobs.salary_max IS 'Normalized maximum annual salary in USD, rounded to nearest 1000';
COMMENT ON COLUMN jobs.salary_currency IS 'Original currency code detected from salary string (e.g., USD, EUR, GBP)';
