-- Drop the existing table and recreate with correct job_id type
DROP TABLE IF EXISTS job_decisions;

-- Create job_decisions table with BIGINT job_id to match jobs table
CREATE TABLE IF NOT EXISTS job_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id BIGINT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('interested', 'pass')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one decision per user per job
  UNIQUE(user_id, job_id)
);

-- Index for faster lookups
CREATE INDEX idx_job_decisions_user_id ON job_decisions(user_id);
CREATE INDEX idx_job_decisions_job_id ON job_decisions(job_id);
CREATE INDEX idx_job_decisions_user_job ON job_decisions(user_id, job_id);

-- Enable Row Level Security
ALTER TABLE job_decisions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own decisions
CREATE POLICY "Users can view their own job decisions"
  ON job_decisions FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own decisions
CREATE POLICY "Users can insert their own job decisions"
  ON job_decisions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own decisions
CREATE POLICY "Users can update their own job decisions"
  ON job_decisions FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own decisions
CREATE POLICY "Users can delete their own job decisions"
  ON job_decisions FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_job_decisions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
CREATE TRIGGER update_job_decisions_timestamp
  BEFORE UPDATE ON job_decisions
  FOR EACH ROW
  EXECUTE FUNCTION update_job_decisions_updated_at();
