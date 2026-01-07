-- Create pathways_activity_log table for comprehensive activity tracking
CREATE TABLE IF NOT EXISTS pathways_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID,
  activity_type VARCHAR(50) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  details JSONB DEFAULT '{}'::jsonb,

  -- Must have either user_id or session_id
  CONSTRAINT activity_owner CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id
  ON pathways_activity_log(user_id) WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_activity_log_session_id
  ON pathways_activity_log(session_id) WHERE session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp
  ON pathways_activity_log(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_activity_log_activity_type
  ON pathways_activity_log(activity_type);

-- Compound indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_activity_log_user_time
  ON pathways_activity_log(user_id, timestamp DESC) WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_activity_log_session_time
  ON pathways_activity_log(session_id, timestamp DESC) WHERE session_id IS NOT NULL;

-- Enable RLS
ALTER TABLE pathways_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS policies
-- Users can read their own activities
CREATE POLICY "Users can read own activities"
  ON pathways_activity_log
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR (user_id IS NULL AND session_id IS NOT NULL)
  );

-- Users can insert their own activities
CREATE POLICY "Users can insert own activities"
  ON pathways_activity_log
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR (user_id IS NULL AND session_id IS NOT NULL)
  );

-- Service role can do everything (for API routes)
CREATE POLICY "Service role full access"
  ON pathways_activity_log
  FOR ALL
  USING (auth.role() = 'service_role');

-- Grant permissions
GRANT ALL ON pathways_activity_log TO authenticated;
GRANT ALL ON pathways_activity_log TO service_role;
