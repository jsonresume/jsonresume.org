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

## How It Works

1. Your JSON Resume is fetched from [registry.jsonresume.org](https://registry.jsonresume.org)
2. An embedding is generated from your skills, experience, and summary
3. It's compared against AI-parsed job postings from HN's monthly "Who is Hiring?" threads
4. Jobs are ranked by semantic similarity and returned with structured data

## License

MIT
