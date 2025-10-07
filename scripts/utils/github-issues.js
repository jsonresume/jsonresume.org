const { execSync } = require('child_process');

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

module.exports = {
  searchExistingIssue,
  createIssue,
  updateIssueOccurrence,
};
