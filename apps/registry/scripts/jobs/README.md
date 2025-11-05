# Hacker News Job Processing Pipeline

Automated system for scraping, processing, and indexing job postings from Hacker News "Who is Hiring?" threads.

## Overview

This pipeline automatically:
1. **Scrapes** the latest HN "Who is Hiring?" threads
2. **Parses** job postings using AI (OpenAI GPT-5-mini)
3. **Enriches** data with company information
4. **Vectorizes** jobs for semantic search
5. **Stores** structured data in Supabase PostgreSQL + Pinecone

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Actions (Daily 9 AM UTC)             │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│  Step 1: Fetch HN Jobs (import-hn-latest-thread.js)           │
│  • Scrape HN API for latest "Who is Hiring?" thread           │
│  • Extract job postings from comments                          │
│  • Store raw HTML in Supabase \`jobs\` table                     │
└────────────────┬───────────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│  Step 2: AI Processing (parse-job-descriptions.js)            │
│  • Initial parsing with GPT-5-mini                             │
│  • Company enrichment (fetch company data)                     │
│  • Natural language generation (descriptions)                  │
│  • Store structured JSON in \`gpt_content\` column               │
└────────────────┬───────────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│  Step 3: Vectorization (generate-embeddings-jobs.js)          │
│  • Generate embeddings with OpenAI text-embedding-3-large      │
│  • Store vectors in Supabase for semantic search               │
│  • Enable job matching based on resume similarity              │
└────────────────────────────────────────────────────────────────┘
```

## Scripts

### 1. \`import-hn-latest-thread.js\`

**Purpose:** Scrape HN "Who is Hiring?" threads and extract job postings

**How it works:**
- Fetches HN Algolia API for threads matching "Ask HN: Who is hiring?"
- Parses comment tree to extract individual job postings
- Stores raw job data in Supabase \`jobs\` table
- Tracks processing state (\`gpt_content = null\` for new jobs)

**Usage:**
\`\`\`bash
cd apps/registry
node scripts/jobs/import-hn-latest-thread.js
\`\`\`

**Environment Variables:**
- \`SUPABASE_KEY\` - Supabase service role key

**Output:**
- Jobs inserted into \`jobs\` table with fields:
  - \`uuid\` - Unique identifier
  - \`hn_item_id\` - HN comment ID
  - \`content\` - Raw HTML from HN comment
  - \`posted_at\` - Job posting date
  - \`gpt_content\` - Initially \`null\` (populated by gpted.js)

### 2. \`parse-job-descriptions.js\`

**Purpose:** Process jobs with AI to extract structured data

**How it works:**
1. **Initial Processing** (\`initialProcessing.js\`)
   - Uses OpenAI GPT-5-mini with \`generateObject()\` and Zod schema
   - Extracts: title, company, location, salary, type, skills, etc.
   - Returns structured JSON matching \`jobDescriptionSchema\`

2. **Company Enrichment** (\`companyEnrichment.js\`)
   - Fetches company data from external APIs
   - Re-processes job with additional company context
   - Improves data accuracy and completeness

3. **Natural Language Generation** (\`naturalLanguageGeneration.js\`)
   - Generates human-readable job descriptions
   - Creates summary text for display
   - Uses \`generateText()\` with conversational prompt

**Usage:**
\`\`\`bash
cd apps/registry
node scripts/jobs/parse-job-descriptions.js
\`\`\`

**Environment Variables:**
- \`OPENAI_API_KEY\` - OpenAI API key (must use GPT-5-mini compatible key)
- \`SUPABASE_KEY\` - Supabase service role key

**Processing Logic:**
- Queries jobs where \`gpt_content IS NULL\` or \`gpt_content = 'FAILED'\`
- Processes in batches to avoid rate limits
- Retries failed jobs with exponential backoff
- Marks failures as \`'FAILED'\` to prevent infinite retries

**Output:**
- Updates \`gpt_content\` column with structured JSON:
\`\`\`json
{
  "title": "Senior Software Engineer",
  "company": "Example Corp",
  "location": {
    "city": "San Francisco",
    "state": "CA",
    "country": "USA",
    "remote": true
  },
  "salary": {
    "min": 150000,
    "max": 200000,
    "currency": "USD",
    "period": "year"
  },
  "type": "Full-time",
  "skills": ["React", "Node.js", "TypeScript"],
  "description": "...",
  // ... more fields
}
\`\`\`

### 3. \`generate-embeddings-jobs.js\`

**Purpose:** Generate embeddings for semantic job search

**How it works:**
- Queries jobs with valid \`gpt_content\` but no vector embedding
- Creates embedding text from job title, company, skills, description
- Calls OpenAI \`text-embedding-3-large\` model (3072 dimensions)
- Stores vectors in Supabase \`embedding_v5\` column

**Usage:**
\`\`\`bash
cd apps/registry
node scripts/jobs/generate-embeddings-jobs.js
\`\`\`

**Environment Variables:**
- \`OPENAI_API_KEY\` - OpenAI API key
- \`SUPABASE_KEY\` - Supabase service role key

**Output:**
- Vectors stored in Pinecone with metadata:
  - \`job_id\` - Reference to Supabase job UUID
  - \`title\`, \`company\`, \`location\` - For filtering
  - Enables semantic search: "Find jobs similar to my resume"

## Directory Structure

\`\`\`
scripts/jobs/
├── README.md                           # This file
├── import-hn-latest-thread.js         # Fetch latest HN "Who is Hiring?" thread
├── import-hn-job.js                   # Import a specific HN thread
├── parse-job-descriptions.js          # AI processing orchestrator
├── generate-embeddings-jobs.js        # Generate job embeddings
├── generate-embeddings-resumes.js     # Generate resume embeddings
├── enrich-companies.js                # Fetch company data from Perplexity
└── job-parser/                        # AI processing modules
    ├── database/                      # Database operations
    │   ├── initializeSupabase.js      # Supabase client setup
    │   ├── jobOperations.js           # Job CRUD operations
    │   └── companyData.js             # Company data fetching
    ├── processJob/
    │   ├── initialProcessing.js       # Extract structured data
    │   ├── companyEnrichment.js       # Enrich with company data
    │   └── naturalLanguageGeneration.js # Generate descriptions
    ├── prompts.js                     # System prompts for AI
    └── openaiFunction.js              # Zod schema for job data
\`\`\`

## GitHub Actions Workflow

The pipeline runs automatically via GitHub Actions:

**File:** \`.github/workflows/process-hn-jobs.yml\`

**Schedule:** Daily at 9 AM UTC (1 AM PST / 4 AM EST)

**Manual Trigger:** Available via GitHub UI (Actions → Process Hacker News Jobs → Run workflow)

**Features:**
- ✅ Automated daily execution
- ✅ Manual trigger with options (skip fetch, etc.)
- ✅ Comprehensive logging and error tracking
- ✅ Discord notifications on failure
- ✅ Auto-creates GitHub issues for repeated failures
- ✅ Workflow summary with processing stats
- ✅ Log artifact uploads (30-day retention)

**Required Secrets:**
\`\`\`bash
OPENAI_API_KEY          # OpenAI API key
SUPABASE_KEY            # Supabase service role key
PINECONE_API_KEY        # Pinecone API key
PINECONE_ENVIRONMENT    # Pinecone environment
DISCORD_WEBHOOK_URL     # Discord webhook for notifications
\`\`\`

To add secrets: GitHub repo → Settings → Secrets and variables → Actions → New repository secret

## Development

### Local Setup

1. **Install dependencies:**
\`\`\`bash
pnpm install
\`\`\`

2. **Configure environment variables:**
\`\`\`bash
# apps/registry/.env
OPENAI_API_KEY=sk-...
SUPABASE_KEY=eyJ...
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=...
\`\`\`

3. **Run individual scripts:**
\`\`\`bash
# Fetch jobs from HN
cd apps/registry
node scripts/jobs/import-hn-latest-thread.js

# Process with AI (can take 30-60 min for hundreds of jobs)
node scripts/jobs/parse-job-descriptions.js

# Vectorize processed jobs
node scripts/jobs/generate-embeddings-jobs.js

# Enrich companies with Perplexity
node scripts/jobs/enrich-companies.js
\`\`\`

### Running the Full Pipeline

\`\`\`bash
cd apps/registry

# Run all steps sequentially
node scripts/jobs/import-hn-latest-thread.js && \\
  node scripts/jobs/parse-job-descriptions.js && \\
  node scripts/jobs/generate-embeddings-jobs.js
\`\`\`

### Testing Changes

Before pushing changes to the workflow:

1. **Test scripts locally:**
\`\`\`bash
# Fetch a small batch
node scripts/jobs/import-hn-latest-thread.js

# Process 1-2 jobs to verify AI processing works
node scripts/jobs/parse-job-descriptions.js
\`\`\`

2. **Validate workflow syntax:**
\`\`\`bash
# Install actionlint
brew install actionlint

# Validate workflow file
actionlint .github/workflows/process-hn-jobs.yml
\`\`\`

3. **Test manual workflow trigger:**
- Go to GitHub Actions → Process Hacker News Jobs → Run workflow
- Check logs and summary for errors
- Verify Discord notification works (if failures occur)

## Monitoring

### Check Processing Status

**View recent jobs:**
\`\`\`sql
SELECT
  uuid,
  hn_item_id,
  posted_at,
  CASE
    WHEN gpt_content IS NULL THEN 'Pending'
    WHEN gpt_content = 'FAILED' THEN 'Failed'
    ELSE 'Processed'
  END as status
FROM jobs
ORDER BY posted_at DESC
LIMIT 100;
\`\`\`

**Count jobs by status:**
\`\`\`sql
SELECT
  CASE
    WHEN gpt_content IS NULL THEN 'Pending'
    WHEN gpt_content = 'FAILED' THEN 'Failed'
    ELSE 'Processed'
  END as status,
  COUNT(*) as count
FROM jobs
WHERE posted_at > NOW() - INTERVAL '4 months'
GROUP BY status;
\`\`\`

### GitHub Actions

- **View workflow runs:** GitHub repo → Actions → Process Hacker News Jobs
- **Check logs:** Click on any run → View job logs
- **Download artifacts:** Scroll to bottom of run page → Artifacts section

### Pinecone

\`\`\`bash
# Check index stats
curl -X GET "https://api.pinecone.io/indexes/jobs/describe" \\
  -H "Api-Key: $PINECONE_API_KEY"
\`\`\`

## Troubleshooting

### Common Issues

#### 1. "No object generated: response did not match schema"

**Cause:** OpenAI response doesn't match Zod schema in \`schema.js\`

**Fix:**
- Check \`scripts/jobs/gpted/schema.js\` - ensure schema is flexible
- Review prompt in \`prompts.js\` - make sure it matches schema expectations
- Consider making optional fields use \`.optional()\` in Zod schema

#### 2. GitHub Actions workflow fails with 403 Forbidden

**Cause:** Missing or expired API keys

**Fix:**
- Verify all secrets are set in GitHub repo settings
- Check API key validity (OpenAI, Supabase, Pinecone)
- Ensure service role key is used for Supabase (not anon key)

#### 3. Jobs processed but not appearing on /jobs page

**Cause:** Jobs filtered out by frontend query

**Fix:**
- Check \`app/jobs/page.js\` - verify filter conditions
- Ensure \`gpt_content\` is valid JSON (not 'FAILED')
- Confirm \`posted_at\` is within 4-month window

#### 4. AI processing timeout

**Cause:** Processing too many jobs in one run

**Fix:**
- Workflow has 60-minute timeout - sufficient for ~500 jobs
- If hitting timeout, split into multiple manual runs
- Or increase timeout in workflow file: \`timeout-minutes: 120\`

### Logs and Debugging

**Local debugging:**
\`\`\`bash
# Enable detailed logging
DEBUG=* node scripts/jobs/gpted.js

# Process specific job by ID
node scripts/jobs/gpted.js --job-id=<uuid>
\`\`\`

**GitHub Actions debugging:**
- Enable debug logging: Repo Settings → Secrets → Add \`ACTIONS_STEP_DEBUG=true\`
- Re-run workflow to see detailed logs

## Performance

**Typical Processing Times:**
- Fetch: ~30 seconds (300-400 jobs)
- AI Processing: ~30-60 minutes (depends on job count, API speed)
- Vectorization: ~5-10 minutes (embedding generation)

**Rate Limits:**
- OpenAI: 10,000 TPM (tokens per minute) for GPT-5-mini
- Supabase: No hard limits (managed service)
- Pinecone: 100 req/sec (free tier)

**Cost Estimates (per monthly HN thread):**
- OpenAI GPT-5-mini: ~$0.50 - $2.00 (400 jobs × ~1000 tokens each)
- OpenAI Embeddings: ~$0.01 - $0.05 (400 jobs × small text)
- Supabase: Free tier sufficient (<500MB/month)
- Pinecone: Free tier sufficient (<100k vectors)

## Contributing

### Making Changes to the Pipeline

1. **Test locally first** - Never push untested changes to the workflow
2. **Update this README** - Document any architectural changes
3. **Update CLAUDE.md** - Add learnings to the repository instructions
4. **Test manually** - Trigger workflow manually before relying on cron
5. **Monitor first run** - Watch logs closely after deploying changes

### Adding New Features

**Example: Add new job field to schema**

1. Update Zod schema in \`scripts/jobs/gpted/schema.js\`
2. Update prompts in \`scripts/jobs/gpted/prompts.js\`
3. Test with \`node scripts/jobs/gpted.js\` locally
4. Update frontend components to display new field
5. Re-process failed jobs to backfill data

## Related Documentation

- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Pinecone Docs](https://docs.pinecone.io/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

## Support

- **Issues:** https://github.com/jsonresume/jsonresume.org/issues
- **Discussions:** https://github.com/jsonresume/jsonresume.org/discussions
- **Discord:** (TBD - post webhook URL when needed)

---

Last Updated: 2025-10-21
