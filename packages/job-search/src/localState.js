import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const DIR = join(homedir(), '.jsonresume');
const FILE = join(DIR, 'local-marks.json');

function ensureDir() {
  try {
    mkdirSync(DIR, { recursive: true });
  } catch {}
}

function load() {
  try {
    return JSON.parse(readFileSync(FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function save(data) {
  ensureDir();
  writeFileSync(FILE, JSON.stringify(data, null, 2));
}

/** Get all marks as { jobId: state } */
export function getMarks() {
  return load();
}

/** Set a mark for a job */
export function setMark(jobId, state) {
  const marks = load();
  marks[String(jobId)] = state;
  save(marks);
}
