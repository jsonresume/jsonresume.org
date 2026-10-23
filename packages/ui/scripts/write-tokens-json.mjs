// Writes dist/tokens.json: every token with its CSS variable name and its
// light and dark values, for consumers that are not React (plain CSS,
// design tools, docs).
import { writeFileSync } from 'node:fs';

const { tokens, darkColor, breakpoints } = await import(
  '../dist/tokens/theme.js'
);

const kebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

function flatten(node, path, out) {
  for (const [key, value] of Object.entries(node)) {
    const next = [...path, key];
    if (value && typeof value === 'object') flatten(value, next, out);
    else
      out[next.join('.')] = {
        cssVar: `--jr-${next.map(kebab).join('-')}`,
        value,
      };
  }
  return out;
}

const all = flatten(tokens, [], {});
const dark = flatten({ color: darkColor }, [], {});
for (const [key, entry] of Object.entries(dark)) all[key].dark = entry.value;

writeFileSync(
  new URL('../dist/tokens.json', import.meta.url),
  `${JSON.stringify({ tokens: all, breakpoints }, null, 2)}\n`
);
