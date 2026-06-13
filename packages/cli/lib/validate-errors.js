// Turns raw Ajv (draft-07) error objects into precise, actionable output.
//
// For each failure we surface four things:
//   - the JSON path in dot/bracket notation (e.g. work[2].startDate)
//   - the failing rule (the Ajv keyword, lightly humanised)
//   - the offending value (with its JS type)
//   - a one-line, human hint on how to fix it
//
// The first physical line of each error is kept as `<dataPath> <message>`
// (e.g. `data/basics/name must be string`) so existing tooling that greps the
// output for that classic phrasing keeps working.

// "/work/1/startDate" -> "work[1].startDate"; the root is "(root)".
const toDotPath = (instancePath) => {
  if (!instancePath) {
    return '(root)';
  }
  const segments = instancePath.split('/').filter(Boolean);
  return segments
    .map((segment) => (/^\d+$/.test(segment) ? `[${segment}]` : `.${segment}`))
    .join('')
    .replace(/^\./, '');
};

// "data" + instancePath, matching Ajv's classic dataPath phrasing.
const toDataPath = (instancePath) =>
  instancePath ? `data${instancePath}` : 'data';

const previewValue = (value) => {
  if (value === undefined) {
    return 'undefined';
  }
  let serialised;
  try {
    serialised = JSON.stringify(value);
  } catch {
    serialised = String(value);
  }
  if (serialised === undefined) {
    serialised = String(value);
  }
  if (serialised.length > 80) {
    serialised = `${serialised.slice(0, 77)}...`;
  }
  const type = Array.isArray(value) ? 'array' : typeof value;
  return `${serialised} (${type})`;
};

// Resolve the value the error points at by walking the instancePath.
const valueAtPath = (root, instancePath) => {
  if (!instancePath) {
    return root;
  }
  const segments = instancePath.split('/').filter(Boolean);
  let current = root;
  for (const segment of segments) {
    if (current == null) {
      return undefined;
    }
    // Ajv JSON-pointer-escapes "/" as "~1" and "~" as "~0".
    const key = segment.replace(/~1/g, '/').replace(/~0/g, '~');
    current = current[key];
  }
  return current;
};

// Map an Ajv keyword to a short human description of the rule it enforces.
const describeRule = (error) => {
  const { keyword, params } = error;
  switch (keyword) {
    case 'type':
      return `type (expected ${params.type})`;
    case 'format':
      return `format (expected ${params.format})`;
    case 'pattern':
      return 'pattern';
    case 'required':
      return `required (${params.missingProperty})`;
    case 'additionalProperties':
      return `additionalProperties (${params.additionalProperty})`;
    case 'enum':
      return `enum (one of ${JSON.stringify(params.allowedValues)})`;
    case 'minimum':
    case 'maximum':
    case 'minLength':
    case 'maxLength':
    case 'minItems':
    case 'maxItems':
      return `${keyword} (${params.limit})`;
    default:
      return keyword;
  }
};

// A short, plain-language fix for the failing field.
const hintFor = (error, dotPath) => {
  const field = dotPath === '(root)' ? 'the resume' : `"${dotPath}"`;
  const { keyword, params } = error;
  switch (keyword) {
    case 'type':
      return `${field} must be of type ${params.type}.`;
    case 'format':
      if (params.format === 'email') {
        return `${field} must be a valid email address, e.g. "you@example.com".`;
      }
      if (params.format === 'uri') {
        return `${field} must be a full URL, e.g. "https://example.com".`;
      }
      if (params.format === 'date') {
        return `${field} must be an ISO date, e.g. "2024-01-31".`;
      }
      return `${field} must match the "${params.format}" format.`;
    case 'pattern':
      // The JSON Resume date fields share one ISO-8601 pattern.
      if (/iso8601/.test(error.schemaPath || '')) {
        return `${field} must be an ISO-8601 date: YYYY, YYYY-MM, or YYYY-MM-DD.`;
      }
      return `${field} does not match the required pattern.`;
    case 'required':
      return `add the missing "${params.missingProperty}" property to ${field}.`;
    case 'additionalProperties':
      return `remove the unknown property "${params.additionalProperty}" from ${field} (or check for a typo).`;
    case 'enum':
      return `${field} must be one of: ${params.allowedValues
        .map((v) => JSON.stringify(v))
        .join(', ')}.`;
    case 'minLength':
      return `${field} must be at least ${params.limit} character(s) long.`;
    case 'maxLength':
      return `${field} must be at most ${params.limit} character(s) long.`;
    case 'minItems':
      return `${field} must contain at least ${params.limit} item(s).`;
    case 'minimum':
      return `${field} must be >= ${params.limit}.`;
    case 'maximum':
      return `${field} must be <= ${params.limit}.`;
    default:
      return `${field} ${error.message}.`;
  }
};

// Format a single Ajv error into a multi-line, annotated block.
const formatSingleError = (error, root) => {
  const dataPath = toDataPath(error.instancePath);
  const dotPath = toDotPath(error.instancePath);
  // For `required`/`additionalProperties` the offending value is the *parent*
  // object; show that, since the named property itself is missing/extra.
  const value = valueAtPath(root, error.instancePath);
  const lines = [
    // Kept verbatim so `data/basics/name must be string`-style greps work.
    `✖ ${dataPath} ${error.message}`,
    `    at:    ${dotPath}`,
    `    rule:  ${describeRule(error)}`,
  ];
  if (error.keyword !== 'required') {
    lines.push(`    found: ${previewValue(value)}`);
  }
  lines.push(`    hint:  ${hintFor(error, dotPath)}`);
  return lines.join('\n');
};

// Public: build the full failure message.
//   formatErrors(ajvErrors, resume) -> string
const formatErrors = (errors = [], root) => {
  const count = errors.length;
  const heading =
    count === 1
      ? 'Invalid resume: 1 problem found'
      : `Invalid resume: ${count} problems found`;
  const blocks = errors.map((error) => formatSingleError(error, root));
  return `${heading}\n\n  ${blocks.join('\n\n  ')}`;
};

// Build a one-line OK summary that counts the populated array sections.
const formatOkSummary = (resume, label) => {
  const sections = [
    'work',
    'volunteer',
    'education',
    'awards',
    'certificates',
    'publications',
    'skills',
    'languages',
    'interests',
    'references',
    'projects',
  ];
  const counts = sections
    .filter((key) => Array.isArray(resume && resume[key]) && resume[key].length)
    .map((key) => `${resume[key].length} ${key}`);
  const name =
    resume && resume.basics && typeof resume.basics.name === 'string'
      ? resume.basics.name
      : null;
  const parts = [];
  if (name) {
    parts.push(name);
  }
  if (counts.length) {
    parts.push(counts.join(', '));
  }
  const detail = parts.length ? ` (${parts.join(' — ')})` : '';
  const subject = label ? `${label} is valid` : 'resume is valid';
  return `✓ ${subject}${detail}`;
};

module.exports = {
  formatErrors,
  formatOkSummary,
  // exported for unit testing of the path/value/hint helpers
  toDotPath,
  previewValue,
  hintFor,
};
