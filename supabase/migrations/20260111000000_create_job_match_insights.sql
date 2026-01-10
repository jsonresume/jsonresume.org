-- Create job_match_insights table for caching AI-generated job match explanations
CREATE TABLE IF NOT EXISTS job_match_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  job_id TEXT NOT NULL,

  -- The AI-generated insights
  insights JSONB NOT NULL, -- Array of bullet points

  -- Context used to generate (for cache invalidation)
  resume_hash TEXT NOT NULL, -- Hash of resume at generation time
  job_hash TEXT NOT NULL, -- Hash of job details at generation time

  -- Metadata
  model TEXT DEFAULT 'gpt-4.1',
  tokens_used INTEGER,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint to prevent duplicates
  UNIQUE(user_id, job_id)
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_job_match_insights_user_id ON job_match_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_job_match_insights_job_id ON job_match_insights(job_id);
CREATE INDEX IF NOT EXISTS idx_job_match_insights_user_job ON job_match_insights(user_id, job_id);

-- Add RLS policies
ALTER TABLE job_match_insights ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own insights
CREATE POLICY "Users can manage their own job match insights"
  ON job_match_insights
  FOR ALL
  USING (true)
  WITH CHECK (true);
