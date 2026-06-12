# JSON Resume Schema

[![NPM Release](https://badgen.net/npm/v/@jsonresume/schema)](https://www.npmjs.com/package/@jsonresume/schema)

[![](https://dcbadge.limes.pink/api/server/GTZtn8pTXC)](https://discord.gg/GTZtn8pTXC)

Standard, Specification, Schema

> **Note:** This package now lives in the [jsonresume.org monorepo](https://github.com/jsonresume/jsonresume.org) as `packages/schema` (imported with full history from [jsonresume/resume-schema](https://github.com/jsonresume/resume-schema)). It keeps its npm identity as [`@jsonresume/schema`](https://www.npmjs.com/package/@jsonresume/schema) and is published from this workspace. Please open issues and PRs against the monorepo.

The current stable schema is represented by the files `schema.json` and `sample.resume.json`.

### Getting started

```
npm install --save @jsonresume/schema
```

To use

```js
import resumeSchema from '@jsonresume/schema';
resumeSchema.validate(
  { basics: { name: "Thomas" } },
  function (err, report) {
    if (err) {
      console.error("The resume was invalid:", err);
      return;
    }
    console.log("Resume validated successfully:", report);
  },
  function (err) {
    console.error("The resume was invalid:", err);
  }
);
```

Or against a full `resume.json`

```js
import fs = require('fs');
import schema from 'resume-schema';
const resumeObject = JSON.parse(fs.readFileSync('./resume.json', 'utf8'));
resumeSchema.validate(resumeObject);
```

The JSON Resume schema is available from:

```js
require("resume-schema").schema;
```

### Contribute

We encourage anyone who's interested in participating in the formation of this standard to join the discussions [here on GitHub](https://github.com/jsonresume/resume-schema/issues). Also feel free to fork this project and submit new ideas to add to the JSON Resume Schema standard. To make sure all formatting is kept in check, please install the [EditorConfig plugin](http://editorconfig.org/) for your editor of choice.

### Versioning

JSON Resume Schema adheres to Semantic Versioning 2.0.0. If there is a violation of
this scheme, report it as a bug. Specifically, if a patch or minor version is
released and breaks backward compatibility, that version should be immediately
yanked and/or a new version should be immediately released that restores
compatibility. Any change that breaks the public API will only be introduced at
a major-version release. As a result of this policy, you can (and should)
specify any dependency on JSON Resume Schema by using the Pessimistic Version
Constraint with two digits of precision.

We use automatic semver system.

Pull requests titles should be formatted as such

```
"fix: added something" - will bump the patch version
"feat: added something" - will bump the minor version
```

`major` version bumps will be few and far between for this schema.

### Job Description Schema

A draft schema for job descriptions is available in this project as well. It is not yet finalized, but we encourage you to check it out and provide feedback. See `job-schema.json` and `sample.job.json`.

The JSON Job schema is available from:

```js
require("resume-schema").jobSchema;
```

### Other resume standards

- [HR-XML](https://schemas.liquid-technologies.com/HR-XML/2007-04-15/)
- [Europass](http://europass.cedefop.europa.eu/about-europass)
