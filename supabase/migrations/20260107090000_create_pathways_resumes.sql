-- Pathways Resume Storage
-- Separate from the traditional gist-based system
-- Stores resumes and tracks all changes/diffs

-- Main resume storage table
CREATE TABLE IF NOT EXISTS pathways_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID,
  resume JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Must have either user_id or session_id
  CONSTRAINT pathways_resumes_owner CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- One resume per user (for authenticated users)
CREATE UNIQUE INDEX idx_pathways_resumes_user_id_unique
  ON pathways_resumes(user_id) WHERE user_id IS NOT NULL;

-- One resume per session (for anonymous users)
CREATE UNIQUE INDEX idx_pathways_resumes_session_id_unique
  ON pathways_resumes(session_id) WHERE session_id IS NOT NULL;

-- Query optimization indexes
CREATE INDEX idx_pathways_resumes_user_id ON pathways_resumes(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_pathways_resumes_session_id ON pathways_resumes(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX idx_pathways_resumes_updated_at ON pathways_resumes(updated_at DESC);

-- Resume change history table
CREATE TABLE IF NOT EXISTS pathways_resume_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES pathways_resumes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID,
  diff JSONB NOT NULL,
  explanation TEXT,
  source VARCHAR(50) NOT NULL, -- 'ai_update', 'file_upload', 'manual_edit', 'gist_import'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Must have either user_id or session_id
  CONSTRAINT pathways_resume_history_owner CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- Query optimization indexes for history
CREATE INDEX idx_pathways_resume_history_resume_id ON pathways_resume_history(resume_id);
CREATE INDEX idx_pathways_resume_history_user_id ON pathways_resume_history(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_pathways_resume_history_session_id ON pathways_resume_history(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX idx_pathways_resume_history_created_at ON pathways_resume_history(created_at DESC);
CREATE INDEX idx_pathways_resume_history_source ON pathways_resume_history(source);

-- Auto-update timestamp trigger for pathways_resumes
CREATE OR REPLACE FUNCTION update_pathways_resumes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pathways_resumes_timestamp
  BEFORE UPDATE ON pathways_resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_pathways_resumes_updated_at();

-- Enable Row Level Security
ALTER TABLE pathways_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathways_resume_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pathways_resumes
CREATE POLICY "Users can view their own resumes"
  ON pathways_resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes"
  ON pathways_resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
  ON pathways_resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
  ON pathways_resumes FOR DELETE
  USING (auth.uid() = user_id);

-- Service role can do everything (for API routes handling anonymous sessions)
CREATE POLICY "Service role full access to resumes"
  ON pathways_resumes FOR ALL
  USING (auth.role() = 'service_role');

-- RLS Policies for pathways_resume_history
CREATE POLICY "Users can view their own resume history"
  ON pathways_resume_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resume history"
  ON pathways_resume_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can do everything (for API routes handling anonymous sessions)
CREATE POLICY "Service role full access to resume history"
  ON pathways_resume_history FOR ALL
  USING (auth.role() = 'service_role');

-- Grant permissions
GRANT ALL ON pathways_resumes TO authenticated;
GRANT ALL ON pathways_resumes TO service_role;
GRANT ALL ON pathways_resume_history TO authenticated;
GRANT ALL ON pathways_resume_history TO service_role;

-- Add comments for documentation
COMMENT ON TABLE pathways_resumes IS 'Stores resumes for Pathways career copilot, separate from gist-based system';
COMMENT ON TABLE pathways_resume_history IS 'Tracks all changes/diffs applied to Pathways resumes';
COMMENT ON COLUMN pathways_resume_history.source IS 'Source of the change: ai_update, file_upload, manual_edit, gist_import';
