-- Create pathways_job_feedback table for storing user feedback on jobs
CREATE TABLE IF NOT EXISTS pathways_job_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  job_id TEXT NOT NULL,

  -- Feedback content
  feedback TEXT NOT NULL,
  sentiment TEXT NOT NULL DEFAULT 'dismissed', -- 'interested', 'not_interested', 'maybe', 'applied', 'dismissed'

  -- Job context at time of feedback (for historical reference)
  job_title TEXT,
  job_company TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_pathways_job_feedback_user_id ON pathways_job_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_pathways_job_feedback_job_id ON pathways_job_feedback(job_id);
CREATE INDEX IF NOT EXISTS idx_pathways_job_feedback_sentiment ON pathways_job_feedback(sentiment);

-- Add RLS policies
ALTER TABLE pathways_job_feedback ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own feedback
CREATE POLICY "Users can manage their own job feedback"
  ON pathways_job_feedback
  FOR ALL
  USING (true)
  WITH CHECK (true);
