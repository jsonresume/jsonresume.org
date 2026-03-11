# @jsonresume/job-search

Search Hacker News "Who is Hiring" jobs matched against your [JSON Resume](https://jsonresume.org).

Jobs are semantically matched using AI embeddings — your resume is compared against hundreds of monthly job postings to find the best fits.

## Setup

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
npx @jsonresume/job-search help
```

## Commands

| Command | Description |
|---------|-------------|
| `search` | Find matching jobs (default) |
| `detail <id>` | Show full details for a job |
| `mark <id> <state>` | Mark a job: `interested`, `not_interested`, `applied`, `maybe`, `dismissed` |
| `me` | Show your resume summary |
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

## Claude Code Integration

If you use [Claude Code](https://docs.anthropic.com/en/docs/claude-code), this repo includes a `/jobs` skill that wraps the CLI for interactive job searching:

```
/jobs find me remote React jobs paying over $150k
```

## How It Works

1. Your JSON Resume is fetched from [registry.jsonresume.org](https://registry.jsonresume.org)
2. An embedding is generated from your skills, experience, and summary
3. It's compared against AI-parsed job postings from HN's monthly "Who is Hiring?" threads
4. Jobs are ranked by semantic similarity and returned with structured data

## License

MIT
