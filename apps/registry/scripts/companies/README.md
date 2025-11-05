# Resume Company Enrichment System

Automated system for extracting companies from resumes and enriching them with comprehensive dossiers using Perplexity AI.

## Overview

This system:
1. **Extracts** unique companies from all resumes in the database
2. **Tracks** companies in a dedicated `resume_companies` table
3. **Enriches** companies with Perplexity AI to generate detailed dossiers
4. **Refreshes** company data yearly to keep information current
5. **Avoids duplicates** - Google is enriched once even if 1000 resumes mention it

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│           GitHub Actions (Weekly Sunday 02:00 UTC)              │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│  Step 1: Extract Companies (extract-companies-from-resumes.js)│
│  • Load all resumes from Supabase                              │
│  • Extract company names from work history                     │
│  • Normalize names (lowercase, remove Inc/LLC/etc)             │
│  • Upsert to resume_companies table with counts               │
└────────────────┬───────────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│  Step 2: Enrich Companies (enrich-resume-companies.js)        │
│  • Query companies needing enrichment:                         │
│    - Never enriched (enriched_at IS NULL)                      │
│    - Enriched >1 year ago (yearly refresh)                     │
│    - Retry count < 3 (failed attempts)                         │
│  • Call Perplexity AI with comprehensive prompt                │
│  • Store enrichment data and timestamp                         │
│  • Process in batches with rate limiting                       │
└────────────────────────────────────────────────────────────────┘
```

## Database Schema

### `resume_companies` Table

```sql
CREATE TABLE resume_companies (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,              -- Original name from resumes
  normalized_name TEXT NOT NULL,          -- Lowercase, deduplicated
  enrichment_data JSONB,                  -- Perplexity API response
  enriched_at TIMESTAMPTZ,                -- Last enrichment timestamp
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resume_count INTEGER DEFAULT 0,         -- How many resumes mention this
  error_message TEXT,                     -- Last error if enrichment failed
  retry_count INTEGER DEFAULT 0           -- Failed attempt count (max 3)
);
```

**Indexes:**
- `idx_resume_companies_normalized_name` - Fast lookups
- `idx_resume_companies_enriched_at` - Find companies needing refresh
- `idx_resume_companies_needs_enrichment` - Composite index for enrichment query

## Scripts

### 1. `extract-companies-from-resumes.js`

**Purpose:** Extract and track all companies from resumes

**How it works:**
- Loads all resumes from `gists` table in batches (1000 at a time)
- Parses each resume's `work` array for company names
- Normalizes names (e.g., "Google Inc." → "google inc")
- Upserts to `resume_companies` table
- Increments `resume_count` for existing companies

**Usage:**
```bash
cd apps/registry
node scripts/companies/extract-companies-from-resumes.js
```

**Environment Variables:**
- `SUPABASE_KEY` - Supabase service role key

**Output:**
- Companies inserted/updated in `resume_companies` table
- Console output shows top 10 most common companies

### 2. `enrich-resume-companies.js`

**Purpose:** Enrich companies with Perplexity AI dossiers

**How it works:**
1. **Query companies needing enrichment:**
   - Never enriched (`enriched_at IS NULL`)
   - Enriched >1 year ago (yearly refresh)
   - Retry count < 3 (skip permanently failed)
   - Ordered by `resume_count` DESC (prioritize popular companies)

2. **Call Perplexity AI:**
   - Uses `sonar-pro` model for comprehensive research
   - Comprehensive prompt covering:
     - Company overview (name, industry, size, location)
     - Business model and products
     - Market position and competitors
     - Technology stack
     - Company culture and values
     - Funding and financials
     - Recent news (last 6 months)

3. **Store results:**
   - Save enrichment data to `enrichment_data` column
   - Set `enriched_at` timestamp
   - Clear `error_message`
   - Or increment `retry_count` on failure

**Usage:**
```bash
cd apps/registry
# Process default batch size (50 companies)
node scripts/companies/enrich-resume-companies.js

# Process specific number of companies (useful for testing)
node scripts/companies/enrich-resume-companies.js --limit=3
```

**Command Line Arguments:**
- `--limit=N` - Process only N companies (default: 50)

**Environment Variables:**
- `PERPLEXITY_API_KEY` - Perplexity API key
- `SUPABASE_KEY` - Supabase service role key

**Configuration:**
- `MAX_RETRIES`: 3 (max failed attempts before skipping)
- `CONCURRENCY`: 2 (process 2 companies at a time)
- `BATCH_SIZE`: 50 (max companies per run, override with --limit)

**Output:**
- Enrichment data stored in `resume_companies` table
- Console output shows progress and success/failure counts

### 3. `enrichCompany.js`

**Purpose:** Core module for Perplexity AI integration

**Exports:**
- `enrichCompany(companyName, apiKey)` - Call Perplexity API
- `normalizeCompanyName(name)` - Normalize names for deduplication

**Features:**
- Comprehensive prompt template
- Lower temperature (0.3) for factual responses
- Recent news (last year)
- Error handling and validation
- Token usage tracking

## GitHub Actions Workflow

**File:** `.github/workflows/enrich_resume_companies.yml`

**Schedule:** Weekly on Sunday at 02:00 UTC

**Manual Trigger:** Available via GitHub UI (Actions → Enrich Resume Companies → Run workflow)

**Features:**
- ✅ Automated weekly execution
- ✅ Manual trigger available
- ✅ Comprehensive logging and error tracking
- ✅ Discord notifications on completion
- ✅ Auto-creates GitHub issues for repeated failures
- ✅ Workflow summary with processing stats
- ✅ Log artifact uploads (30-day retention)

**Required Secrets:**
```bash
PERPLEXITY_API_KEY      # Perplexity API key
SUPABASE_KEY            # Supabase service role key
```

To add secrets: GitHub repo → Settings → Secrets and variables → Actions → New repository secret

## Efficiency & Deduplication

### How Deduplication Works

1. **Name Normalization:**
   ```javascript
   "Google Inc." → "google inc"
   "Google LLC" → "google llc"
   "Google" → "google"
   ```
   All variants are stored separately but normalized for comparison.

2. **Unique Constraint:**
   The `resume_companies` table has a UNIQUE constraint on `normalized_name`, preventing duplicates.

3. **Upsert Logic:**
   - First insert attempt uses the normalized name
   - On conflict, increment `resume_count` instead
   - Result: Only one enrichment per unique company

### Why This is Efficient

**Before (inefficient):**
- Load ALL resumes every time (could be millions)
- Parse every resume to find companies
- Check if each company exists
- Slow, memory-intensive, scales poorly

**After (efficient):**
- ONE extraction run populates tracking table
- Enrichment queries ONLY companies needing it
- Single SQL query: `WHERE enriched_at IS NULL OR enriched_at < 1_year_ago`
- No resume loading during enrichment
- Scales to millions of resumes without slowdown

**Example:**
- 10,000 resumes mention "Google"
- Old approach: Load and parse 10,000 resumes every run
- New approach: Single database row, enriched once, refreshed yearly

## Yearly Refresh Strategy

Companies are refreshed yearly because:
1. **Recent news changes** - New products, funding, leadership
2. **Company evolution** - Size, stage, market position
3. **Accuracy** - Keep data current without constant updates
4. **Cost efficiency** - Balance freshness with API costs

**Refresh Logic:**
```sql
WHERE enriched_at IS NULL
   OR enriched_at < NOW() - INTERVAL '1 year'
```

## Error Handling

### Retry Strategy

- **Max 3 retries** per company
- Failures increment `retry_count`
- Error message stored in `error_message` column
- Companies with `retry_count >= 3` are skipped

**Common Failures:**
- Rate limit errors (429) - Wait and retry
- API errors (500) - Perplexity service issue
- Invalid company names - Perplexity can't find info
- Network timeouts

### Recovery

Failed companies can be manually reset:
```sql
UPDATE resume_companies
SET retry_count = 0, error_message = NULL
WHERE retry_count >= 3;
```

## Development

### Local Testing

1. **Add Perplexity API key to .env:**
```bash
# apps/registry/.env
PERPLEXITY_API_KEY=pplx-...
SUPABASE_KEY=eyJ...
```

2. **Run extraction:**
```bash
cd apps/registry
node scripts/companies/extract-companies-from-resumes.js
```

3. **Run enrichment (test with 1-2 companies):**
```bash
# Modify BATCH_SIZE in script to 2 for testing
node scripts/companies/enrich-resume-companies.js
```

4. **Check results:**
```sql
SELECT name, enriched_at, resume_count, retry_count
FROM resume_companies
ORDER BY resume_count DESC
LIMIT 10;
```

### Testing the Workflow

1. **Validate workflow syntax:**
```bash
# Install actionlint
brew install actionlint

# Validate workflow file
actionlint .github/workflows/enrich_resume_companies.yml
```

2. **Test manual workflow trigger:**
- Go to GitHub Actions → Enrich Resume Companies → Run workflow
- Check logs and summary for errors
- Verify Discord notification works

## Monitoring

### Check Enrichment Status

**View recent companies:**
```sql
SELECT
  name,
  resume_count,
  enriched_at,
  CASE
    WHEN enriched_at IS NULL THEN 'Pending'
    WHEN enriched_at < NOW() - INTERVAL '1 year' THEN 'Needs Refresh'
    WHEN retry_count >= 3 THEN 'Failed (max retries)'
    ELSE 'Up to date'
  END as status
FROM resume_companies
ORDER BY resume_count DESC
LIMIT 100;
```

**Count companies by status:**
```sql
SELECT
  CASE
    WHEN enriched_at IS NULL THEN 'Pending'
    WHEN enriched_at < NOW() - INTERVAL '1 year' THEN 'Needs Refresh'
    WHEN retry_count >= 3 THEN 'Failed'
    ELSE 'Up to date'
  END as status,
  COUNT(*) as count
FROM resume_companies
GROUP BY status;
```

**Top companies by resume count:**
```sql
SELECT name, resume_count, enriched_at
FROM resume_companies
ORDER BY resume_count DESC
LIMIT 20;
```

### GitHub Actions

- **View workflow runs:** GitHub repo → Actions → Enrich Resume Companies
- **Check logs:** Click on any run → View job logs
- **Download artifacts:** Scroll to bottom of run page → Artifacts section

## Troubleshooting

### Common Issues

#### 1. "PERPLEXITY_API_KEY environment variable is not set"

**Cause:** Missing API key

**Fix:**
- Add `PERPLEXITY_API_KEY` to `apps/registry/.env` for local testing
- Add as GitHub secret for Actions workflow

#### 2. Enrichment failing with 429 (Rate Limit)

**Cause:** Too many requests to Perplexity API

**Fix:**
- Reduce `CONCURRENCY` in `enrich-resume-companies.js`
- Increase delay between requests (currently 1000ms)
- Check Perplexity dashboard for rate limits

#### 3. Companies not being extracted

**Cause:** Resume data structure unexpected

**Fix:**
- Check resume schema in database
- Verify `work` array exists and has `company` field
- Update `extractCompaniesFromResume()` function if schema changed

#### 4. GitHub Actions workflow fails with database error

**Cause:** Migration not applied

**Fix:**
```bash
# Apply migration locally
supabase db push

# Or apply to production via Supabase dashboard
```

## Performance

**Typical Processing Times:**
- Extract: ~2-5 minutes (10,000 resumes)
- Enrich: ~25 minutes (50 companies @ 2 concurrent, ~30 seconds each)

**Rate Limits:**
- Perplexity: Check your plan limits
- Supabase: No hard limits (managed service)

**Cost Estimates (per weekly run):**
- Perplexity API: ~$2-5 (50 companies × ~$0.05 each)
- Storage: Minimal (<1MB for company data)

## Future Improvements

- [ ] Add company logo URLs
- [ ] Extract company website and social links
- [ ] Add company size categories (startup, scaleup, enterprise)
- [ ] Industry classification and tagging
- [ ] Competitor analysis
- [ ] Add company search/filter API endpoint
- [ ] Frontend UI for browsing company dossiers

## Contributing

When making changes to the pipeline:
1. **Test locally first** - Never push untested changes
2. **Update this README** - Document any architectural changes
3. **Update CLAUDE.md** - Add learnings to repository instructions
4. **Test manually** - Trigger workflow manually before relying on cron
5. **Monitor first run** - Watch logs closely after deploying changes

## Related Documentation

- [Perplexity AI Docs](https://docs.perplexity.ai/)
- [Supabase Docs](https://supabase.com/docs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

Last Updated: 2025-11-06
