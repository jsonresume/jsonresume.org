-- Decisions Feature: Supabase Tables
-- Cache AI analysis results to minimize API costs

-- Cache for job analysis (AI-powered)
CREATE TABLE IF NOT EXISTS decisions_job_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,

  -- AI-generated analysis
  required_skills TEXT[] NOT NULL DEFAULT '{}',
  implicit_requirements TEXT[] NOT NULL DEFAULT '{}',
  seniority_level TEXT,
  responsibilities TEXT[] NOT NULL DEFAULT '{}',
  culture TEXT,
  growth_opportunities TEXT,

  -- Metadata
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  analysis_version INTEGER DEFAULT 1, -- Track schema changes

  -- Index for fast lookups
  UNIQUE(job_id, analysis_version),
  INDEX idx_decisions_job_analysis_job_id ON decisions_job_analysis(job_id)
);

-- Cache for candidate analysis (optional, per-resume)
CREATE TABLE IF NOT EXISTS decisions_candidate_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,

  -- AI-generated candidate profile
  core_competencies TEXT[] NOT NULL DEFAULT '{}',
  experience_level TEXT,
  industries TEXT[] NOT NULL DEFAULT '{}',
  specializations TEXT[] NOT NULL DEFAULT '{}',
  career_goals TEXT,
  strengths TEXT[] NOT NULL DEFAULT '{}',
  skill_gaps TEXT[] NOT NULL DEFAULT '{}',

  -- Metadata
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  analysis_version INTEGER DEFAULT 1,
  resume_hash TEXT, -- Hash of resume JSON to detect changes

  -- Index for fast lookups
  UNIQUE(username, analysis_version),
  INDEX idx_decisions_candidate_analysis_username ON decisions_candidate_analysis(username)
);

-- Cache for match results (optional, can be computed on-the-fly)
CREATE TABLE IF NOT EXISTS decisions_match_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,

  -- Match outcome
  overall_fit TEXT CHECK (overall_fit IN ('strong', 'possible', 'weak')),
  score INTEGER CHECK (score >= 0 AND score <= 100),

  -- AI-generated reasoning
  strengths JSONB DEFAULT '[]', -- Array of {criterion, reason}
  weaknesses JSONB DEFAULT '[]', -- Array of {criterion, reason, remediation}
  recommendation TEXT,
  confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),

  -- Decision path
  decision_path JSONB, -- Array of nodes traversed

  -- Metadata
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  analysis_version INTEGER DEFAULT 1,

  -- Index for fast lookups
  UNIQUE(username, job_id, analysis_version),
  INDEX idx_decisions_match_username_job ON decisions_match_results(username, job_id)
);

-- TTL function to auto-delete old cache entries (run daily)
-- Keep analysis for 7 days, then re-analyze if needed
CREATE OR REPLACE FUNCTION delete_old_decisions_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM decisions_job_analysis WHERE analyzed_at < NOW() - INTERVAL '7 days';
  DELETE FROM decisions_candidate_analysis WHERE analyzed_at < NOW() - INTERVAL '7 days';
  DELETE FROM decisions_match_results WHERE matched_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a cron job to run cleanup daily
-- (Requires pg_cron extension - may need to enable in Supabase dashboard)
-- SELECT cron.schedule('cleanup-decisions-cache', '0 2 * * *', 'SELECT delete_old_decisions_cache()');

COMMENT ON TABLE decisions_job_analysis IS 'Cache for AI-powered job analysis to minimize OpenAI API costs';
COMMENT ON TABLE decisions_candidate_analysis IS 'Cache for AI-powered candidate profile analysis';
COMMENT ON TABLE decisions_match_results IS 'Cache for match reasoning and decision paths';
