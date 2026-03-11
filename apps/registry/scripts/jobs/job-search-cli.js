#!/usr/bin/env node

/**
 * JSON Resume Job Search CLI
 *
 * Usage:
 *   export JSONRESUME_API_KEY=jr_xxxx
 *   node job-search-cli.js [command] [options]
 *
 * Commands:
 *   search        Find matching jobs (default)
 *   detail <id>   Show full details for a job
 *   mark <id> <state>  Mark a job (interested/pass/applied/hidden)
 *   unmark <id>   Remove a job's state
 *   me            Show your resume summary
 *
 * Options:
 *   --top N         Number of results (default 20)
 *   --days N        How far back to look (default 30)
 *   --remote        Remote jobs only
 *   --min-salary N  Minimum salary in thousands
 *   --search TERM   Keyword filter
 *   --interested    Show only jobs marked interested
 *   --applied       Show only jobs marked applied
 *   --json          Output raw JSON
 *   --base-url URL  API base URL (default: https://jsonresume.org)
 */

const BASE_URL =
  getArg('--base-url') || process.env.JSONRESUME_BASE_URL || 'https://jsonresume.org';
const API_KEY = process.env.JSONRESUME_API_KEY;

function getArg(name) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return null;
  return process.argv[idx + 1];
}

function hasFlag(name) {
  return process.argv.includes(name);
}

async function api(path, options = {}) {
  const url = `${BASE_URL}/api/v1${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
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
    pass: '✗',
    hidden: '👁',
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
    `\n Found ${filtered.length} matching jobs (last ${params.get('days')} days)\n`
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

  console.log(
    '\n Commands: detail <id> | mark <id> interested|pass|applied | unmark <id>\n'
  );
}

async function cmdDetail() {
  const id = process.argv[3];
  if (!id) {
    console.error('Usage: detail <job_id>');
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
  console.log(`  State:      ${job.state ? `${stateIcon(job.state)} ${job.state}` : 'none'}`);
  console.log(`  HN URL:     ${job.url || '—'}`);

  if (job.description) {
    console.log(`\n  Description:\n  ${job.description}`);
  }

  if (job.skills?.length) {
    console.log(
      `\n  Skills: ${job.skills.map((s) => s.name).join(', ')}`
    );
  }

  if (job.responsibilities?.length) {
    console.log(`\n  Responsibilities:`);
    job.responsibilities.forEach((r) => console.log(`    • ${r}`));
  }

  if (job.qualifications?.length) {
    console.log(`\n  Qualifications:`);
    job.qualifications.forEach((q) => console.log(`    • ${q}`));
  }

  if (job.full_description) {
    console.log(`\n  Full Description:\n  ${job.full_description}`);
  }
  console.log('');
}

async function cmdMark() {
  const id = process.argv[3];
  const state = process.argv[4];

  if (!id || !state) {
    console.error('Usage: mark <job_id> <interested|pass|applied|hidden>');
    process.exit(1);
  }

  const result = await api(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ state }),
  });

  console.log(`${stateIcon(result.state)} Job #${result.id} marked as ${result.state}`);
}

async function cmdUnmark() {
  const id = process.argv[3];
  if (!id) {
    console.error('Usage: unmark <job_id>');
    process.exit(1);
  }

  await api(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ state: null }),
  });

  console.log(`Job #${id} unmarked`);
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
    `  ${r.basics?.location?.city || ''}, ${r.basics?.location?.countryCode || ''}`
  );
  console.log(`\n  Skills: ${(r.skills || []).map((s) => s.name).join(', ')}`);
  console.log(`  Work: ${(r.work || []).length} entries`);
  console.log(`  Projects: ${(r.projects || []).length} entries`);
  console.log('');
}

// ── Main ───────────────────────────────────────────────────

async function main() {
  if (!API_KEY) {
    console.error(
      'Set JSONRESUME_API_KEY environment variable.\n' +
        'Generate one: curl -X POST https://jsonresume.org/api/v1/keys -d \'{"username":"your-github-username"}\''
    );
    process.exit(1);
  }

  const cmd = process.argv[2] || 'search';

  switch (cmd) {
    case 'search':
      return cmdSearch();
    case 'detail':
      return cmdDetail();
    case 'mark':
      return cmdMark();
    case 'unmark':
      return cmdUnmark();
    case 'me':
      return cmdMe();
    default:
      console.error(`Unknown command: ${cmd}`);
      console.error('Commands: search | detail <id> | mark <id> <state> | unmark <id> | me');
      process.exit(1);
  }
}

main().catch((e) => {
  console.error(`Fatal: ${e.message}`);
  process.exit(1);
});
