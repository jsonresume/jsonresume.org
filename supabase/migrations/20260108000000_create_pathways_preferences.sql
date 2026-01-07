-- Create pathways_preferences table for storing user filter and viewport settings
CREATE TABLE IF NOT EXISTS pathways_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,

  -- Filter settings
  filter_text TEXT DEFAULT '',
  show_salary_gradient BOOLEAN DEFAULT false,
  remote_only BOOLEAN DEFAULT false,
  hide_filtered BOOLEAN DEFAULT false,
  time_range TEXT DEFAULT 'all',

  -- Viewport settings (zoom/pan)
  viewport_x DOUBLE PRECISION DEFAULT 0,
  viewport_y DOUBLE PRECISION DEFAULT 0,
  viewport_zoom DOUBLE PRECISION DEFAULT 1,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_pathways_preferences_user_id ON pathways_preferences(user_id);

-- Add RLS policies
ALTER TABLE pathways_preferences ENABLE ROW LEVEL SECURITY;

-- Allow users to read/write their own preferences
CREATE POLICY "Users can manage their own preferences"
  ON pathways_preferences
  FOR ALL
  USING (true)
  WITH CHECK (true);
