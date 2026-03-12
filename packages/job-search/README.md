# @jsonresume/job-search

[![npm version](https://img.shields.io/npm/v/@jsonresume/job-search)](https://www.npmjs.com/package/@jsonresume/job-search)
[![license](https://img.shields.io/npm/l/@jsonresume/job-search)](./LICENSE)
[![node](https://img.shields.io/node/v/@jsonresume/job-search)](https://nodejs.org)

Search Hacker News "Who is Hiring" jobs matched against your [JSON Resume](https://jsonresume.org). Jobs are semantically ranked using AI embeddings — your resume is compared against hundreds of monthly job postings to surface the best fits.

## Quick Start

```bash
npx @jsonresume/jobs
```

That's it. The CLI will walk you through login if it's your first time — all you need is a resume hosted at [registry.jsonresume.org](https://registry.jsonresume.org).

## Prerequisites

- **Node.js** >= 18
- A JSON Resume hosted on the [JSON Resume Registry](https://registry.jsonresume.org) (free, backed by your GitHub Gist)
- *(Optional)* `OPENAI_API_KEY` — enables AI summaries and batch ranking in the TUI

## Installation

Run directly with npx (no install needed):

```bash
npx @jsonresume/jobs
```

Or install globally:

```bash
npm install -g @jsonresume/job-search
jsonresume-jobs
```

## Authentication

On first run, the CLI prompts for your GitHub username, verifies your resume exists on the registry, generates an API key, and saves it to `~/.jsonresume/config.json`. Future runs skip straight to the TUI.

You can also authenticate manually:

```bash
# Via environment variable
export JSONRESUME_API_KEY=jr_yourname_xxxxx

# Generate a key via curl
curl -s -X POST https://registry.jsonresume.org/api/v1/keys \
  -H 'Content-Type: application/json' \
  -d '{"username":"YOUR_GITHUB_USERNAME"}'
```

To clear saved credentials:

```bash
npx @jsonresume/jobs logout
```

## Interactive TUI

The default command launches a full terminal interface for browsing and managing jobs.

```bash
npx @jsonresume/jobs
```

### Features

- **Tab-based views** — All / Interested / Applied / Maybe / Passed
- **Persistent filters** — remote, salary, keyword, days — saved to disk per search profile
- **Custom search profiles** — create targeted searches like "remote React jobs in climate tech" with AI-powered reranking
- **Two-pass loading** — results appear instantly from vector search, then reshuffle when LLM reranking completes
- **AI summaries** — per-job summaries and batch ranking (requires `OPENAI_API_KEY`)
- **Vim-style navigation** — `j`/`k` movement, `/` for search profiles, `f` for filters

### Keyboard Shortcuts

#### List View

| Key | Action |
|-----|--------|
| `j` / `↓` | Move down |
| `k` / `↑` | Move up |
| `Enter` | View job details |
| `i` | Mark interested |
| `x` | Mark applied |
| `m` | Mark maybe |
| `p` | Mark passed |
| `Tab` | Next tab |
| `Shift+Tab` | Previous tab |
| `f` | Open filters |
| `/` | Open search profiles |
| `Space` | AI summary |
| `S` | AI batch review |
| `R` | Force refresh |
| `q` | Quit |

#### Detail View

| Key | Action |
|-----|--------|
| `j` / `↓` | Scroll down |
| `k` / `↑` | Scroll up |
| `o` | Open HN post in browser |
| `i` / `x` / `m` / `p` | Mark job state |
| `Space` | AI summary |
| `Esc` | Back to list |

#### Filters & Search Profiles

| Key | Action |
|-----|--------|
| `a` | Add filter |
| `d` | Delete filter / search profile |
| `n` | New search profile |
| `Enter` | Select / edit |
| `Esc` | Close |

## CLI Commands

For scripting and pipelines, the CLI also supports direct commands:

```bash
npx @jsonresume/jobs search                              # Find matching jobs
npx @jsonresume/jobs search --remote --min-salary 150    # Remote, $150k+ salary
npx @jsonresume/jobs search --search "rust"              # Keyword filter
npx @jsonresume/jobs detail 181420                       # Full job details
npx @jsonresume/jobs mark 181420 interested              # Mark a job
npx @jsonresume/jobs me                                  # Your resume summary
npx @jsonresume/jobs update ./resume.json                # Update your resume
npx @jsonresume/jobs help                                # All options
```

### Command Reference

| Command | Description |
|---------|-------------|
| *(default)* | Launch interactive TUI |
| `search` | Find matching jobs (table output) |
| `detail <id>` | Show full details for a job |
| `mark <id> <state>` | Set job state: `interested`, `not_interested`, `applied`, `maybe`, `dismissed` |
| `me` | Show your resume summary |
| `update <file>` | Upload a new version of your resume |
| `logout` | Remove saved API key |
| `help` | Show help |

### Search Options

| Flag | Description |
|------|-------------|
| `--top N` | Number of results (default: 20, max: 100) |
| `--days N` | How far back to look (default: 30) |
| `--remote` | Remote jobs only |
| `--min-salary N` | Minimum salary in thousands (e.g. `150` = $150k) |
| `--search TERM` | Keyword filter (title, company, skills) |
| `--interested` | Show only jobs marked interested |
| `--applied` | Show only jobs marked applied |
| `--json` | Output raw JSON for piping |

### Mark States

| State | Icon | Meaning |
|-------|------|---------|
| `interested` | ⭐ | You want this job |
| `applied` | 📨 | You've applied |
| `maybe` | ? | Considering it |
| `not_interested` | ✗ | Not for you |
| `dismissed` | 👁 | Hide from results |

## How Ranking Works

The system uses a five-stage pipeline to match and rank jobs against your resume.

### Stage 1: Embedding Generation

Your JSON Resume is fetched from [registry.jsonresume.org](https://registry.jsonresume.org) and converted to text (label, summary, skills, work history). This text is embedded using OpenAI's `text-embedding-3-large` model into a 3072-dimensional vector.

Job postings from HN's monthly "Who is Hiring?" threads are parsed by GPT into structured data (title, company, skills, salary, remote, location) and embedded into the same vector space.

### Stage 2: Vector Similarity Search

Your resume embedding is compared against all job embeddings using cosine similarity via [pgvector](https://github.com/pgvector/pgvector). The top ~300 candidates are retrieved in ~200ms. This is purely semantic — it finds jobs that "sound like" your resume.

### Stage 3: Custom Search Profiles

When you create a search profile (e.g. "remote React roles at climate tech startups"), two techniques boost the prompt's influence:

**HyDE (Hypothetical Document Embedding):** Instead of naively blending your prompt into resume text, the system generates a hypothetical ideal job posting matching your preferences. This creates a document-to-document comparison, which is far more effective than query-to-document matching.

**Embedding Interpolation:** The resume and HyDE vectors are combined: `0.65 × hyde + 0.35 × resume`. This gives your search intent 65% influence on ranking, versus plain resume matching where the resume dominates ~80% of the signal.

### Stage 4: LLM Reranking

For custom searches, the top 30 vector results are re-scored by `gpt-4.1-mini`. Each job receives a 1–10 relevance score considering skill alignment, experience level, location fit, and your stated preferences.

The final score blends both signals: `0.4 × vector_score + 0.6 × llm_score`. This lets the LLM override semantic similarity — a job that's a great vector match but contradicts your preferences gets pushed down.

In the TUI, this runs as a two-pass load: jobs appear instantly from vector search, then reshuffle when reranking finishes in the background.

### Stage 5: Client-side Filtering

After server-side ranking, the TUI applies local filters (remote only, minimum salary, keyword, days). Filters are persisted per search profile, so switching profiles restores each one's filters.

## Claude Code Skill

This package includes a [Claude Code skill](https://docs.anthropic.com/en/docs/claude-code/skills) that turns job searching into a guided, AI-assisted experience.

### Install

```bash
mkdir -p ~/.claude/skills/jsonresume-hunt
cp node_modules/@jsonresume/job-search/skills/jsonresume-hunt/SKILL.md \
   ~/.claude/skills/jsonresume-hunt/SKILL.md
```

### Use

In Claude Code, type:

```
/jsonresume-hunt
/jsonresume-hunt remote React jobs over $150k
```

The skill interviews you about what you're looking for, runs multiple searches, researches top companies, does skill gap analysis, collects your decisions, and generates a markdown tracker with your shortlist and outreach drafts.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `JSONRESUME_API_KEY` | No | API key (auto-generated on first run if not set) |
| `OPENAI_API_KEY` | No | Enables AI summaries and batch ranking in TUI |
| `JSONRESUME_BASE_URL` | No | API base URL override (default: `https://registry.jsonresume.org`) |

## Data Storage

| Path | Contents |
|------|----------|
| `~/.jsonresume/config.json` | API key and username |
| `~/.jsonresume/filters.json` | Saved filter presets per search profile |
| `~/.jsonresume/cache/` | Cached job results (auto-expires) |

## Contributing

This package is part of the [jsonresume.org](https://github.com/jsonresume/jsonresume.org) monorepo.

```bash
git clone https://github.com/jsonresume/jsonresume.org.git
cd jsonresume.org
pnpm install
node packages/job-search/bin/cli.js help
```

See the repo root [CLAUDE.md](../../CLAUDE.md) for code standards and contribution guidelines.

## License

[MIT](./LICENSE)
