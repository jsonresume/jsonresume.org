# @jsonresume/types

TypeScript types for the [JSON Resume](https://jsonresume.org) and Job schemas, generated from `@jsonresume/schema`.

This is a **types-only** package: the runtime entry point is intentionally empty and the interfaces are emitted (as `.d.ts`) from the canonical schema, so they never drift from the spec.

## Install

```bash
npm install --save-dev @jsonresume/types
```

## API

A single root export (`.`) ships the following interfaces and type aliases.

### Resume

| Type | Description |
| --- | --- |
| `Resume` | The full JSON Resume document. All sections are optional; unknown keys are allowed. |
| `ResumeBasics` | `basics` — name, label, email, phone, url, summary, location, profiles. |
| `ResumeLocation` | The `basics.location` object (address, city, region, countryCode, postalCode). |
| `ResumeProfile` | An entry in `basics.profiles` (network, username, url). |
| `WorkItem` | An entry in `work`. |
| `VolunteerItem` | An entry in `volunteer`. |
| `EducationItem` | An entry in `education`. |
| `AwardItem` | An entry in `awards`. |
| `CertificateItem` | An entry in `certificates`. |
| `PublicationItem` | An entry in `publications`. |
| `SkillItem` | An entry in `skills`. |
| `LanguageItem` | An entry in `languages`. |
| `InterestItem` | An entry in `interests`. |
| `ReferenceItem` | An entry in `references`. |
| `ProjectItem` | An entry in `projects`. |
| `ResumeMeta` | The `meta` object (canonical, version, lastModified). |
| `Iso8601` | String alias for partial ISO-8601 dates, e.g. `2014-06-29` or `2023-04`. |

### Job

| Type | Description |
| --- | --- |
| `JobDescription` | A job posting in the JSON Resume Job schema (title, company, type, location, remote, salary, responsibilities, qualifications, skills, meta). |

## Usage

Type a resume object you load from disk or an API:

```ts
import type { Resume } from '@jsonresume/types';

const resume: Resume = JSON.parse(await readFile('resume.json', 'utf8'));

console.log(resume.basics?.name);
```

Annotate a function that operates on a single section:

```ts
import type { WorkItem } from '@jsonresume/types';

function formatRole(job: WorkItem): string {
  return `${job.position ?? 'Unknown'} @ ${job.name ?? 'Unknown'}`;
}
```

Type a job posting with the Job schema:

```ts
import type { JobDescription } from '@jsonresume/types';

const job: JobDescription = {
  title: 'Web Developer',
  company: 'Microsoft',
  remote: 'Hybrid',
};
```

## Ecosystem

Part of the [JSON Resume](https://jsonresume.org) ecosystem. See the roadmap and related packages in [jsonresume/jsonresume.org#421](https://github.com/jsonresume/jsonresume.org/issues/421).

## License

MIT
