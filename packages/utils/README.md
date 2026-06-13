# @jsonresume/utils

Framework-free pure utilities for [JSON Resume](https://jsonresume.org): date formatting, derived metrics, URL safety, and resume-shape helpers.

No React, no styled-components, no side effects — safe to use anywhere: server, CLI, browser, or inside a theme.

## Install

```bash
npm install @jsonresume/utils
```

## API

Everything is re-exported from the root (`.`) for convenience, and also available via focused subpaths.

### Root (`@jsonresume/utils`)

Re-exports all of the functions below, plus two resume-shape helpers:

| Function | Description |
| --- | --- |
| `formatLocation(location)` | Join `city, region, countryCode` into one display line (empty parts dropped). |
| `normalizeResume(resume)` | Return a copy with all 12 standard sections present (`basics` as `{}`, arrays as `[]`); never mutates the input. |

### Dates (`@jsonresume/utils/dates`)

| Function | Description |
| --- | --- |
| `formatDateRange({ startDate, endDate, format?, locale?, numberingSystem?, presentLabel? })` | Locale-aware date range via `Intl.DateTimeFormat`. A `null` `endDate` renders `Present`; a missing `endDate` renders a single date. |
| `getRelativeTime(date, ago?)` | Human relative time, e.g. `6 years ago`. |
| `getDuration(startDate, endDate?)` | Duration between two dates, e.g. `2 years, 6 months` (`endDate` defaults to now). |
| `normalizeDates(resume)` | Shallow copy with any `Date`-valued date fields stringified to `YYYY-MM-DD`. |

### Metrics (`@jsonresume/utils/metrics`)

| Function | Description |
| --- | --- |
| `calculateTotalExperience(work)` | Total years of professional experience (rounded to nearest year). |
| `calculateCurrentRoleExperience(work)` | Years in the current/most-recent role (1 decimal). |
| `countCareerPositions(work)` | Number of distinct `position` titles held. |
| `getCareerProgressionRate(work)` | Average years per position. |
| `countTotalHighlights(work)` | Total `highlights` across all work entries. |
| `countCompanies(work)` | Number of unique company names. |
| `countProjects(projects)` | Number of projects. |
| `countPublications(publications)` | Number of publications. |
| `countAwards(awards)` | Number of awards. |
| `countTotalSkills(skills)` | Total skill `keywords` across all categories. |
| `countSkillCategories(skills)` | Number of skill categories. |
| `countLanguages(languages)` | Number of languages. |
| `calculateEducationYears(education)` | Total years of education (rounded). |
| `getHighestDegree(education)` | The highest degree by `studyType` ranking (e.g. `PhD`). |
| `calculateVolunteerYears(volunteer)` | Total volunteer years (rounded). |
| `getUniqueIndustries(work)` | Array of unique `industry` values. |
| `getCurrentEmployer(work)` | The current (no `endDate`) or most-recent work entry, or `null`. |
| `isCurrentlyEmployed(work)` | `true` if any work entry has no `endDate`. |
| `calculateKeyMetrics(resume)` | Dashboard-ready array of `{ label, value }` summarizing the resume. |

### URL safety (`@jsonresume/utils/url`)

| Function | Description |
| --- | --- |
| `safeUrl(url)` | Block `javascript:`/`data:`/`vbscript:` schemes; return a safe URL or `null`. |
| `getLinkRel(url, openInNewTab?)` | Return `noopener noreferrer` for external links opened in a new tab. |
| `sanitizeHtml(html)` | Escape HTML-significant characters to prevent XSS. |
| `isExternalUrl(url, currentOrigin?)` | `true` if the URL points to a different origin. |
| `formatUrlForDisplay(url)` | Strip the protocol and trailing slash, e.g. `example.com/blog`. |

## Usage

Compute headline metrics from a resume:

```js
import {
  calculateTotalExperience,
  getHighestDegree,
  formatDateRange,
} from '@jsonresume/utils';

const years = calculateTotalExperience(resume.work);
const degree = getHighestDegree(resume.education);
const range = formatDateRange({ startDate: '2020-01-15', endDate: null });
// range === 'Jan 2020 - Present'
```

Import from a focused subpath to keep things tight:

```js
import { safeUrl, getLinkRel } from '@jsonresume/utils/url';

const href = safeUrl(profile.url); // null if dangerous
const rel = getLinkRel(href, true); // 'noopener noreferrer'
```

Build a dashboard summary:

```js
import { calculateKeyMetrics } from '@jsonresume/utils/metrics';

for (const { label, value } of calculateKeyMetrics(resume)) {
  console.log(`${label}: ${value}`);
}
// Years Experience: 8
// Companies: 5
// Projects: 12
```

## Ecosystem

Part of the [JSON Resume](https://jsonresume.org) ecosystem. The styled date/link components in `@jsonresume/core` are built on top of these functions. See the roadmap and related packages in [jsonresume/jsonresume.org#421](https://github.com/jsonresume/jsonresume.org/issues/421).

## License

MIT
