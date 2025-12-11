-- Create job_states table to track job read/interested/hidden states
-- Supports both anonymous sessions and authenticated users

CREATE TABLE IF NOT EXISTS job_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID, -- For anonymous users
  job_id BIGINT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('read', 'interested', 'hidden')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraint: must have either user_id or session_id
  CONSTRAINT job_states_owner_check CHECK (user_id IS NOT NULL OR session_id IS NOT NULL),

  -- Unique per user per job (for authenticated users)
  UNIQUE NULLS NOT DISTINCT (user_id, job_id),

  -- Unique per session per job (for anonymous users)
  UNIQUE NULLS NOT DISTINCT (session_id, job_id)
);

-- Indexes for faster lookups
CREATE INDEX idx_job_states_user_id ON job_states(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_job_states_session_id ON job_states(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX idx_job_states_job_id ON job_states(job_id);

-- Enable Row Level Security
ALTER TABLE job_states ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own job states
CREATE POLICY "Users can view their own job states"
  ON job_states FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own job states
CREATE POLICY "Users can insert their own job states"
  ON job_states FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own job states
CREATE POLICY "Users can update their own job states"
  ON job_states FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own job states
CREATE POLICY "Users can delete their own job states"
  ON job_states FOR DELETE
  USING (auth.uid() = user_id);

-- Anonymous session policies (via service role, server-side only)
-- These operations will be done via API routes with service role key

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_job_states_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
CREATE TRIGGER update_job_states_timestamp
  BEFORE UPDATE ON job_states
  FOR EACH ROW
  EXECUTE FUNCTION update_job_states_updated_at();
