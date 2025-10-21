-- Create job_evaluation_preferences table for storing user customization
CREATE TABLE IF NOT EXISTS job_evaluation_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  criterion TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  value JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one preference per user per criterion
  UNIQUE(user_id, criterion)
);

-- Index for faster lookups
CREATE INDEX idx_job_eval_prefs_user_id ON job_evaluation_preferences(user_id);
CREATE INDEX idx_job_eval_prefs_user_criterion ON job_evaluation_preferences(user_id, criterion);

-- Enable Row Level Security
ALTER TABLE job_evaluation_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own preferences
CREATE POLICY "Users can view their own evaluation preferences"
  ON job_evaluation_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own preferences
CREATE POLICY "Users can insert their own evaluation preferences"
  ON job_evaluation_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own preferences
CREATE POLICY "Users can update their own evaluation preferences"
  ON job_evaluation_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own preferences
CREATE POLICY "Users can delete their own evaluation preferences"
  ON job_evaluation_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_job_eval_prefs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
CREATE TRIGGER update_job_eval_prefs_timestamp
  BEFORE UPDATE ON job_evaluation_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_job_eval_prefs_updated_at();
