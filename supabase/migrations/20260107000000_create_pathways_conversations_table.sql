-- Create pathways_conversations table for persisting chat history
-- Supports both anonymous sessions and authenticated users

CREATE TABLE IF NOT EXISTS pathways_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID, -- For anonymous users
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  resume_snapshot JSONB, -- Optional: save resume state with conversation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraint: must have either user_id or session_id
  CONSTRAINT pathways_conversations_owner_check CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- Indexes for faster lookups
CREATE INDEX idx_pathways_conversations_user_id ON pathways_conversations(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_pathways_conversations_session_id ON pathways_conversations(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX idx_pathways_conversations_updated_at ON pathways_conversations(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE pathways_conversations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own conversations
CREATE POLICY "Users can view their own conversations"
  ON pathways_conversations FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own conversations
CREATE POLICY "Users can insert their own conversations"
  ON pathways_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own conversations
CREATE POLICY "Users can update their own conversations"
  ON pathways_conversations FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own conversations
CREATE POLICY "Users can delete their own conversations"
  ON pathways_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Anonymous session operations handled via service role key server-side

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pathways_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
CREATE TRIGGER update_pathways_conversations_timestamp
  BEFORE UPDATE ON pathways_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_pathways_conversations_updated_at();
