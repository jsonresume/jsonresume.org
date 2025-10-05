const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const HASH_FILE = path.join(__dirname, '..', '.vercel-error-hashes.json');

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

module.exports = {
  loadHashes,
  saveHashes,
  createErrorFingerprint,
};
