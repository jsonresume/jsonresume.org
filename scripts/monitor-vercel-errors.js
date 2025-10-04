const fs = require('fs');
const crypto = require('crypto');
const { execSync } = require('child_process');

const DEPLOYMENT_URL = "https://jsonresume-org-homepage2-9zdb0ytck-ayan-das-projects-afcc9401.vercel.app";
const hashFile = 'error-hashes.json';

function getHash(str) {
  return crypto.createHash('sha1').update(str).digest('hex');
}

// Load existing hashes
let existingHashes = [];
if (fs.existsSync(hashFile)) {
  try {
    existingHashes = JSON.parse(fs.readFileSync(hashFile, 'utf-8'));
    if (!Array.isArray(existingHashes)) existingHashes = [];
  } catch {
    console.warn('Invalid hash file, resetting.');
    existingHashes = [];
  }
}

// Fetch logs (this will continuously stream runtime logs)
function fetchLogs() {
  try {
    return execSync(`vercel logs ${DEPLOYMENT_URL} --token ${process.env.VERCEL_TOKEN}`, { encoding: 'utf8' }).split('\n');
  } catch (err) {
    console.error('Failed to fetch logs:', err.message);
    return [];
  }
}

// Process logs
function processLogs(logs) {
  const errorBlocks = [];
  let block = [];

  logs.forEach(line => {
    if (line.toLowerCase().includes('error') || block.length) {
      block.push(line);
      if (line.trim() === '') {
        errorBlocks.push(block);
        block = [];
      }
    }
  });
  if (block.length) errorBlocks.push(block);

  const newErrors = [];
  errorBlocks.forEach(block => {
    const fullError = block.join('\n');
    const hash = getHash(fullError);
    if (!existingHashes.includes(hash)) {
      newErrors.push({ block, hash });
      existingHashes.push(hash);

      const title = `[Vercel Error] ${block[0].substring(0, 80)}`;
      const body = `## Auto-generated Error Report\n\n\`\`\`\n${fullError}\n\`\`\`\n\nGenerated automatically from Vercel logs.`;

      try {
        execSync(
          `gh issue create --repo a-y-a-n-das/jsonresume.org --title "${title}" --body "${body}" --label "vercel-error"`,
          { stdio: 'inherit' }
        );
        console.log(`Created GitHub issue for: ${block[0]}`);
      } catch (e) {
        console.error(`❌ Failed to create issue:`, e.message);
      }
    }
  });

  fs.writeFileSync(hashFile, JSON.stringify(existingHashes, null, 2));
  if (newErrors.length === 0) console.log('No new unique errors to report.');
}

// Main
const logs = fetchLogs();
processLogs(logs);
