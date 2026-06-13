// Adapter around the ESM-only `@jsonresume/ats-validator` package.
//
// The CLI is transpiled to CommonJS by Babel, which rewrites `import()` into a
// `require()` call. `require()` of a native ES module throws on Node < 22, so
// we reach for a real dynamic `import()` that Babel leaves untouched by hiding
// it behind the Function constructor. This keeps the audit command working
// uniformly across Node 18/20/22 without editing the validator package.
const nativeImport = new Function('specifier', 'return import(specifier)');

let cached;

// Lazily load and memoize the validator's public API
// (`validateATS` + `getRecommendations`).
const loadValidator = async () => {
  if (!cached) {
    cached = await nativeImport('@jsonresume/ats-validator');
  }
  return cached;
};

module.exports = { loadValidator };
