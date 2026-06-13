# @jsonresume/ats-validator

**Machine-readable ATS compatibility validation for resume HTML**

Validate resume HTML against ATS (Applicant Tracking System) best practices with detailed scoring and actionable recommendations.

## Features

- ✅ **10 Validation Checks**: Semantic HTML, fonts, tables, layout, headings, images, font sizes, accessibility, contact information, special characters
- 📊 **Detailed Scoring**: 0-100 score with letter grade (A-F)
- 🎯 **ATS Compatibility Rating**: Excellent / Good / Fair / Poor
- 🔍 **Specific Issues**: Severity levels (error/warning/info) with clear messages
- 💡 **Actionable Recommendations**: Prioritized fixes based on validation results

## Installation

```bash
npm install @jsonresume/ats-validator
```

## Quick Start

```javascript
import { validateATS, getRecommendations } from '@jsonresume/ats-validator';

const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <style>body { font-family: Helvetica, Arial; }</style>
  </head>
  <body>
    <header><h1>John Doe</h1></header>
    <section><h2>Work Experience</h2></section>
  </body>
  </html>
`;

const result = validateATS(html);

console.log(`Score: ${result.score}/100 (${result.grade})`);
console.log(`ATS Compatibility: ${result.atsCompatibility}`);
console.log(`Passed: ${result.passed}/${result.checks.length} checks`);

// Get recommendations
const recs = getRecommendations(result);
recs.forEach(rec => console.log(rec));
```

## API Reference

### `validateATS(html: string): ValidationResult`

Validates HTML string against ATS best practices.

**Returns:**
```javascript
{
  score: 87,                    // 0-100 percentage
  grade: 'B',                   // A, B, C, D, or F
  totalScore: 87,               // Points earned
  maxScore: 100,                // Maximum possible points
  passed: 7,                    // Number of checks passed
  failed: 1,                    // Number of checks failed
  atsCompatibility: 'excellent', // excellent|good|fair|poor
  checks: [                     // Individual check results
    {
      name: 'Semantic HTML',
      score: 10,
      maxScore: 10,
      passed: true,
      issues: []
    },
    // ... more checks
  ],
  issues: [                     // All issues flattened
    {
      severity: 'warning',
      message: 'Custom web fonts detected...'
    }
  ]
}
```

### `getRecommendations(validationResult): string[]`

Returns prioritized list of recommendations based on validation results.

```javascript
const recs = getRecommendations(result);
// [
//   '⚠️ Critical: Your resume has significant ATS compatibility issues...',
//   '🚨 2 critical error(s) found...',
//   '📋 Semantic HTML: 5/10 - Review and fix issues...'
// ]
```

### `getGrade(percentage: number): 'A' | 'B' | 'C' | 'D' | 'F'`

Maps a 0-100 score to the same letter grade `validateATS` reports. Useful when
you compute a score yourself, or want to grade an arbitrary percentage.

```javascript
import { getGrade } from '@jsonresume/ats-validator';

getGrade(95); // 'A'  (>= 90)
getGrade(82); // 'B'  (80-89)
getGrade(74); // 'C'  (70-79)
getGrade(63); // 'D'  (60-69)
getGrade(40); // 'F'  (< 60)
```

## Reusable constants (`@jsonresume/ats-validator/constants`)

The building blocks that power the individual checks are exported from a
dedicated `./constants` subpath so library authors can reuse them (e.g. to lint
or highlight ATS issues) without running the full validator. These are
re-exported from the check modules — the values never drift from what
`validateATS` actually uses.

```javascript
import {
  ATS_FRIENDLY_FONTS, // string[] — lowercase ATS-safe font names
  ATS_BAD_FONTS, // string[] — lowercase decorative fonts to avoid
  ICON_FONT_TOKENS, // string[] — icon-font class tokens (fa, material-icons, …)
  ICON_FONT_FAMILIES, // string[] — icon-font family names referenced in CSS
  EMOJI_RE, // RegExp (global) — emoji / dingbat ranges
  PRIVATE_USE_RE, // RegExp — Private Use Area code points (leaked icon glyphs)
  EMAIL_RE, // RegExp — email-address detection
  PHONE_RE, // RegExp — phone-number detection
  countDigits, // (str: string) => number — digit count helper for phone checks
} from '@jsonresume/ats-validator/constants';
```

> `EMOJI_RE` carries the global (`g`) flag, so it is stateful via `lastIndex`.
> Use `String#match` / `String#matchAll`, or reset `lastIndex` before reusing it
> with `RegExp#test` / `RegExp#exec`.

## Validation Checks

### 1. Semantic HTML (10 points)

Checks for proper HTML5 structure:
- ✅ `<header>` for contact information
- ✅ `<section>` elements for resume sections
- ✅ Single `<h1>` for name
- ✅ Proper heading hierarchy (h1 → h2 → h3, no skips)

**Why it matters:** ATS systems rely on semantic structure to identify resume sections.

### 2. ATS-Friendly Fonts (15 points)

Validates font choices:
- ✅ Standard fonts (Helvetica, Arial, Calibri, Times New Roman, etc.)
- ❌ Non-standard fonts (Comic Sans, Papyrus, decorative fonts)
- ⚠️ Custom web fonts (warns about fallbacks)

**Why it matters:** 68% of hiring managers prefer sans-serif fonts (Adobe 2025). Custom fonts may not render in ATS systems.

### 3. No Table Layouts (15 points)

Detects problematic `<table>` usage:
- ❌ Tables for layout
- ❌ Multi-column table structures

**Why it matters:** 90% of ATS systems struggle with table-based layouts. Parsers read left-to-right, which breaks with tables.

### 4. Single-Column Layout (15 points)

Checks for layout patterns that confuse ATS:
- ⚠️ CSS multi-column
- ⚠️ Multiple floated elements
- ℹ️ CSS Grid with multiple columns
- ℹ️ Flexbox wrapping layouts

**Why it matters:** Single-column layouts parse 3x better than multi-column. ATS reads top-to-bottom.

### 5. Heading Structure (10 points)

Validates heading usage:
- ✅ Sufficient headings (3+) for section structure
- ✅ Non-empty headings
- ✅ Descriptive section titles

**Why it matters:** Headings help ATS identify and categorize resume content (Work, Education, Skills).

### 6. Image Accessibility (10 points)

Checks image handling:
- ⚠️ Missing alt text
- ℹ️ Excessive images (>5)

**Why it matters:** ATS systems cannot read images. All information must be in text form.

### 7. Font Sizes (10 points)

Validates font size choices:
- ⚠️ Very small fonts (<10px)
- ℹ️ Very large fonts (>50px, if excessive)

**Why it matters:** Fonts below 10px may be unreadable by ATS OCR. Maintain hierarchy with reasonable sizes.

### 8. Accessibility (15 points)

Checks accessibility features:
- ⚠️ Missing `lang` attribute
- ℹ️ Non-descriptive link text ("click here")
- ⚠️ Form inputs without labels

**Why it matters:** Accessible HTML works better with ATS parsers and screen readers.

### 9. Contact Information (10 points)

Confirms the candidate's primary contact details are present as selectable text:
- ❌ No email address in text (or a `mailto:` link)
- ⚠️ No phone number in text (or a `tel:` link)

**Why it matters:** ATS systems extract the email and phone as primary, indexed fields. If they only live inside an image or icon — or are missing entirely — the parser drops them and the application can be treated as incomplete. Year ranges and other short digit strings are ignored so they don't masquerade as phone numbers.

### 10. Special Characters (10 points)

Detects glyphs that pollute or break plain-text extraction:
- ⚠️ Icon fonts (Font Awesome, Material Icons, Bootstrap glyphicons) — flagged by class token (`fa`, `fa-*`, `material-icons`, `glyphicon`, `bi-*`, `mdi-*`, `icon-*`) or icon font-family in CSS
- 🚨 Private Use Area Unicode characters (icon-font glyphs that leak into extracted text as garbage)
- ⚠️ Excessive emoji / dingbats used as bullets or section markers

**Why it matters:** ATS parsers extract plain text only. Icon glyphs render from a private Unicode range, so they are dropped or extracted as garbage; emoji used as markers can split the words an ATS matches on. Standard punctuation (bullets •, dashes, smart quotes) is intentionally **not** flagged.

## Severity Levels

- **error** 🚨: Critical issues that will likely prevent ATS parsing
- **warning** ⚠️: Important issues that reduce ATS compatibility
- **info** ℹ️: Minor suggestions for improvement

## Scoring System

| Score | Grade | ATS Compatibility |
|-------|-------|-------------------|
| 90-100 | A | Excellent |
| 80-89 | B | Excellent |
| 70-79 | C | Good |
| 60-69 | D | Good/Fair |
| 0-59 | F | Fair/Poor |

**Target:** Aim for 80+ (Grade B or above) for excellent ATS compatibility.

> Scores are reported as a normalized 0-100 percentage. The raw point total across all checks is 120; `score` divides the points earned by that maximum, so adding or reweighting checks never changes how the grade is interpreted.

## Usage with @resume/core

Validate themes built with @resume/core:

```javascript
import { render } from 'jsonresume-theme-modern-classic';
import { validateATS } from '@jsonresume/ats-validator';

const html = render(resumeData);
const result = validateATS(html);

if (result.score < 80) {
  console.error('Theme needs ATS improvements!');
  console.log(getRecommendations(result));
}
```

## Research & Best Practices

This validator is based on:

- **Adobe 2025 Study**: 68% of hiring managers prefer sans-serif fonts
- **ATS Parsing Research**: Single-column layouts parse 3x better
- **Industry Standards**: Semantic HTML5, WCAG accessibility guidelines
- **Font Compatibility**: Standard fonts have 99% ATS compatibility

## Example Output

```
Score: 92/100 (A)
ATS Compatibility: excellent
Passed: 7/8 checks

Checks:
✅ Semantic HTML: 10/10
✅ ATS-Friendly Fonts: 13/15
  ⚠️ Custom web fonts detected - ensure fallback fonts specified
✅ No Table Layouts: 15/15
✅ Single-Column Layout: 15/15
✅ Heading Structure: 10/10
✅ Image Accessibility: 10/10
✅ Font Sizes: 10/10
✅ Accessibility: 15/15

Recommendations:
✅ Great! Your resume is highly ATS-compatible. Minor improvements possible.
```

## Testing

```bash
pnpm test
```

All validation tests must pass.

## Contributing

This validator is designed to be strict but practical. When adding new checks:

1. Research-backed: Base checks on real ATS behavior and hiring manager preferences
2. Actionable: Provide clear, fixable issues
3. Tested: Add comprehensive test coverage
4. Documented: Explain why the check matters

## License

MIT

---

**Part of the [JSON Resume](https://jsonresume.org) ecosystem**
