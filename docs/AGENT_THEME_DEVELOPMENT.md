# AI Agent Guide: JSON Resume Theme Development

This guide documents the complete workflow for AI agents developing JSON Resume themes for the jsonresume.org platform.

## Table of Contents

1. [Overview](#overview)
2. [Theme Specifications](#theme-specifications)
3. [Development Workflow](#development-workflow)
4. [Screenshot Testing & Quality Control](#screenshot-testing--quality-control)
5. [Common Issues & Solutions](#common-issues--solutions)
6. [Theme Registration](#theme-registration)
7. [Best Practices](#best-practices)

---

## Overview

JSON Resume themes are React components using styled-components that render resume data in distinct, professional formats. Each theme must:

- Have a unique visual identity
- Follow its specification precisely (vibe, layout, typography, colors)
- Be ATS-compliant (print-friendly, no complex layouts)
- Support all 12 JSON Resume schema sections
- Pass visual quality review via screenshots

**Key Learning**: The most critical mistake is making themes that look too similar. Each theme MUST have distinct colors, typography, and visual personality.

---

## Theme Specifications

### Source of Truth

All theme specifications are in `/packages/themes/ideas.md`. Each spec includes:

- **Vibe**: Emotional/professional tone (e.g., "authoritative", "creative", "analytical")
- **Layout**: Structure and spacing (single column, margins, whitespace)
- **Typography**: Font families, sizes, weights
- **Colors**: Exact hex codes for accents and backgrounds
- **Notes**: Special considerations
- **Description**: The intended visual result and user persona

### Example Spec Analysis

```markdown
**Modern Classic**
Vibe: Professional, timeless, adaptable
Layout: Single column with generous spacing
Typography: Humanist sans-serif, clean and legible
Colors: `--accent: #0066cc` (blue), monochrome body
Notes: Print-optimized, perfect balance between aesthetics and ATS compliance
Description: White background, dark text, soft blue accent line under headings
```

**Critical**: Read and internalize the description before coding. This prevents creating the wrong aesthetic.

---

## Development Workflow

### 1. Read the Specification

```bash
# Read the spec for the theme you're building
cat /packages/themes/ideas.md
```

Extract:

- Exact color codes
- Font families (serif vs sans-serif)
- Background colors (white, off-white, gradients?)
- Accent usage (borders, headers, etc.)

### 2. Create Theme Package

```bash
# Theme packages follow this structure:
packages/themes/jsonresume-theme-{name}/
├── package.json
├── index.js
└── src/
    └── Resume.jsx
```

### 3. Build the Resume.jsx Component

**Pattern: Use styled-components for all styling**

```javascript
import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, DateRange, ContactInfo } from '@resume/core';

const Layout = styled.div`
  max-width: 850px;
  margin: 0 auto;
  padding: 60px 40px;
  background: white; /* Follow spec exactly! */
  font-family: 'Inter', sans-serif;
  color: #1f2937;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  border-bottom: 3px solid #0066cc; /* Use spec accent color */
`;

function Resume({ resume }) {
  const {
    basics = {},
    work = [],
    education = [],
    skills = [],
    projects = [],
    volunteer = [],
    awards = [],
    publications = [],
    languages = [],
    interests = [],
    references = [],
  } = resume;

  return (
    <Layout>
      <Header>
        <Name>{basics.name}</Name>
        {basics.label && <Label>{basics.label}</Label>}
        <ContactInfo basics={basics} />
        {basics.summary && <Summary>{basics.summary}</Summary>}
      </Header>

      {/* Render all sections with conditional checks */}
      {work?.length > 0 && (
        <Section>
          <StyledSectionTitle>Experience</StyledSectionTitle>
          {/* Map through work items */}
        </Section>
      )}

      {/* Continue for all 12 sections... */}
    </Layout>
  );
}

export default Resume;
```

### 4. Key Component Patterns

**Work Experience:**

```javascript
const WorkItem = styled.div`
  margin-bottom: 32px;
  padding: 24px;
  background: #fafafa;
  border-left: 4px solid ${(props) => props.theme.accent};
`;

const WorkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;
```

**Skills Grid:**

```javascript
const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;
```

---

## Screenshot Testing & Quality Control

### CRITICAL: Iterative Visual Verification

**Screenshots are taken after each complete iteration to verify the theme matches its spec.**

**Workflow: Build → Screenshot → Review → Fix → Repeat**

1. **Start dev server**: `cd apps/registry && pnpm dev`
2. **Build complete theme**: Implement all components (layout, typography, colors, sections)
3. **Take screenshot**: Use Playwright to capture full-page screenshot
4. **Review screenshot**: Critically analyze the design against the spec
5. **Identify issues**: Check colors, spacing, fonts, visual hierarchy
6. **Fix issues**: Make necessary adjustments
7. **Re-screenshot**: Verify fixes resolved the issues
8. **Iterate**: Repeat steps 5-7 until theme is polished

**What Is One Iteration?**

An iteration is a complete pass through the theme implementation:

- Layout structure (header, sections, spacing)
- Typography (fonts, sizes, weights, hierarchy)
- Colors (accent, backgrounds, borders)
- All sections (work, skills, education, etc.)
- Polish (padding, margins, visual balance)

**When to Screenshot?**

- After initial build (verify basic structure)
- After fixing issues from review (verify fixes work)
- Before marking theme complete (final verification)

**Why Not Screenshot Every Small Change?**

- Too many screenshots creates noise
- Small changes hard to spot in isolation
- Better to review complete work holistically
- Faster development cycle

**Example: Modern Classic Development**

```bash
# Iteration 1: Build complete theme
# → Screenshot #1: Find issues (contact info small, borders thin, skills low contrast)

# Iteration 2: Fix all issues
# → Screenshot #2: Verify fixes, find more polish needed (spacing)

# Iteration 3: Final polish
# → Screenshot #3: Perfect! Theme complete.
```

### Screenshot Script Pattern

```javascript
// screenshot-themes.js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 1600 });

  const themes = [
    'modern-classic',
    'executive-slate',
    'product-manager-canvas',
  ];

  for (const theme of themes) {
    console.log(`Capturing screenshot for ${theme}...`);
    await page.goto(`http://localhost:3000/thomasdavis?theme=${theme}`, {
      waitUntil: 'networkidle',
    });
    await page.screenshot({
      path: `/tmp/theme-${theme}.png`,
      fullPage: true,
    });
  }

  await browser.close();
})();
```

**Run it:**

```bash
node screenshot-themes.js
```

### What to Check in Screenshots

**Typography:**

- [ ] Contact info is readable (not too small)
- [ ] Section titles have appropriate weight and size
- [ ] Body text has comfortable line-height (1.7-1.8)
- [ ] Font families match spec (serif vs sans-serif)

**Colors:**

- [ ] Accent color matches spec exactly
- [ ] Background color matches spec
- [ ] Sufficient contrast (WCAG AA: 4.5:1 for text, 3:1 for large text)
- [ ] Theme has distinct color personality

**Layout:**

- [ ] Spacing feels comfortable (not cramped)
- [ ] Borders are visible but not overwhelming
- [ ] Skills/cards have enough padding
- [ ] Print-friendly (no dark backgrounds, reasonable margins)

**Visual Identity:**

- [ ] Theme looks distinct from other themes
- [ ] Matches the "vibe" from spec
- [ ] Appropriate for target audience

---

## Common Issues & Solutions

### Issue 1: Themes Look Too Similar

**Problem**: Using similar gradient backgrounds, card styles, and color schemes across multiple themes.

**Solution**:

- Read each spec's description carefully
- Use exact colors from spec (not similar colors)
- Vary typography (serif vs sans-serif)
- Vary layouts (centered vs left-aligned headers, card vs flat)

**Example**:

- ❌ Three themes all using gradient backgrounds with rounded cards
- ✅ Modern Classic (white, flat), Executive Slate (off-white, serif), Product Manager Canvas (white, bordered cards)

### Issue 2: Contact Info Too Small

**Problem**: Email/phone/website links at 12px or smaller

**Solution**:

```javascript
const StyledContactInfo = styled(ContactInfo)`
  font-size: 15px;

  a {
    font-size: 15px;
  }
`;
```

### Issue 3: Weak Visual Hierarchy

**Problem**: Section titles, borders, and accents that are too subtle

**Solution**:

- Use 3px borders (not 1-2px) for section dividers
- Use font-weight 700-800 for titles
- Make accent colors prominent, not washed out

### Issue 4: Skills Cards Lack Contrast

**Problem**: Light gray boxes (#f9fafb) on white that barely show up

**Solution**:

```javascript
// Use darker gray or add borders
const SkillCard = styled.div`
  background: #f3f4f6; /* Darker gray */
  border: 2px solid #e5e7eb; /* Or add border */
`;
```

### Issue 5: Product Manager Theme Not Distinctive

**Problem**: Impact/metrics theme looking generic

**Solution**:

- Thicker left borders on work items (5-6px)
- Bold, prominent "Impact" labels (font-weight 800, uppercase)
- Use distinct skill card styling (borders instead of backgrounds)
- Emphasize measurable achievements visually

---

## Theme Registration

### Add to themeConfig.js

**Location**: `apps/registry/lib/formatters/template/themeConfig.js`

```javascript
// 1. Import at top
import * as modernclassic from 'jsonresume-theme-modern-classic';

// 2. Add to THEMES object
export const THEMES = {
  // ... existing themes
  'modern-classic': modernclassic,
};
```

**Important**: Use ES6 imports (not require) for themes in the monorepo packages.

---

## Best Practices

### Color Usage

**Do:**

- Use exact hex codes from spec
- Maintain WCAG AA contrast ratios
- Use accent colors sparingly (borders, section titles)

**Don't:**

- Guess at colors or use "similar" shades
- Use dark backgrounds (not print-friendly)
- Overuse accent colors everywhere

### Typography

**Do:**

- Use web-safe font stacks with fallbacks
- Vary font weights (400, 500, 600, 700, 800) for hierarchy
- Use serif fonts for executive/formal themes
- Keep body text 15px minimum

**Don't:**

- Use custom web fonts without CDN links
- Make text smaller than 14px
- Use monospace for everything (only accent in Developer Mono theme)

### Layout

**Do:**

- Use single-column layouts (ATS-friendly)
- Add responsive breakpoints for mobile
- Use CSS Grid for skills/cards
- Maintain consistent spacing scales (8px, 16px, 24px, etc.)

**Don't:**

- Create multi-column layouts
- Use absolute positioning
- Rely on complex CSS Grid for main content

### Testing Checklist

Before marking a theme complete:

- [ ] All 12 sections render when present
- [ ] Screenshots taken and reviewed
- [ ] Visual issues identified and fixed
- [ ] Theme matches spec description
- [ ] Distinct from other themes
- [ ] Print-friendly (tested with print preview)
- [ ] Responsive on mobile (320px-1200px)
- [ ] Registered in themeConfig.js
- [ ] Committed and pushed to master

---

## Real-World Example: Product Manager Canvas

### Specification

```
Vibe: Analytical yet creative
Layout: Single column; highlights metrics and achievements inline
Typography: Neutral sans-serif (Inter), comfortable 11pt body
Colors: --accent: #7c3aed (indigo)
Description: Clean Notion document turned resume. White space, bold metrics, clearly labeled "Impact" areas.
```

### Initial Implementation Issues

1. **Used teal gradients instead of indigo** - didn't read spec carefully
2. **Left borders too thin** - impact sections not prominent
3. **Skills looked identical to Executive Slate** - no distinct identity
4. **"Impact" labels too subtle** - font-weight 700, should be 800

### Final Implementation (After Fixes)

```javascript
// Thicker borders for impact emphasis
const WorkItem = styled.div`
  border-left: 6px solid #7c3aed; /* Was 4px */
`;

// Bold Impact labels
const ImpactLabel = styled.div`
  font-size: 14px;
  font-weight: 800; /* Was 700 */
  color: #7c3aed;
  text-transform: uppercase;
  letter-spacing: 1.2px;
`;

// Distinct skill cards
const SkillCard = styled.div`
  background: white; /* Not gray like other themes */
  border: 2px solid #e9d5ff; /* Light purple border */

  &:hover {
    border-color: #7c3aed;
    box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1);
  }
`;
```

### Result

Product Manager Canvas now has:

- Clean white aesthetic with indigo accents
- Prominent impact sections with thick borders
- Distinct bordered skill cards (not gray backgrounds)
- Strong "Impact" labels that stand out
- Metrics-focused visual language

---

## Lessons Learned (October 2025)

1. **Read specs carefully before coding** - prevents building wrong theme
2. **Screenshot testing is mandatory** - catches issues humans see immediately
3. **Distinct visual identities are critical** - users need clear choices
4. **Polish matters** - small tweaks (padding, border thickness) compound
5. **Typography makes themes** - serif vs sans-serif creates different personalities
6. **Colors must match spec exactly** - "close enough" creates confusion
7. **Product/impact themes need emphasis** - thicker borders, bolder labels
8. **White space is a design element** - don't fear generous padding
9. **Iterate based on screenshots** - one review cycle isn't enough

---

## Conclusion

Building JSON Resume themes requires:

1. Careful spec analysis
2. Precise color and typography implementation
3. Mandatory screenshot review
4. Iterative refinement
5. Distinct visual personalities

Follow this guide exactly, and your themes will be production-ready with minimal revisions.
