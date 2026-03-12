-- Search profiles: custom embeddings for different search contexts
-- e.g. "rockets in Texas" combines user prompt with resume to create a new embedding
CREATE TABLE search_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  prompt TEXT NOT NULL,
  embedding extensions.vector(3072),
  filters JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_profiles_user_id ON search_profiles(user_id);
