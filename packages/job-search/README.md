# @jsonresume/job-search

Search Hacker News "Who is Hiring" jobs matched against your [JSON Resume](https://jsonresume.org).

Jobs are semantically matched using AI embeddings — your resume is compared against hundreds of monthly job postings to find the best fits.

## Setup

Get your API key at **https://jsonresume.org/api-keys** or via curl:

```bash
# 1. Get your API key (requires a resume at registry.jsonresume.org)
curl -s -X POST https://jsonresume.org/api/v1/keys \
  -H 'Content-Type: application/json' \
  -d '{"username":"YOUR_GITHUB_USERNAME"}'

# 2. Export it
export JSONRESUME_API_KEY=jr_yourname_xxxxx
```

## Usage

```bash
npx @jsonresume/job-search search
npx @jsonresume/job-search search --remote --min-salary 150
npx @jsonresume/job-search detail 181420
npx @jsonresume/job-search mark 181420 interested
npx @jsonresume/job-search me
npx @jsonresume/job-search update ./resume.json
npx @jsonresume/job-search help
```

## Commands

| Command | Description |
|---------|-------------|
| `search` | Find matching jobs (default) |
| `detail <id>` | Show full details for a job |
| `mark <id> <state>` | Mark a job: `interested`, `not_interested`, `applied`, `maybe`, `dismissed` |
| `me` | Show your resume summary |
| `update <file>` | Update your resume on the registry |
| `help` | Show help |

## Search Options

| Flag | Description |
|------|-------------|
| `--top N` | Number of results (default: 20, max: 100) |
| `--days N` | How far back to look (default: 30) |
| `--remote` | Remote jobs only |
| `--min-salary N` | Minimum salary in thousands |
| `--search TERM` | Keyword filter |
| `--interested` | Show only jobs marked interested |
| `--applied` | Show only jobs marked applied |
| `--json` | Output raw JSON |

## Claude Code Skill: `/jsonresume-hunt`

This package includes a [Claude Code skill](https://code.claude.com/docs/en/skills) that turns job searching into a guided, interactive experience.

### Install the skill

Copy the skill into your personal Claude Code skills directory:

```bash
# Install globally (works in any project)
mkdir -p ~/.claude/skills/jsonresume-hunt
cp node_modules/@jsonresume/job-search/skills/jsonresume-hunt/SKILL.md \
   ~/.claude/skills/jsonresume-hunt/SKILL.md

# Or link it
ln -sf $(npm root -g)/@jsonresume/job-search/skills/jsonresume-hunt \
   ~/.claude/skills/jsonresume-hunt
```

### Use it

In Claude Code, type:

```
/jsonresume-hunt
/jsonresume-hunt remote React jobs over $150k
```

The skill will:

1. **Interview you** — understand what you're looking for (role, salary, remote, company type, dealbreakers)
2. **Search & filter** — run multiple searches, deduplicate, tier results (Strong / Worth a look / Long shot)
3. **Deep research** — for top matches: company research, skill gap analysis, fit ratings
4. **Collect decisions** — walk through each job, mark interested/pass/maybe with reasons
5. **Create tracker** — generate `job-hunt-YYYY-MM-DD.md` with your full shortlist, research notes, and next steps
6. **Draft outreach** — personalized messages to HN posters referencing your experience

## Interactive TUI

Launch the full terminal UI for interactive browsing:

```bash
npx @jsonresume/job-search browse
```

Features:
- Tab-based views: All / Interested / Applied / Maybe / Passed
- Persistent filters (remote, salary, keyword, days) saved to disk
- AI-powered job summaries and batch ranking (requires `OPENAI_API_KEY`)
- Custom search profiles with AI reranking
- Vim-style navigation (`j`/`k`, `/` for searches, `f` for filters)

## How Search & Ranking Works

The system uses a multi-stage pipeline to match and rank jobs:

### Stage 1: Embedding Generation

Your JSON Resume is fetched from [registry.jsonresume.org](https://registry.jsonresume.org) and converted to text (label, summary, skills, work history). This text is embedded using OpenAI's `text-embedding-3-large` model into a 3072-dimensional vector.

Job postings from HN's monthly "Who is Hiring?" threads are parsed by GPT into structured data (title, company, skills, salary, remote, etc.) and embedded into the same vector space.

### Stage 2: Vector Similarity Search

Your resume embedding is compared against all job embeddings using cosine similarity via pgvector in Supabase. The top ~300 candidates are retrieved. This is fast (~200ms) but purely semantic — it finds jobs that "sound like" your resume.

### Stage 3: Custom Search Profiles (optional)

When you create a search profile (e.g., "I want to work on rockets in Texas"), two techniques boost the prompt's influence:

**HyDE (Hypothetical Document Embedding):** Instead of naively blending your prompt into resume text, the system uses GPT to generate a hypothetical ideal job posting matching your preferences. This creates a document-to-document comparison against real job embeddings, which is far more effective than query-to-document.

**Embedding Interpolation:** The resume and HyDE job posting are embedded separately, then combined as vectors: `0.65 * hyde_embedding + 0.35 * resume_embedding`. This gives your search intent 65% influence on the final ranking, versus the old approach where the resume dominated ~80% of the signal.

### Stage 4: LLM Reranking

For custom search profiles, the top 30 vector-matched results are re-scored by `gpt-4.1-mini`. Each job gets a 1-10 relevance score considering skill alignment, experience level, location/remote fit, and the user's stated preferences.

The final ranking combines both signals: `0.4 * normalized_vector_score + 0.6 * llm_score`. This lets the LLM override pure semantic similarity — a job that's a great vector match but contradicts your preferences gets pushed down.

In the TUI, this happens as a two-pass load: jobs appear instantly from vector search, then reshuffle when reranking completes in the background.

### Stage 5: Client-side Filtering

After server-side ranking, the TUI applies local filters (remote only, minimum salary, keyword search, posted within N days). These are persisted per search profile so switching profiles restores each one's filters.

## License

MIT
