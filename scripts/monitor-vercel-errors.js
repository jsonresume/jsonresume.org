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

function fetchVercelLogs(project) {
  try {
    // Set VERCEL_TOKEN as environment variable - CLI reads it automatically
    // Use --json for structured output, timeout after 5 seconds to get recent logs
    const cmd = `VERCEL_TOKEN=${process.env.VERCEL_TOKEN} timeout 5 vercel logs ${project.url} --json 2>&1 || true`;
    return execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  } catch (error) {
    console.error(`Failed to fetch logs for ${project.name}:`, error.message);
    return '';
  }
}

function parseErrors(logs) {
  const errors = [];
  const lines = logs.split('\n');

  for (const line of lines) {
    if (!line.trim()) continue;

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
      // If not JSON, fall back to text parsing for error keywords
      if (
        line.match(/error|exception|failed|fatal/i) &&
        !line.match(/successfully|resolved/i)
      ) {
        errors.push({
          message: line.trim(),
          stack: [],
          timestamp: new Date().toISOString(),
        });
      }
    }
  }

  return errors;
}

function searchExistingIssue(fingerprint) {
  try {
    const result = execSync(
      `gh issue list --repo ${process.env.GITHUB_REPOSITORY} --label auto-error --search "Error Fingerprint: ${fingerprint}" --json number,state --limit 1`,
      { encoding: 'utf8' }
    );
    const issues = JSON.parse(result);
    return issues.length > 0 ? issues[0] : null;
  } catch (error) {
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

  const bodyFile = `/tmp/issue-body-${Date.now()}.md`;
  fs.writeFileSync(bodyFile, body);

  try {
    const result = execSync(
      `gh issue create --repo ${
        process.env.GITHUB_REPOSITORY
      } --title "${title.replace(
        /"/g,
        '\\"'
      )}" --body-file ${bodyFile} --label auto-error --label bug --label vercel-logs`,
      { encoding: 'utf8' }
    );
    fs.unlinkSync(bodyFile);
    return result.trim();
  } catch (error) {
    fs.unlinkSync(bodyFile);
    throw error;
  }
}

function updateIssueOccurrence(issueNumber, fingerprint) {
  try {
    const comment = `This error occurred again at ${new Date().toISOString()}`;
    execSync(
      `gh issue comment ${issueNumber} --repo ${process.env.GITHUB_REPOSITORY} --body "${comment}"`,
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
    const logs = fetchVercelLogs(project);

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
