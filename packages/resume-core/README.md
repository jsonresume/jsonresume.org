# @resume/core

**React component library for building ATS-friendly, print-optimized resume themes**

A comprehensive collection of 200+ React components, design tokens, and utilities that enable rapid development of professional resume themes. Built with styled-components for maximum flexibility and SSR support.

## Features

- **200+ React Components** - Comprehensive primitives across 20 categories
- **Design Tokens System** - Typography, colors, spacing, layout, radius, shadows
- **Security Utilities** - URL validation, HTML sanitization, external link detection
- **Calculation Helpers** - 20+ functions for resume metrics and statistics
- **SSR Support** - Full server-side rendering with styled-components
- **Print Optimization** - Perfect PDF exports with @media print styles
- **ATS-Friendly** - Semantic HTML, proper heading hierarchy, accessibility features
- **Theme Support** - ThemeProvider with customizable design tokens

## Installation

```bash
npm install @resume/core
# or
yarn add @resume/core
# or
pnpm add @resume/core
```

**Peer Dependencies:**

This package requires React 18 or 19 and styled-components:

```bash
npm install react react-dom styled-components
```

## Quick Start

```jsx
import React from 'react';
import {
  ThemeProvider,
  Section,
  SectionTitle,
  ListItem,
  DateRange,
  Badge,
  BadgeList,
} from '@resume/core';

function Resume({ resume }) {
  return (
    <ThemeProvider>
      <Section id="work">
        <SectionTitle>Work Experience</SectionTitle>
        {resume.work.map((job) => (
          <ListItem
            key={job.name}
            title={job.position}
            subtitle={job.name}
            dateRange={<DateRange start={job.startDate} end={job.endDate} />}
            location={job.location}
            highlights={job.highlights}
          />
        ))}
      </Section>

      <Section id="skills">
        <SectionTitle>Skills</SectionTitle>
        {resume.skills.map((skill) => (
          <div key={skill.name}>
            <h3>{skill.name}</h3>
            <BadgeList items={skill.keywords} />
          </div>
        ))}
      </Section>
    </ThemeProvider>
  );
}

export default Resume;
```

## Component Categories

### Core Primitives (7 components)

Basic building blocks for resume sections:

- `Section` - Semantic section wrapper with print optimization
- `SectionTitle` - Styled section headings
- `ListItem` - Experience/education entries with metadata
- `DateRange` - Smart date formatting with "Present" support
- `Badge` - Skill tags and keywords
- `BadgeList` - Multiple badges with consistent styling
- `ContactInfo` - Contact details with icons
- `Link` - Safe external links with security validation

### Layout Components (6 components)

Structure and organization:

- `GridLayout` - Multi-column responsive grids
- `SidebarLayout` - Two-column layout with sidebar
- `StackLayout` - Vertical stacking with spacing
- `CardLayout` - Card-based content containers
- `FlexLayout` - Flexible box layouts
- `TwoColumnMicroGrid` - Compact two-column grids

### Skills Components (6 components)

Visual skill representations:

- `SkillBar` - Progress bar visualization
- `SkillPill` - Pill-shaped skill badges
- `SkillRating` - Star or dot rating display
- `SkillGroup` - Grouped skill categories
- `SkillCloud` - Tag cloud visualization
- `SkillCategory` - Categorized skill lists

### Profile Components (4 components)

Header and contact sections:

- `Avatar` - Profile image with fallback
- `ProfileCard` - Complete profile header
- `ContactGrid` - Grid of contact methods
- `SocialLinks` - Social media icon links

### Typography Components (6 components)

Text styling and formatting:

- `Heading` - Semantic headings (h1-h6)
- `Text` - Body text with variants
- `Label` - Small labels and captions
- `SectionIntroParagraph` - Section introductions
- `QuoteStripe` - Pull quotes
- `HyphenationSafeParagraph` - Print-safe paragraphs

### Data Display Components (10 components)

Metrics and statistics:

- `ProgressCircle` - Circular progress indicators
- `StatCard` - Statistic cards
- `MetricBar` - Horizontal metric bars
- `MetricInline` - Inline metric display
- `MetricBullet` - Bullet-style metrics
- `MetricBulletList` - List of bullet metrics
- `KPIChipLine` - Key performance indicator chips
- `KPIChip` - Single KPI chip
- `KeyValueInline` - Inline key-value pairs
- `KeyValue` - Block key-value pairs

### Experience Components (4 components)

Work history layouts:

- `ExperienceCard` - Card-based job entries
- `ExperienceTimeline` - Timeline visualization
- `ExperienceGrid` - Grid layout for multiple jobs
- `ExperienceCompact` - Condensed job listings

### Header/Footer Components (11 components)

Page headers and footers:

- `HeaderCentered` - Centered header layout
- `HeaderSplit` - Two-column header
- `HeaderMinimal` - Minimal header design
- `CornerInitials` - Initials in corner
- `Footer` - Page footer
- `PageBreak` - Explicit page breaks
- `HeroNameBlock` - Large name display
- `ContactRowLine` - Single-line contact row
- `SectionRuleTitle` - Title with horizontal rule
- `SectionFlagTitle` - Title with accent flag
- `NameStackElegant` - Elegant name stack

### Timeline Components (4 components)

Chronological displays:

- `TimelineSection` - Full timeline section
- `TimelineItem` - Individual timeline entry
- `TimelineRuleMinimal` - Minimal timeline rule
- `TimelineInline` - Inline timeline display

### Quote/Testimonial Components (3 components)

Highlighted quotes:

- `PullQuote` - Sidebar pull quotes
- `Testimonial` - Testimonial cards
- `BlockQuote` - Block quote styling

### Certification/Award Components (4 components)

Credentials and honors:

- `CertificationBadge` - Certification badges
- `CertificationRow` - Row-based cert display
- `AwardCard` - Award cards
- `HonorsList` - List of honors

### Language Components (4 components)

Language proficiency:

- `LanguageBar` - Progress bar for proficiency
- `LanguageLevelBarLite` - Compact proficiency bar
- `LanguageGrid` - Grid of languages
- `ProficiencyScale` - Visual proficiency scale

### Publication/Portfolio Components (4 components)

Academic and creative work:

- `PublicationItem` - Publication entries
- `PublicationEntryPlain` - Plain publication format
- `PortfolioGrid` - Portfolio item grid
- `ProjectCard` - Project showcase cards

### Table Components (3 components)

Structured data:

- `SkillMatrix` - Skills matrix table
- `ComparisonTable` - Comparison tables
- `DataTable` - Generic data tables

### List Components (11 components)

Various list styles:

- `CheckList` - Checkmark lists
- `IconList` - Lists with icons
- `NumberedList` - Numbered lists
- `BulletList` - Bullet point lists
- `CompactList` - Condensed lists
- `AchievementListTight` - Tight achievement lists
- `AchievementListSpacious` - Spacious achievements
- `HangingBulletList` - Hanging indent bullets
- `ListDashCompact` - Dash-separated lists
- `MiniDotLeaderList` - Dot leader lists
- `DefinitionKeyline` - Definition lists

### Callout Components (3 components)

Highlighted content:

- `Callout` - Callout boxes
- `InfoBox` - Information boxes
- `HighlightCard` - Highlighted cards

### Visual Components (4 components)

Decorative elements:

- `BackgroundPattern` - Background patterns
- `ColorBlock` - Colored blocks
- `DividerVariants` - Various divider styles
- `BorderAccent` - Border accents

### Date Components (2 components)

Date formatting:

- `DateBadge` - Date badges
- `RelativeDate` - Relative date formatting

### Print Utilities (8 components)

Print optimization:

- `KeepTogether` - Prevent page breaks
- `ColumnBreak` - Force column breaks
- `PrintOnly` - Show only in print
- `ScreenOnly` - Show only on screen
- `PageHeaderLine` - Print headers
- `PageFooterLine` - Print footers
- `LetterheadBar` - Letterhead styling
- `SoftShadowEmulation` - Print-safe shadows

### Metadata Components (5 components)

Supplementary information:

- `InlineKicker` - Inline kickers
- `MetaRow` - Metadata rows
- `SubsectionLabel` - Subsection labels
- `GreyLabelCaps` - Small caps labels
- `SmallCapsHeading` - Small caps headings

### Container Components (4 components)

Content containers:

- `MutedPanel` - Muted background panels
- `AccentCalloutPanel` - Accent panels
- `SoftCardOutline` - Soft card outlines
- `RoleBlockFramed` - Framed role blocks

### Tag/Badge Components (2 components)

Tags and badges:

- `ToolTagRibbon` - Tool tag ribbons
- `BadgeRowOutline` - Outlined badge rows

## Design Tokens

Access design tokens for consistent theming:

```jsx
import { typography, colors, spacing, layout, radius, shadows } from '@resume/core';

console.log(colors.primary); // 'var(--resume-color-primary)'
console.log(typography.fonts.sans); // 'var(--resume-font-sans)'
```

**Available token categories:**

- `typography` - Font families, sizes, weights, line heights
- `colors` - Primary, secondary, accent, muted, background colors
- `spacing` - Margins, padding, gaps
- `layout` - Max widths, container sizes
- `radius` - Border radius values
- `shadows` - Box shadow definitions

**Raw tokens** (for SSR/PDF generation):

```jsx
import { rawTokens } from '@resume/core';

console.log(rawTokens.typography.fonts.sans);
// '"Helvetica Neue", Helvetica, Arial, sans-serif'
```

## Security Utilities

Protect against XSS and malicious URLs:

```jsx
import { safeUrl, sanitizeHtml, isExternalUrl, getLinkRel } from '@resume/core';

// Validate URLs before rendering
const url = safeUrl(userProvidedUrl); // Returns safe URL or '#'

// Sanitize HTML content
const clean = sanitizeHtml(userHTML); // Strips dangerous tags/attributes

// Check if URL is external
if (isExternalUrl(url)) {
  // Add external link indicators
}

// Get appropriate rel attribute
const rel = getLinkRel(url); // Returns 'noopener noreferrer' for external
```

**Best practices:**

- Always use `safeUrl()` for user-provided URLs
- Use `sanitizeHtml()` for any user HTML content
- Apply `getLinkRel()` to external links

## Calculation Helpers

Calculate resume metrics and statistics:

```jsx
import {
  calculateTotalExperience,
  countCompanies,
  getHighestDegree,
  isCurrentlyEmployed,
} from '@resume/core';

const resume = { work: [...], education: [...] };

const experience = calculateTotalExperience(resume.work); // Years of experience
const companies = countCompanies(resume.work); // Number of companies
const degree = getHighestDegree(resume.education); // Highest degree
const employed = isCurrentlyEmployed(resume.work); // Boolean
```

**Available calculations:**

- `calculateTotalExperience(work)` - Total years of experience
- `calculateCurrentRoleExperience(work)` - Current role duration
- `countCompanies(work)` - Number of companies worked at
- `countProjects(projects)` - Number of projects
- `countPublications(publications)` - Number of publications
- `countAwards(awards)` - Number of awards
- `countTotalSkills(skills)` - Total skill count
- `countSkillCategories(skills)` - Number of skill categories
- `countLanguages(languages)` - Number of languages
- `calculateVolunteerYears(volunteer)` - Years of volunteer work
- `calculateEducationYears(education)` - Years of education
- `getHighestDegree(education)` - Highest degree earned
- `countCareerPositions(work)` - Total positions held
- `getCareerProgressionRate(work)` - Career progression rate
- `countTotalHighlights(work)` - Total highlights across jobs
- `getUniqueIndustries(work)` - Unique industries worked in
- `getCurrentEmployer(work)` - Current employer name
- `isCurrentlyEmployed(work)` - Employment status
- `calculateKeyMetrics(resume)` - All metrics in one object

## Server-Side Rendering (SSR)

Full SSR support with styled-components:

```jsx
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import Resume from './Resume';

export function render(resume) {
  const sheet = new ServerStyleSheet();

  try {
    const html = renderToString(sheet.collectStyles(<Resume resume={resume} />));
    const styleTags = sheet.getStyleTags();

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${resume.basics.name} - Resume</title>
          ${styleTags}
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
  } finally {
    sheet.seal();
  }
}
```

**IMPORTANT:** Without `ServerStyleSheet`, styled-components won't inject CSS and your theme will have no styles!

## Theme Building Tutorial

### Step 1: Create Theme Package

```bash
mkdir packages/jsonresume-theme-myname
cd packages/jsonresume-theme-myname
pnpm init
```

### Step 2: Configure package.json

```json
{
  "name": "jsonresume-theme-myname",
  "version": "1.0.0",
  "main": "./src/index.js",
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "dependencies": {
    "@resume/core": "workspace:*",
    "styled-components": "workspace:*"
  }
}
```

### Step 3: Create Resume Component

```jsx
// src/Resume.jsx
import React from 'react';
import {
  ThemeProvider,
  Section,
  SectionTitle,
  ProfileCard,
  ExperienceTimeline,
  BadgeList,
} from '@resume/core';

export default function Resume({ resume }) {
  const { basics, work, education, skills } = resume;

  return (
    <ThemeProvider>
      <ProfileCard
        name={basics.name}
        label={basics.label}
        email={basics.email}
        phone={basics.phone}
        url={basics.url}
        summary={basics.summary}
      />

      <Section id="work">
        <SectionTitle>Experience</SectionTitle>
        <ExperienceTimeline items={work} />
      </Section>

      <Section id="education">
        <SectionTitle>Education</SectionTitle>
        {education.map((edu) => (
          <div key={edu.institution}>
            <h3>{edu.institution}</h3>
            <p>
              {edu.studyType} in {edu.area}
            </p>
          </div>
        ))}
      </Section>

      <Section id="skills">
        <SectionTitle>Skills</SectionTitle>
        {skills.map((skill) => (
          <div key={skill.name}>
            <h4>{skill.name}</h4>
            <BadgeList items={skill.keywords} />
          </div>
        ))}
      </Section>
    </ThemeProvider>
  );
}
```

### Step 4: Create Render Function

```jsx
// src/index.js
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import Resume from './Resume.jsx';

export function render(resume) {
  const sheet = new ServerStyleSheet();

  try {
    const html = renderToString(sheet.collectStyles(<Resume resume={resume} />));
    const styles = sheet.getStyleTags();

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${resume.basics.name} - Resume</title>
          ${styles}
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
  } finally {
    sheet.seal();
  }
}
```

### Step 5: Register Theme

Add to `apps/registry/lib/formatters/template/themeConfig.js`:

```javascript
import * as myTheme from 'jsonresume-theme-myname';

export const THEMES = {
  // ...
  myname: {
    name: 'My Theme',
    theme: myTheme,
    description: 'A beautiful custom theme',
  },
};
```

## Examples

### Complete Resume

```jsx
import Resume from 'jsonresume-theme-myname';

const resumeData = {
  basics: {
    name: 'John Doe',
    label: 'Software Engineer',
    email: 'john@example.com',
    // ...
  },
  work: [
    {
      name: 'TechCorp',
      position: 'Senior Engineer',
      startDate: '2020-01',
      endDate: null,
      highlights: ['Led team of 6', 'Reduced costs by $200k'],
    },
  ],
  // ...
};

const html = Resume.render(resumeData);
```

### Custom Styling

```jsx
import styled from 'styled-components';
import { Section as BaseSection } from '@resume/core';

const CustomSection = styled(BaseSection)`
  background: linear-gradient(to right, #f0f0f0, #ffffff);
  padding: 2rem;
  border-radius: 8px;
`;
```

## TypeScript Support

TypeScript definitions are included:

```typescript
import { Section, SectionTitle, ListItem } from '@resume/core';
import type { Resume } from '@resume/core';

function MyResume({ resume }: { resume: Resume }) {
  // Full type safety
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Requirements:**

- CSS Custom Properties support
- ES6+ JavaScript

## Performance

- **Bundle Size:** ~15KB minified + gzipped (core components only)
- **Tree-Shakeable:** Import only what you need
- **SSR Optimized:** Fast server-side rendering
- **Print Optimized:** Perfect PDF generation

## Contributing

Contributions welcome! Please follow these guidelines:

1. **Add Tests:** All new components must have tests
2. **Follow Conventions:** Use existing naming patterns
3. **Document:** Add JSDoc comments and examples
4. **Keep Components Small:** Under 200 lines per file
5. **Use Styled Components:** Consistent with existing code

## Related Packages

- [jsonresume-theme-standard](../jsonresume-theme-standard) - Classic theme
- [jsonresume-theme-professional](../jsonresume-theme-professional) - Professional theme
- [jsonresume-theme-spartacus](../jsonresume-theme-spartacus) - Spartacus theme

## Support

- **Issues:** [GitHub Issues](https://github.com/jsonresume/jsonresume.org/issues)
- **Discussions:** [GitHub Discussions](https://github.com/jsonresume/jsonresume.org/discussions)
- **Documentation:** [jsonresume.org](https://jsonresume.org)

## License

MIT

---

**Part of the [JSON Resume](https://jsonresume.org) ecosystem** - Open source resume standard used by thousands of developers worldwide.
