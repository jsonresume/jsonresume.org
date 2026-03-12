import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { createInterface } from 'readline';

const DIR = join(homedir(), '.jsonresume');
const CONFIG_FILE = join(DIR, 'config.json');

function ensureDir() {
  try {
    mkdirSync(DIR, { recursive: true });
  } catch {}
}

export function loadConfig() {
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

export function saveConfig(config) {
  ensureDir();
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Ensures we have a valid API key. Checks in order:
 * 1. JSONRESUME_API_KEY env var
 * 2. Saved config at ~/.jsonresume/config.json
 * 3. Interactive login (prompt for GitHub username → generate key)
 */
export async function ensureApiKey(baseUrl) {
  // 1. Env var takes priority
  if (process.env.JSONRESUME_API_KEY) {
    return process.env.JSONRESUME_API_KEY;
  }

  // 2. Saved config
  const config = loadConfig();
  if (config.apiKey) {
    // Verify it still works
    try {
      const res = await fetch(`${baseUrl}/api/v1/me`, {
        headers: { Authorization: `Bearer ${config.apiKey}` },
      });
      if (res.ok) return config.apiKey;
    } catch {}
    // Key is stale — fall through to login
  }

  // 3. Interactive login
  console.error('\n  Welcome to JSON Resume Job Search!\n');
  console.error(
    '  You need a JSON Resume hosted at registry.jsonresume.org to use this tool.'
  );
  console.error("  If you don't have one yet, visit: https://jsonresume.org\n");

  const username = await prompt('  Enter your GitHub username: ');

  if (!username) {
    console.error('\n  No username provided. Exiting.');
    process.exit(1);
  }

  console.error(
    `\n  Checking for resume at registry.jsonresume.org/${username}...`
  );

  // Verify resume exists
  const resumeRes = await fetch(`${baseUrl}/${username}.json`);
  if (!resumeRes.ok) {
    console.error(`\n  No resume found for "${username}".`);
    console.error('  Create one at https://jsonresume.org and try again.\n');
    process.exit(1);
  }

  console.error('  Resume found! Generating API key...');

  // Generate key
  const keyRes = await fetch(`${baseUrl}/api/v1/keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });

  if (!keyRes.ok) {
    const err = await keyRes.json().catch(() => ({}));
    console.error(
      `\n  Failed to generate key: ${err.error || keyRes.statusText}`
    );
    process.exit(1);
  }

  const { key } = await keyRes.json();

  // Save it
  saveConfig({ ...config, apiKey: key, username });

  console.error(`  API key saved to ~/.jsonresume/config.json`);
  console.error(`  Logged in as: ${username}\n`);

  return key;
}
