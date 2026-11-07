/* global fetch, FormData, Blob -- built into Node 18+ */
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const ENDPOINT =
  process.env.JSONRESUME_IMPORT_URL || 'https://jsonresume.org/api/import';

const TEXT = new Set(['.txt', '.md', '.text']);

const MESSAGES = {
  UnsupportedImport:
    'That file type is not supported. Use a PDF, a Word .docx, a LinkedIn data export .zip or a .txt file.',
  ImportTooLarge: 'That file is over 5 MB.',
  NothingToImport:
    'No text was found in it. A scanned PDF is an image: save the text as a .txt file and import that.',
  ImportFailed: 'The resume could not be read just now. Try again in a minute.',
  TooManyAttempts: 'Too many imports from here in the last hour. Try later.',
};

/**
 * `resume import <file>`: turns a PDF, Word document, LinkedIn export or
 * text file into resume.json with jsonresume.org's importer (the same one
 * as jsonresume.org/start). Nothing is saved there; the file is not kept.
 */
export default async ({
  file,
  resumePath,
  force = false,
  endpoint = ENDPOINT,
  fetchImpl = fetch,
}) => {
  if (!fs.existsSync(file)) {
    console.error(`No file at ${file}.`);
    process.exitCode = 1;
    return;
  }
  if (fs.existsSync(resumePath) && !force) {
    console.error(
      `${resumePath} already exists. Pass --force to replace it, or --resume to write elsewhere.`,
    );
    process.exitCode = 1;
    return;
  }
  const bytes = fs.readFileSync(file);
  const init = TEXT.has(path.extname(file).toLowerCase())
    ? {
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: bytes.toString('utf8') }),
      }
    : (() => {
        const form = new FormData();
        form.append('file', new Blob([bytes]), path.basename(file));
        return { body: form };
      })();
  console.log(chalk.gray(`Reading ${path.basename(file)}…`));
  const response = await fetchImpl(endpoint, { method: 'POST', ...init });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error(
      chalk.red(
        MESSAGES[body._tag] || `The import failed (${response.status}).`,
      ),
    );
    process.exitCode = 1;
    return;
  }
  fs.writeFileSync(resumePath, `${JSON.stringify(body.resume, null, 2)}\n`);
  const unsure = Object.entries(body.confidence || {}).filter(
    ([, level]) => level !== 'high',
  );
  console.log(chalk.green(`Wrote ${resumePath}: ${body.fields} fields.`));
  if (unsure.length > 0) {
    console.log(chalk.yellow('Check these, the import was less sure of them:'));
    for (const [pointer, level] of unsure)
      console.log(
        `  ${pointer} (${level === 'low' ? 'a guess' : 'probably right'})`,
      );
  }
  for (const warning of body.warnings || [])
    console.log(chalk.yellow(`  Left out: ${warning}`));
};
