const { writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');

const pkgRoot = join(__dirname, '..');
const distDir = join(pkgRoot, 'dist');

const { jobDescriptionJsonSchema, JOB_DESCRIPTION_SCHEMA_VERSION } = require(
  join(distDir, 'index.js')
);

mkdirSync(distDir, { recursive: true });

const outputPath = join(distDir, 'job-description.schema.json');
writeFileSync(outputPath, JSON.stringify(jobDescriptionJsonSchema, null, 2));

console.log(
  `Generated job-description.schema.json (version ${JOB_DESCRIPTION_SCHEMA_VERSION}) at ${outputPath}`
);
