// scripts/sentry-to-github.js
import fetch from 'node-fetch';



const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN;
const SENTRY_ORG = process.env.SENTRY_ORG;
const SENTRY_PROJECT = process.env.SENTRY_PROJECT;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.MY_GITHUB_REPO; // "owner/repo" format

console.log(`${SENTRY_AUTH_TOKEN}`);
// Sentry issues
async function fetchSentryIssues() {
  const url = `https://sentry.io/api/0/projects/${SENTRY_ORG}/${SENTRY_PROJECT}/issues/?query=is:unresolved&statsPeriod=24h`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${SENTRY_AUTH_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Sentry fetch failed: ${res.statusText}`);
  return res.json();
}

// Check if GitHub issue exists by title
async function githubIssueExists(title) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/issues?state=open&per_page=100`;
  const res = await fetch(url, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` },
  });
  const issues = await res.json();
  return issues.some((issue) => issue.title === title);
}

// Create GitHub issue
async function createGithubIssue(title, body) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/issues`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, body }),
  });
  if (!res.ok) throw new Error(`GitHub issue creation failed: ${res.statusText}`);
  const data = await res.json();
  console.log(`Created GitHub issue #${data.number}: ${title}`);
}

// Main
(async () => {
  try {
    const sentryIssues = await fetchSentryIssues();

    for (const issue of sentryIssues) {
      const title = issue.title;
      const body = `Sentry Issue: [${title}](${issue.permalink})\n\nLast seen: ${issue.lastSeen}\nPlatform: ${issue.platform}`;
      
      const exists = await githubIssueExists(title);
      if (!exists) {
        await createGithubIssue(title, body);
      } else {
        console.log(`Issue already exists: ${title}`);
      }
    }
  } catch (err) {
    console.error("Error in Sentry -> GitHub workflow:", err);
  }
})();


