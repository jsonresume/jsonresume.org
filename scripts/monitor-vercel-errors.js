const { execSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const HASH_FILE = path.join(__dirname, '.vercel-error-hashes.json');
const VERCEL_PROJECTS = [
  { name: 'jsonresume-org-registry', url: 'https://registry.jsonresume.org' },
];

function loadHashes() {
  if (fs.existsSync(HASH_FILE)) {
    return JSON.parse(fs.readFileSync(HASH_FILE, 'utf8'));
  }
  return {};
}

function saveHashes(hashes) {
  fs.writeFileSync(HASH_FILE, JSON.stringify(hashes, null, 2));
}

function createErrorFingerprint(message, stack = '') {
  const normalized = `${message}\n${stack}`
    .replace(/:\d+:\d+/g, ':X:X')
    .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/g, 'TIMESTAMP')
    .replace(/\b[a-f0-9]{32}\b/g, 'HASH')
    .replace(/\b[a-f0-9]{64}\b/g, 'HASH');

  return crypto
    .createHash('sha256')
    .update(normalized)
    .digest('hex')
    .slice(0, 16);
}

async function fetchVercelLogs(project) {
  try {
    // Use gtimeout (macOS) or timeout (Linux) with SIGKILL to force termination after 5 seconds
    const timeoutCmd = execSync('which gtimeout 2>/dev/null || which timeout', {
      encoding: 'utf8',
    }).trim();
    const result = execSync(
      `${timeoutCmd} -s SIGKILL 5 bash -c "VERCEL_TOKEN=${process.env.VERCEL_TOKEN} vercel logs ${project.url} --json 2>&1" || true`,
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
    );

    return result;
  } catch (error) {
    console.error(`Failed to fetch logs for ${project.name}:`, error.message);
    return '';
  }
}

function parseErrors(logs) {
  const errors = [];
  const lines = logs.split('\n');

  // Skip CLI header lines - only parse actual log output
  const cliHeaders =
    /^(Vercel CLI|Fetching|Displaying|waiting for|Error: No existing credentials)/i;

  for (const line of lines) {
    if (!line.trim()) continue;

    // Skip Vercel CLI informational/error messages
    if (cliHeaders.test(line)) continue;

    try {
      const log = JSON.parse(line);

      // Filter for error-level logs or logs containing error keywords
      const isError =
        log.level === 'error' ||
        (log.message &&
          log.message.match(/error|exception|failed|fatal/i) &&
          !log.message.match(/successfully|resolved/i));

      if (isError) {
        errors.push({
          message: log.message || line,
          stack: log.stack ? [log.stack] : [],
          timestamp: log.timestamp || new Date().toISOString(),
        });
      }
    } catch (e) {
      // If not JSON, skip it - we only want actual JSON log entries
      // This prevents CLI messages from being treated as errors
      continue;
    }
  }

  return errors;
}

function searchExistingIssue(fingerprint) {
  try {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    const query = encodeURIComponent(
      `repo:${owner}/${repo} is:issue label:auto-error "${fingerprint}" in:body`
    );
    const result = execSync(
      `curl -sS --max-time 10 -H "Authorization: Bearer ${process.env.GH_TOKEN}" "https://api.github.com/search/issues?q=${query}&per_page=1"`,
      { encoding: 'utf8' }
    );
    const data = JSON.parse(result);
    return data.items?.length > 0
      ? { number: data.items[0].number, state: data.items[0].state }
      : null;
  } catch (error) {
    console.error('Failed to search issues:', error.message);
    return null;
  }
}

function createIssue(error, fingerprint, projectName) {
  const title = `[Auto] ${error.message.substring(0, 80)}`;
  const stackTrace = error.stack.join('\n') || 'No stack trace available';

  const body = `## Automated Error Report

**Error Fingerprint:** \`${fingerprint}\`
**Project:** ${projectName}
**First Seen:** ${error.timestamp}
**Environment:** Production

### Error Message
\`\`\`
${error.message}
\`\`\`

### Stack Trace
\`\`\`
${stackTrace}
\`\`\`

---
*This issue was automatically created by the Vercel Error Monitor*`;

  try {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    const payload = JSON.stringify({
      title,
      body,
      labels: ['auto-error', 'bug', 'vercel-logs'],
    });

    const result = execSync(
      `curl -sS --max-time 30 -X POST -H "Authorization: Bearer ${
        process.env.GH_TOKEN
      }" -H "Content-Type: application/json" -d '${payload.replace(
        /'/g,
        "'\\''"
      )}' "https://api.github.com/repos/${owner}/${repo}/issues"`,
      { encoding: 'utf8' }
    );

    const issue = JSON.parse(result);
    return issue.html_url || 'Issue created';
  } catch (error) {
    console.error('Failed to create issue:', error.message);
    throw error;
  }
}

function updateIssueOccurrence(issueNumber, fingerprint) {
  try {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    const comment = `This error occurred again at ${new Date().toISOString()}`;
    const payload = JSON.stringify({ body: comment });

    execSync(
      `curl -sS --max-time 10 -X POST -H "Authorization: Bearer ${
        process.env.GH_TOKEN
      }" -H "Content-Type: application/json" -d '${payload.replace(
        /'/g,
        "'\\''"
      )}' "https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments"`,
      { encoding: 'utf8' }
    );
  } catch (error) {
    console.error(`Failed to update issue #${issueNumber}:`, error.message);
  }
}

async function main() {
  console.log('Starting Vercel error monitoring...');

  if (!process.env.VERCEL_TOKEN) {
    console.error('❌ VERCEL_TOKEN environment variable is required');
    process.exit(1);
  }

  if (!process.env.GITHUB_REPOSITORY) {
    console.error('❌ GITHUB_REPOSITORY environment variable is required');
    process.exit(1);
  }

  const errorHashes = loadHashes();
  let newErrorsFound = 0;
  let duplicatesSkipped = 0;

  for (const project of VERCEL_PROJECTS) {
    console.log(`\nFetching logs for ${project.name}...`);
    const logs = await fetchVercelLogs(project);

    if (!logs) {
      console.log(`No logs available for ${project.name}`);
      continue;
    }

    const errors = parseErrors(logs);
    console.log(`Found ${errors.length} potential errors in ${project.name}`);

    for (const error of errors) {
      const fingerprint = createErrorFingerprint(
        error.message,
        error.stack.join('\n')
      );

      if (errorHashes[fingerprint]) {
        const existingIssue = searchExistingIssue(fingerprint);
        if (existingIssue && existingIssue.state === 'open') {
          updateIssueOccurrence(existingIssue.number, fingerprint);
          duplicatesSkipped++;
        }
        continue;
      }

      try {
        const issueUrl = createIssue(error, fingerprint, project.name);
        errorHashes[fingerprint] = {
          created: new Date().toISOString(),
          issueUrl,
        };
        newErrorsFound++;
        console.log(`Created issue: ${issueUrl}`);
      } catch (error) {
        console.error(`Failed to create issue:`, error.message);
      }
    }
  }

  saveHashes(errorHashes);

  console.log(`\n✅ Monitoring complete:`);
  console.log(`- New errors found: ${newErrorsFound}`);
  console.log(`- Duplicates skipped: ${duplicatesSkipped}`);
}

main().catch(console.error);
