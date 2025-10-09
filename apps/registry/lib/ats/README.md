# ATS (Applicant Tracking System) Scoring

This library provides comprehensive ATS compatibility analysis for JSON Resume data. It evaluates resumes across multiple categories and provides actionable recommendations to improve ATS parsing success.

## Overview

Applicant Tracking Systems (ATS) are software applications that screen resumes before they reach human recruiters. This library helps users understand how well their resume will perform when processed by ATS software.

## Usage

```javascript
import { calculateATSScore } from '@/lib/ats/scoring';

const resume = {
  basics: {
    name: 'John Doe',
    email: 'john@example.com',
    // ... more fields
  },
  work: [...],
  education: [...],
  skills: [...],
};

const options = {
  theme: 'jsonresume-theme-stackoverflow', // optional
};

const result = calculateATSScore(resume, options);
```

## Return Value

The `calculateATSScore` function returns an object with the following structure:

```javascript
{
  score: 85,              // Overall score (0-100)
  rating: "Good",         // Rating text
  summary: "Your resume is well-optimized...",
  checks: [               // Array of individual checks
    {
      name: "Contact Information",
      score: 20,
      maxScore: 20,
      passed: true,
      issues: []
    },
    // ... more checks
  ],
  recommendations: [      // Array of actionable recommendations
    {
      severity: "warning",
      category: "experience",
      message: "Missing job description",
      fix: "Add detailed job descriptions"
    },
    // ... more recommendations
  ]
}
```

## Scoring Categories

### 1. Contact Information (20 points)

**What it checks:**
- Full name (5 pts)
- Valid email address (5 pts)
- Phone number (5 pts)
- Location information (5 pts)

**Why it matters:**
ATS systems require contact information to be present and properly formatted. Missing or invalid contact details will prevent recruiters from reaching you.

**Common issues:**
- Missing phone number
- Invalid email format
- No location information

### 2. Work Experience (20 points)

**What it checks:**
- Presence of work experience
- Company names (3 pts per entry)
- Job titles/positions (3 pts per entry)
- Start dates (3 pts per entry)
- Job descriptions or highlights (3 pts per entry)

**Why it matters:**
Work experience is the most scrutinized section by ATS. Missing information reduces your chances of matching job requirements.

**Common issues:**
- Missing company names
- No job titles
- Missing dates
- No descriptions or achievements

### 3. Education (15 points)

**What it checks:**
- Presence of education entries (5 pts)
- Institution names (5 pts per entry)
- Degree type or study area (5 pts per entry)

**Why it matters:**
Many positions require specific educational backgrounds. ATS looks for degree types and institutions to filter candidates.

**Common issues:**
- Missing institution names
- No degree information
- No field of study

### 4. Skills (15 points)

**What it checks:**
- Has skills listed (5 pts)
- Multiple skill categories (5 pts for 3+)
- Keyword count (5 pts for 10+)

**Why it matters:**
Skills are heavily weighted in ATS keyword matching. More skills = better matching with job descriptions.

**Common issues:**
- No skills listed
- Too few skills (< 10 total)
- Only one skill category

### 5. Keywords & Content (15 points)

**What it checks:**
- Professional summary length (5 pts for 50+ chars)
- Work highlights count (5 pts for 5+ highlights)
- Overall word count (5 pts for 200+ words)

**Why it matters:**
ATS systems scan for keywords. More content = more opportunities to match job descriptions.

**Common issues:**
- Short or missing summary
- Few or no work highlights
- Insufficient overall content

### 6. Date Formatting (10 points)

**What it checks:**
- Consistent date formats
- No missing start dates in work history
- No missing dates in education

**Why it matters:**
ATS systems parse dates to understand your career timeline. Inconsistent or missing dates confuse parsers.

**Common issues:**
- Missing start dates
- Inconsistent date formats
- No dates in education entries

### 7. Theme Compatibility (5 points)

**What it checks:**
- Theme is known to be ATS-friendly (5 pts)
- Theme has known ATS issues (1 pt)
- Unknown theme (3 pts)

**Why it matters:**
Complex themes with fancy layouts, images, or unconventional formatting can break ATS parsers.

**ATS-Friendly Themes:**
- `jsonresume-theme-stackoverflow`
- `jsonresume-theme-professional`
- `jsonresume-theme-elegant`
- `jsonresume-theme-kendall`
- `jsonresume-theme-flat`

**Problematic Themes:**
- `jsonresume-theme-paper` (complex layout)
- `jsonresume-theme-short` (non-standard structure)

## Rating Scale

| Score | Rating | Description |
|-------|--------|-------------|
| 90-100 | Excellent | Highly optimized for ATS |
| 75-89 | Good | Well-optimized with minor improvements needed |
| 60-74 | Fair | Needs some improvements |
| 40-59 | Poor | Needs significant improvements |
| 0-39 | Needs Improvement | Critical issues must be addressed |

## Severity Levels

### Critical
- **Impact:** ATS will likely reject or fail to parse
- **Examples:** Missing name, invalid email
- **Action:** Fix immediately

### Warning
- **Impact:** Reduces ATS score, may miss keyword matches
- **Examples:** Missing phone number, no work highlights
- **Action:** Recommended to fix

### Info
- **Impact:** Optimization suggestions
- **Examples:** Could add more skills, expand summary
- **Action:** Nice to have

## Best Practices

### DO:
✅ Use standard section headings (Work Experience, Education, Skills)
✅ Include full contact information
✅ Use consistent date formats (YYYY-MM-DD recommended)
✅ Add specific achievements and metrics
✅ List multiple skills across categories
✅ Choose simple, ATS-friendly themes
✅ Include relevant keywords from job descriptions

### DON'T:
❌ Use images, logos, or photos
❌ Use tables or complex layouts
❌ Use headers/footers
❌ Use text boxes or columns
❌ Use fancy fonts or colors
❌ Leave sections empty
❌ Use abbreviations without spelling out first

## Testing

Run tests with:
```bash
pnpm --filter registry test -- lib/ats/scoring.test.js --run
```

The test suite covers:
- Perfect resume scoring (high scores)
- Missing field detection
- Email validation
- Work experience scoring
- Education handling
- Skills section scoring
- Keyword density checks
- Date consistency
- Theme compatibility
- Recommendation generation

## Implementation Details

### Algorithm

1. **Initialize scoring**: Start with 0 points, track maximum possible score
2. **Run checks**: Execute 7 category checks in sequence
3. **Aggregate scores**: Sum all category scores
4. **Calculate percentage**: `(totalScore / maxScore) * 100`
5. **Generate rating**: Map score to rating text
6. **Collect recommendations**: Flatten all issues from checks
7. **Generate summary**: Create contextual summary based on score

### Helper Functions

- `isValidEmail(email)`: Validates email format with regex
- `extractAllText(resume)`: Extracts all text content for keyword analysis
- `getScoreRating(score)`: Maps numeric score to rating text
- `generateSummary(score, checks)`: Creates contextual summary

## API Integration

This library is exposed via the `/api/ats` endpoint:

**POST** `/api/ats`
```json
{
  "resume": { ...JSON Resume... },
  "theme": "jsonresume-theme-stackoverflow"
}
```

**Response**
```json
{
  "score": 85,
  "rating": "Good",
  "summary": "...",
  "checks": [...],
  "recommendations": [...]
}
```

## Future Enhancements

Potential improvements:
- [ ] HTML parsing to check for ATS-breaking elements
- [ ] Keyword matching against job descriptions
- [ ] Industry-specific scoring profiles
- [ ] PDF parsing and OCR analysis
- [ ] Resume length optimization
- [ ] Readability scoring
- [ ] Action verb detection in work highlights
- [ ] Quantified achievements detection (numbers, percentages)
- [ ] Soft skills vs hard skills analysis
- [ ] Gap detection in work history

## References

- [JSON Resume Schema](https://jsonresume.org/schema/)
- [ATS Best Practices](https://www.jobscan.co/applicant-tracking-systems)
- [Resume Keyword Optimization](https://www.indeed.com/career-advice/resumes-cover-letters/resume-keywords)
