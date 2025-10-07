const {
  loadHashes,
  saveHashes,
  createErrorFingerprint,
} = require('./utils/hash-storage');
const { fetchVercelLogs, parseErrors } = require('./utils/vercel-logs');
const {
  searchExistingIssue,
  createIssue,
  updateIssueOccurrence,
} = require('./utils/github-issues');

const VERCEL_PROJECTS = [
  { name: 'jsonresume-org-registry', url: 'https://registry.jsonresume.org' },
];

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
