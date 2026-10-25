import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { createInterface } from 'readline';

const DIR = join(homedir(), '.jsonresume');
const CONFIG_FILE = join(DIR, 'config.json');

/** A well-formed API key: `jr_` followed by 64 lowercase hex characters. */
const API_KEY_PATTERN = /^jr_[a-f0-9]{64}$/;

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

/** Ask the API who a key belongs to. Returns the username, or null. */
async function whoami(baseUrl, key) {
  try {
    const res = await fetch(`${baseUrl}/api/v1/me`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.username || null;
  } catch {
    return null;
  }
}

/**
 * Ensures we have a valid API key. Checks in order:
 * 1. JSONRESUME_API_KEY env var
 * 2. Saved config at ~/.jsonresume/config.json
 * 3. Interactive login (paste a key issued from the website)
 *
 * Keys are issued only to a signed-in GitHub session, so the CLI cannot mint
 * one on the user's behalf — it sends them to the browser to create one.
 */
export async function ensureApiKey(baseUrl) {
  // 1. Env var takes priority
  if (process.env.JSONRESUME_API_KEY) {
    return process.env.JSONRESUME_API_KEY;
  }

  // 2. Saved config
  const config = loadConfig();
  if (config.apiKey) {
    // Verify it still works — keys are revocable, so a saved one may be dead.
    const username = await whoami(baseUrl, config.apiKey);
    if (username) return config.apiKey;
    console.error(
      '\n  Your saved API key is no longer valid (revoked or expired).'
    );
  }

  // 3. Interactive login
  const keysUrl = `${baseUrl}/dashboard/settings#api-keys`;

  console.error('\n  Welcome to JSON Resume Job Search!\n');
  console.error(
    '  You need a JSON Resume account at jsonresume.org to use this tool.'
  );
  console.error("  If you don't have one yet, visit: https://jsonresume.org\n");
  console.error(`  Create an API key under Settings → API keys:`);
  console.error(`    ${keysUrl}\n`);

  const key = await prompt('  Paste your API key: ');

  if (!key) {
    console.error('\n  No key provided. Exiting.');
    process.exit(1);
  }

  if (!API_KEY_PATTERN.test(key)) {
    console.error("\n  That doesn't look like a JSON Resume API key.");
    console.error(`  Keys start with "jr_". Create one at ${keysUrl}\n`);
    process.exit(1);
  }

  console.error('\n  Verifying key...');

  const username = await whoami(baseUrl, key);
  if (!username) {
    console.error('\n  That key was rejected.');
    console.error(`  Create a fresh one at ${keysUrl}\n`);
    process.exit(1);
  }

  saveConfig({ ...config, apiKey: key, username });

  console.error(`  API key saved to ~/.jsonresume/config.json`);
  console.error(`  Logged in as: ${username}\n`);

  return key;
}
