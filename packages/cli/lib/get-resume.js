import fs from 'fs';
import { lookup } from 'mime-types';
import { resolve as resolvePath } from 'path';
import loadDirectory from './quaff-loader';
import toString from 'stream-to-string';
import yaml from 'yaml-js';
import { parse as parseJsonc, printParseErrorCode } from 'jsonc-parser';
import { promisify } from 'util';

const { createReadStream } = fs;
const stat = promisify(fs.stat);

// JSON with comments and trailing commas (#318). Comments are dropped; the
// parsed data is the same as the equivalent plain JSON.
const JSONC_MIME = 'application/jsonc';
const parseJsoncOrThrow = (string) => {
  const errors = [];
  const value = parseJsonc(string, errors, { allowTrailingComma: true });
  if (errors.length) {
    const [{ error, offset }] = errors;
    throw new Error(
      `Invalid JSONC: ${printParseErrorCode(error)} at offset ${offset}`,
    );
  }
  return value;
};

const parsers = {
  'text/yaml': (string) => yaml.load(string),
  'application/json': (string) => JSON.parse(string),
  [JSONC_MIME]: parseJsoncOrThrow,
};

const mimeFor = (path) => (/\.jsonc$/i.test(path) ? JSONC_MIME : lookup(path));
export default async ({ path, mime: inputMime }) => {
  let input;
  let mime;
  if ('-' === path) {
    mime = inputMime || lookup('.json');
    input = process.stdin;
  } else if (path && (await stat(path)).isDirectory()) {
    return loadDirectory(path);
  }
  if (!input) {
    mime = inputMime || mimeFor(path);
    input = createReadStream(resolvePath(process.cwd(), path));
  }
  if (!input) {
    throw new Error('resume could not be gotten from path or stdin');
  }
  const resumeString = await toString(input);
  const parser = parsers[mime];
  if (!parser) {
    throw new Error(`no parser available for detected mime type ${mime}`);
  }
  return parser(resumeString);
};
