#!/usr/bin/env node

/**
 * @jsonresume/job-search — Search HN jobs matched to your JSON Resume
 *
 * Just run:  npx @jsonresume/jobs
 */

const VERSION = '0.6.0';

const BASE_URL =
  getArg('--base-url') ||
  process.env.JSONRESUME_BASE_URL ||
  'https://registry.jsonresume.org';

// ── Arg parsing ────────────────────────────────────────────

function getArg(name) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return null;
  return process.argv[idx + 1];
}

function hasFlag(name) {
  return process.argv.includes(name);
}

// ── API client ─────────────────────────────────────────────

let _apiKey;

async function getApiKey() {
  if (_apiKey) return _apiKey;
  const { ensureApiKey } = await import('../src/auth.js');
  _apiKey = await ensureApiKey(BASE_URL);
  return _apiKey;
}

async function api(path, options = {}) {
  const apiKey = await getApiKey();
  const url = `${BASE_URL}/api/v1${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    console.error(`Error: ${data.error || res.statusText}`);
    process.exit(1);
  }
  return data;
}

// ── Formatters ─────────────────────────────────────────────

function formatSalary(salary, salaryUsd) {
  if (salaryUsd) return `$${Math.round(salaryUsd / 1000)}k`;
  if (salary) return salary;
  return '—';
}

function formatLocation(loc, remote) {
  const parts = [];
  if (loc?.city) parts.push(loc.city);
  if (loc?.countryCode) parts.push(loc.countryCode);
  if (remote) parts.push(`(${remote})`);
  return parts.join(', ') || '—';
}

function stateIcon(state) {
  const icons = {
    interested: '⭐',
    applied: '📨',
    not_interested: '✗',
    dismissed: '👁',
    maybe: '?',
  };
  return icons[state] || ' ';
}

// ── Commands ───────────────────────────────────────────────

async function cmdSearch() {
  const params = new URLSearchParams();
  params.set('top', getArg('--top') || '20');
  params.set('days', getArg('--days') || '30');
  if (hasFlag('--remote')) params.set('remote', 'true');
  if (getArg('--min-salary')) params.set('min_salary', getArg('--min-salary'));
  if (getArg('--search')) params.set('search', getArg('--search'));

  const { jobs } = await api(`/jobs?${params}`);

  let filtered = jobs;
  if (hasFlag('--interested'))
    filtered = jobs.filter((j) => j.state === 'interested');
  if (hasFlag('--applied'))
    filtered = jobs.filter((j) => j.state === 'applied');

  if (hasFlag('--json')) {
    console.log(JSON.stringify(filtered, null, 2));
    return;
  }

  if (filtered.length === 0) {
    console.log('No matching jobs found.');
    return;
  }

  console.log(
    `\n Found ${filtered.length} matching jobs (last ${params.get(
      'days'
    )} days)\n`
  );
  console.log(
    ' ' +
      'St'.padEnd(3) +
      'Score'.padEnd(7) +
      'ID'.padEnd(8) +
      'Title'.padEnd(35) +
      'Company'.padEnd(25) +
      'Location'.padEnd(25) +
      'Salary'.padEnd(10)
  );
  console.log(' ' + '─'.repeat(112));

  for (const j of filtered) {
    const line =
      ' ' +
      stateIcon(j.state).padEnd(3) +
      String(j.similarity).padEnd(7) +
      String(j.id).padEnd(8) +
      (j.title || '').slice(0, 33).padEnd(35) +
      (j.company || '').slice(0, 23).padEnd(25) +
      formatLocation(j.location, j.remote).slice(0, 23).padEnd(25) +
      formatSalary(j.salary, j.salary_usd).padEnd(10);
    console.log(line);
  }
  console.log('');
}

async function cmdDetail() {
  const id = process.argv[3];
  if (!id) {
    console.error('Usage: jsonresume-jobs detail <job_id>');
    process.exit(1);
  }

  const job = await api(`/jobs/${id}`);

  if (hasFlag('--json')) {
    console.log(JSON.stringify(job, null, 2));
    return;
  }

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`  ${job.title || 'Unknown'} at ${job.company || 'Unknown'}`);
  console.log(`${'═'.repeat(70)}`);
  console.log(`  ID:         ${job.id}`);
  console.log(`  Location:   ${formatLocation(job.location, job.remote)}`);
  console.log(`  Salary:     ${formatSalary(job.salary, job.salary_usd)}`);
  console.log(`  Type:       ${job.type || '—'}`);
  console.log(`  Experience: ${job.experience || '—'}`);
  console.log(`  Posted:     ${job.posted_at || '—'}`);
  console.log(
    `  State:      ${
      job.state ? `${stateIcon(job.state)} ${job.state}` : 'none'
    }`
  );
  console.log(`  HN URL:     ${job.url || '—'}`);

  if (job.description) {
    console.log(`\n  Description:\n  ${job.description}`);
  }

  if (job.skills?.length) {
    console.log(`\n  Skills: ${job.skills.map((s) => s.name).join(', ')}`);
  }

  if (job.responsibilities?.length) {
    console.log(`\n  Responsibilities:`);
    job.responsibilities.forEach((r) => console.log(`    • ${r}`));
  }

  if (job.qualifications?.length) {
    console.log(`\n  Qualifications:`);
    job.qualifications.forEach((q) => console.log(`    • ${q}`));
  }
  console.log('');
}

async function cmdMark() {
  const id = process.argv[3];
  const state = process.argv[4];
  const feedback = getArg('--feedback');

  if (!id || !state) {
    console.error(
      'Usage: jsonresume-jobs mark <job_id> <interested|not_interested|applied|dismissed|maybe> [--feedback "reason"]'
    );
    process.exit(1);
  }

  const body = { state };
  if (feedback) body.feedback = feedback;

  const result = await api(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  const desc = result.job_title
    ? `${result.job_title} at ${result.job_company}`
    : `#${result.id}`;
  console.log(`${stateIcon(result.state)} Marked ${desc} as ${result.state}`);
}

async function cmdMe() {
  const data = await api('/me');

  if (hasFlag('--json')) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  const r = data.resume;
  console.log(`\n  ${r.basics?.name} (${data.username})`);
  console.log(`  ${r.basics?.label || ''}`);
  console.log(
    `  ${r.basics?.location?.city || ''}, ${
      r.basics?.location?.countryCode || ''
    }`
  );
  console.log(`\n  Skills: ${(r.skills || []).map((s) => s.name).join(', ')}`);
  console.log(`  Work: ${(r.work || []).length} entries`);
  console.log(`  Projects: ${(r.projects || []).length} entries`);
  console.log('');
}

async function cmdUpdate() {
  const filePath = process.argv[3];
  if (!filePath) {
    console.error('Usage: jsonresume-jobs update <path-to-resume.json>');
    process.exit(1);
  }

  const fs = await import('node:fs');
  const path = await import('node:path');
  const resolved = path.resolve(filePath);

  let resume;
  try {
    const raw = fs.readFileSync(resolved, 'utf-8');
    resume = JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${resolved}: ${err.message}`);
    process.exit(1);
  }

  if (!resume.basics) {
    console.error('Invalid resume — must have a "basics" section.');
    process.exit(1);
  }

  const result = await api('/resume', {
    method: 'PUT',
    body: JSON.stringify(resume),
  });

  console.log(`Resume updated for ${result.username}.`);
}

async function cmdLogout() {
  const { loadConfig, saveConfig } = await import('../src/auth.js');
  const config = loadConfig();
  const username = config.username || 'unknown';
  saveConfig({});
  console.log(`Logged out (removed saved key for ${username}).`);
}

function cmdHelp() {
  console.log(`
jsonresume-jobs v${VERSION} — Search HN "Who is Hiring" jobs matched to your JSON Resume

QUICK START
  npx @jsonresume/jobs              Launch the interactive TUI (logs in automatically)

COMMANDS
  (default)                         Interactive TUI with AI features
  search                            Find matching jobs (table output)
  detail <id>                       Show full details for a job
  mark <id> <state>                 Mark a job's state
  me                                Show your resume summary
  update <file>                     Update your resume on the registry
  logout                            Remove saved API key
  help                              Show this help message

SEARCH OPTIONS
  --top N                           Number of results (default: 20, max: 100)
  --days N                          How far back to look (default: 30)
  --remote                          Remote jobs only
  --min-salary N                    Minimum salary in thousands (e.g. 150)
  --search TERM                     Keyword filter (searches title, company, skills)
  --interested                      Show only jobs you marked interested
  --applied                         Show only jobs you marked applied

MARK STATES
  interested                        You want this job
  not_interested                    Not for you
  applied                           You've applied
  maybe                             Considering it
  dismissed                         Hide from results

GLOBAL OPTIONS
  --json                            Output raw JSON (for piping / Claude Code)
  --base-url URL                    API base URL (default: https://registry.jsonresume.org)
  --feedback "reason"               Add a reason when marking (with mark command)

ENVIRONMENT
  JSONRESUME_API_KEY                Your API key (optional — auto-login if not set)
  OPENAI_API_KEY                    Enable AI features (summaries, reranking)
  JSONRESUME_BASE_URL               API base URL override

EXAMPLES
  npx @jsonresume/jobs                                              # TUI
  npx @jsonresume/jobs search --remote --min-salary 150             # CLI search
  npx @jsonresume/jobs detail 181420                                # Job details
  npx @jsonresume/jobs mark 181420 interested --feedback "great"    # Mark job
`);
}

// ── Main ───────────────────────────────────────────────────

async function main() {
  const cmd = process.argv[2] || '';

  if (cmd === 'help' || cmd === '--help' || cmd === '-h') {
    return cmdHelp();
  }

  if (cmd === '--version' || cmd === '-v') {
    console.log(VERSION);
    return;
  }

  if (cmd === 'logout') {
    return cmdLogout();
  }

  switch (cmd) {
    case 'search':
      return cmdSearch();
    case 'detail':
      return cmdDetail();
    case 'mark':
      return cmdMark();
    case 'me':
      return cmdMe();
    case 'update':
      return cmdUpdate();
    case 'browse':
    case 'tui':
    case '':
    default: {
      // Default: launch TUI
      const apiKey = await getApiKey();
      const { default: runTUI } = await import('../src/tui/App.js');
      return runTUI({ baseUrl: BASE_URL, apiKey });
    }
  }
}

main().catch((e) => {
  console.error(`Fatal: ${e.message}`);
  process.exit(1);
});
