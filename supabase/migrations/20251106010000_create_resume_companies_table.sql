-- Create resume_companies table for tracking company enrichment
-- This table stores unique companies extracted from resumes and their enrichment status

CREATE TABLE IF NOT EXISTS resume_companies (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  normalized_name TEXT NOT NULL,
  context_data JSONB,
  enrichment_data JSONB,
  enriched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  resume_count INTEGER DEFAULT 0 NOT NULL,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0 NOT NULL
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_resume_companies_normalized_name ON resume_companies(normalized_name);
CREATE INDEX IF NOT EXISTS idx_resume_companies_enriched_at ON resume_companies(enriched_at) WHERE enriched_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_resume_companies_needs_enrichment ON resume_companies(enriched_at, retry_count)
  WHERE enriched_at IS NULL OR enriched_at < NOW() - INTERVAL '1 year';

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_resume_companies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resume_companies_updated_at
  BEFORE UPDATE ON resume_companies
  FOR EACH ROW
  EXECUTE FUNCTION update_resume_companies_updated_at();

-- Create function to increment resume_count for existing companies
CREATE OR REPLACE FUNCTION increment_resume_count(company_normalized_name TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE resume_companies
  SET resume_count = resume_count + 1,
      updated_at = NOW()
  WHERE normalized_name = company_normalized_name;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment retry_count for failed enrichments
CREATE OR REPLACE FUNCTION increment_retry_count(company_id BIGINT)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE resume_companies
  SET retry_count = retry_count + 1
  WHERE id = company_id
  RETURNING retry_count INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE resume_companies IS 'Tracks unique companies from resumes and their Perplexity enrichment status';
COMMENT ON COLUMN resume_companies.name IS 'Original company name as it appears in resumes';
COMMENT ON COLUMN resume_companies.normalized_name IS 'Lowercase, trimmed name for deduplication (e.g., "Google Inc." -> "google inc")';
COMMENT ON COLUMN resume_companies.context_data IS 'Context from resumes: locations and positions for disambiguation';
COMMENT ON COLUMN resume_companies.enrichment_data IS 'Full Perplexity API response with company dossier';
COMMENT ON COLUMN resume_companies.enriched_at IS 'Timestamp of last successful enrichment (NULL if never enriched)';
COMMENT ON COLUMN resume_companies.resume_count IS 'Number of resumes that reference this company';
COMMENT ON COLUMN resume_companies.error_message IS 'Last error message if enrichment failed';
COMMENT ON COLUMN resume_companies.retry_count IS 'Number of failed enrichment attempts (max 3)';
