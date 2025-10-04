const fs = require('fs');
const crypto = require('crypto');
const { execSync } = require('child_process');

const DEPLOYMENT_NAME = process.env.VERCEL_DEPLOYMENT_NAME || "jsonresume-org-homepage2";
const hashFile = 'error-hashes.json';

// Fetch logs
function fetchLogs() {
  try {
    const output = execSync(`vercel logs ${DEPLOYMENT_NAME} --token ${process.env.VERCEL_TOKEN}`, { encoding: "utf8" });
    return output.split("\n");
  } catch (err) {
    console.error("Failed to fetch logs:", err.message);
    return [];
  }
}

const logs = fetchLogs();

// Collect multi-line error blocks
const errorBlocks = [];
let block = [];
logs.forEach(line => {
  if (line.toLowerCase().includes("warn") || block.length) { //error or warn
    block.push(line);
    if (line.trim() === "") {
      errorBlocks.push(block);
      block = [];
    }
  }
});
if (block.length) errorBlocks.push(block);

// Load existing hashes
let existingHashes = [];
if (fs.existsSync(hashFile)) {
  try {
    const data = JSON.parse(fs.readFileSync(hashFile, 'utf-8'));
    existingHashes = Array.isArray(data) ? data : [];
  } catch {
    console.warn('Invalid hash file, resetting.');
    existingHashes = [];
  }
}

function getHash(str) {
  return crypto.createHash('sha1').update(str).digest('hex');
}

// Deduplicate and create issues
const newErrors = [];
errorBlocks.forEach(block => {
  const fullError = block.join("\n");
  const hash = getHash(fullError);

  if (!existingHashes.includes(hash)) {
    newErrors.push({ block, hash });
    existingHashes.push(hash);

    const title = `[Vercel Error] ${block[0].substring(0, 80)}`;
    const body = `## Auto-generated Error Report

\`\`\`
${fullError}
\`\`\`

Generated automatically from Vercel logs.`;

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

// Save updated hashes
fs.writeFileSync(hashFile, JSON.stringify(existingHashes, null, 2));

if (newErrors.length === 0) {
  console.log('No new unique errors to report.');
}


