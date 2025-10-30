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

### Step 1: Add to themeConfig.js

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

### Step 2: Add to Screenshot Generation Script

**Location**: `scripts/generate-theme-screenshots.mjs`

**CRITICAL:** After registering in themeConfig.js, you MUST add your theme to the `ALL_THEMES` array in the screenshot generation script. Otherwise, your theme won't appear on the homepage.

```javascript
// Full list of themes from themeConfig.js (manually synced)
const ALL_THEMES = [
  'ace',
  'actual',
  // ... existing themes
  'modern-classic', // ← ADD YOUR THEME HERE
  'executive-slate',
  // ... more themes
];
```

**Why is this required?**

The screenshot generation script cannot dynamically import from themeConfig.js due to ES module/CommonJS incompatibility. The list must be manually synced.

**TODO:** In the future, this list should be auto-generated during the build process to prevent desync.

### Step 3: Generate Screenshot for Your Theme

After adding to `ALL_THEMES`, generate the screenshot:

```bash
# Start the registry dev server (in one terminal)
cd apps/registry && pnpm dev

# Generate all screenshots (in another terminal)
pnpm generate:screenshots
```

This will:

1. Launch Playwright browser
2. Navigate to `http://localhost:3000/thomasdavis?theme=your-theme`
3. Capture full-page screenshot
4. Save to `apps/homepage2/public/theme-screenshots/your-theme.png`
5. Update `apps/homepage2/public/themes.json` with theme metadata

### Step 4: Commit Everything Together

```bash
git add apps/registry/lib/formatters/template/themeConfig.js
git add scripts/generate-theme-screenshots.mjs
git add apps/homepage2/public/theme-screenshots/your-theme.png
git add apps/homepage2/public/themes.json
git commit -m "feat(themes): add your-theme with screenshot"
git push origin master
```

**Your theme is now live on the homepage!** 🎉

---

## Homepage Integration Pipeline

### How Themes Appear on the Homepage

Understanding the complete flow from theme creation to homepage display:

```
1. Theme Development
   ↓
2. Register in themeConfig.js
   ↓
3. Add to ALL_THEMES in generate-theme-screenshots.mjs
   ↓
4. Run pnpm generate:screenshots
   ↓
5. Screenshot saved to apps/homepage2/public/theme-screenshots/
   ↓
6. themes.json updated with metadata
   ↓
7. Commit and push to master
   ↓
8. GitHub Actions runs (optional CI verification)
   ↓
9. Vercel deploys homepage with new theme
   ↓
10. Theme appears on https://jsonresume.org/themes
```

### The themes.json Metadata File

**Location**: `apps/homepage2/public/themes.json`

This file is auto-generated by `pnpm generate:screenshots` and contains:

```json
{
  "generated": "2025-10-30T12:03:44.141Z",
  "count": 60,
  "themes": [
    {
      "id": "modern-classic",
      "name": "Modern Classic",
      "description": "Modern Classic resume theme",
      "author": "Community",
      "tags": [],
      "screenshot": "/theme-screenshots/modern-classic.png",
      "previewUrl": "http://localhost:3000/thomasdavis?theme=modern-classic"
    }
  ]
}
```

**How to enhance theme metadata:**

Edit the `THEME_METADATA` object in `scripts/generate-theme-screenshots.mjs`:

```javascript
const THEME_METADATA = {
  'modern-classic': {
    title: 'Modern Classic',
    description: 'Professional, timeless design with blue accents',
    author: 'JSON Resume Team',
    tags: ['professional', 'clean', 'modern'],
  },
  // Add more themes here
};
```

Next time you run `pnpm generate:screenshots`, your theme will have rich metadata.

### Screenshot Generation Script Internals

**File**: `scripts/generate-theme-screenshots.mjs`

**Key Configuration:**

```javascript
const REGISTRY_URL = process.env.REGISTRY_URL || 'http://localhost:3000';
const TEST_USERNAME = 'thomasdavis'; // Test user with comprehensive resume
const OUTPUT_DIR = path.join(
  __dirname,
  '../apps/homepage2/public/theme-screenshots'
);
const METADATA_FILE = path.join(
  __dirname,
  '../apps/homepage2/public/themes.json'
);
```

**Screenshot Settings:**

```javascript
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1200, height: 1600 },
  deviceScaleFactor: 2, // Retina quality
});

await page.screenshot({
  path: screenshotPath,
  fullPage: true, // Captures entire resume, not just viewport
});
```

**Why thomasdavis?**

The `thomasdavis` user has a comprehensive test resume with all 12 JSON Resume schema sections populated. This ensures themes render properly with real data.

### Homepage Theme Gallery

**Location**: `apps/homepage2/app/themes/page.tsx` (or similar)

The homepage themes page:

1. Fetches `/themes.json` at build time
2. Displays theme cards with screenshots
3. Links to preview URLs (`/thomasdavis?theme=xyz`)
4. Allows filtering by tags

**Example implementation:**

```typescript
// Fetch themes metadata
const response = await fetch('/themes.json');
const { themes } = await response.json();

// Render theme cards
themes.map((theme) => (
  <ThemeCard
    key={theme.id}
    name={theme.name}
    description={theme.description}
    screenshot={theme.screenshot}
    previewUrl={theme.previewUrl}
    tags={theme.tags}
  />
));
```

### Testing Your Theme Before Committing

**Local Testing Checklist:**

1. **Start dev server:**

   ```bash
   cd apps/registry && pnpm dev
   ```

2. **View your theme:**

   ```
   http://localhost:3000/thomasdavis?theme=your-theme
   ```

3. **Verify all sections render:**

   - Header (name, label, contact info)
   - Work experience
   - Education
   - Skills
   - Projects
   - Volunteer
   - Awards
   - Publications
   - Languages
   - Interests
   - References

4. **Test print preview:**

   - Press Cmd/Ctrl + P
   - Verify theme is print-friendly
   - Check page breaks, colors, margins

5. **Generate screenshot:**

   ```bash
   pnpm generate:screenshots
   ```

6. **Review screenshot:**

   ```bash
   open apps/homepage2/public/theme-screenshots/your-theme.png
   ```

7. **Check themes.json:**
   ```bash
   cat apps/homepage2/public/themes.json | jq '.themes[] | select(.id=="your-theme")'
   ```

### Troubleshooting Theme Registration

**Theme not appearing on homepage?**

- [ ] Added to `THEMES` in `themeConfig.js`?
- [ ] Added to `ALL_THEMES` in `generate-theme-screenshots.mjs`?
- [ ] Ran `pnpm generate:screenshots`?
- [ ] Screenshot file exists in `apps/homepage2/public/theme-screenshots/`?
- [ ] Theme entry exists in `themes.json`?
- [ ] Committed and pushed all changes?

**Screenshot generation fails?**

- [ ] Registry dev server running on http://localhost:3000?
- [ ] Theme renders without errors when visiting URL directly?
- [ ] Playwright installed? (`npx playwright install`)
- [ ] Sufficient disk space for screenshots?

**Theme renders incorrectly?**

- [ ] Check browser console for errors
- [ ] Verify styled-components are working
- [ ] Test with different resume data
- [ ] Check if theme uses serverless-compatible code (no fs operations)

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
10. **ALWAYS add to ALL_THEMES array** - themes won't appear on homepage without it
11. **Commit screenshots with themes** - CI doesn't auto-commit, you must do it manually

---

## Quick Reference: Complete Theme Development Workflow

**For AI agents working on theme development - follow this exact sequence:**

### 1. Create Theme Package

```bash
mkdir -p packages/themes/jsonresume-theme-YOUR-THEME
cd packages/themes/jsonresume-theme-YOUR-THEME

# Create package.json
cat > package.json <<EOF
{
  "name": "jsonresume-theme-YOUR-THEME",
  "version": "0.1.0",
  "type": "module",
  "main": "index.js",
  "dependencies": {
    "styled-components": "^6.1.13",
    "react": "^18.3.1",
    "@resume/core": "workspace:*"
  }
}
EOF

# Create index.js
cat > index.js <<EOF
import Resume from './src/Resume.jsx';
export default { render: (resume) => Resume({ resume }) };
EOF

mkdir src
touch src/Resume.jsx
```

### 2. Implement Theme

Read spec from `/packages/themes/ideas.md`, then implement:

```javascript
// src/Resume.jsx
import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, ContactInfo, DateRange } from '@resume/core';

const Layout = styled.div`
  max-width: 850px;
  margin: 0 auto;
  padding: 60px 40px;
  background: white; /* Use exact spec colors */
  font-family: 'Inter', sans-serif;
  color: #1f2937;
`;

function Resume({ resume }) {
  const { basics = {}, work = [], education = [], skills = [] } = resume;

  return <Layout>{/* Implement all 12 sections */}</Layout>;
}

export default Resume;
```

### 3. Register Theme

**File 1:** `apps/registry/lib/formatters/template/themeConfig.js`

```javascript
// Add import
import * as yourtheme from 'jsonresume-theme-YOUR-THEME';

// Add to THEMES object
export const THEMES = {
  // ... existing themes
  'your-theme': yourtheme,
};
```

**File 2:** `scripts/generate-theme-screenshots.mjs`

```javascript
// CRITICAL: Add to ALL_THEMES array
const ALL_THEMES = [
  'ace',
  'actual',
  // ... existing themes
  'your-theme', // ← ADD HERE
];
```

### 4. Test Locally

```bash
# Terminal 1: Start dev server
cd apps/registry && pnpm dev

# Terminal 2: View theme
open http://localhost:3000/thomasdavis?theme=your-theme

# Verify all sections render correctly
# Test print preview (Cmd/Ctrl + P)
```

### 5. Generate Screenshot

```bash
# Generate screenshot
pnpm generate:screenshots

# Review screenshot
open apps/homepage2/public/theme-screenshots/your-theme.png

# If issues found, fix theme and re-run screenshot generation
```

### 6. Add Theme Metadata (Optional but Recommended)

**File:** `scripts/generate-theme-screenshots.mjs`

```javascript
const THEME_METADATA = {
  'your-theme': {
    title: 'Your Theme Name',
    description: 'Brief description matching spec vibe',
    author: 'Your Name / JSON Resume Team',
    tags: ['professional', 'modern', 'clean'],
  },
};
```

### 7. Commit and Push

```bash
# Stage all changes
git add packages/themes/jsonresume-theme-YOUR-THEME/
git add apps/registry/lib/formatters/template/themeConfig.js
git add scripts/generate-theme-screenshots.mjs
git add apps/homepage2/public/theme-screenshots/your-theme.png
git add apps/homepage2/public/themes.json

# Commit with descriptive message
git commit -m "feat(themes): add your-theme with [vibe] aesthetic

- Implements spec from ideas.md
- [Key color/design characteristic]
- Screenshot generated and verified
- Registered in themeConfig and screenshot script"

# Push to master
git push origin master
```

### 8. Verify Deployment

```bash
# Wait for Vercel deployment (~2-3 minutes)
# Check homepage themes page
open https://jsonresume.org/themes

# Verify your theme appears with screenshot
# Test preview link works
```

---

## Theme Metadata Configuration

### Shared Package: @repo/theme-config

**Location**: `packages/theme-config/`

The `@repo/theme-config` package is the single source of truth for theme metadata, shared between the registry app and homepage2 app.

**Structure:**

```
packages/theme-config/
├── package.json
├── src/
│   ├── index.js      # Re-exports metadata
│   └── metadata.js   # THEME_METADATA object
```

**Why it exists:**

- Both `apps/registry` and `apps/homepage2` need access to theme metadata
- Relative imports across apps in monorepo don't work reliably
- Shared workspace package with `workspace:*` protocol solves this
- Prevents duplication and keeps metadata in sync

**Usage in registry:**

```javascript
// apps/registry/lib/formatters/template/themeConfig.js
export {
  THEME_METADATA,
  THEME_NAMES,
  getRandomTheme,
} from '@repo/theme-config';
```

**Usage in homepage2:**

```javascript
// apps/homepage2/app/themes/data/themes.js
import { THEME_METADATA } from '@repo/theme-config';
```

**Adding new theme metadata:**

Edit `packages/theme-config/src/metadata.js`:

```javascript
export const THEME_METADATA = {
  'your-theme': {
    name: 'Your Theme Name',
    description: 'Brief description from spec',
    author: 'JSON Resume Team',
    tags: ['professional', 'modern', 'clean'],
  },
  // ... other themes
};
```

**Important:** After updating metadata, run `pnpm install` at root to ensure workspace links are updated.

### Screenshot Generator Scripts

**Location**: `apps/registry/scripts/`

Two scripts are available for generating theme screenshots:

**1. Planning Script: `generate-theme-screenshots.js`**

Identifies missing screenshots without taking action:

```bash
node apps/registry/scripts/generate-theme-screenshots.js
```

**What it does:**

- Reads theme list from `@repo/theme-config`
- Checks if screenshots exist in `apps/homepage2/public/img/themes/`
- Checks if dev server is running on http://localhost:3000
- Outputs task list of missing screenshots

**Use case:** Quick audit to see what themes need screenshots.

**2. Automated Script: `generate-theme-screenshots-auto.js`**

Fully automated screenshot generation using Playwright:

```bash
node apps/registry/scripts/generate-theme-screenshots-auto.js
```

**What it does:**

- Launches headless Chromium browser
- Navigates to each theme URL: `http://localhost:3000/thomasdavis?theme=THEME_NAME`
- Captures full-page screenshot (1280x1024 viewport)
- Saves to temporary directory first
- Moves to final location: `apps/homepage2/public/img/themes/THEME_NAME.png`
- Processes all missing themes automatically

**Prerequisites:**

- Dev server running: `cd apps/registry && pnpm dev`
- Playwright installed: `npx playwright install chromium`
- Sufficient disk space for screenshots

**Configuration:**

```javascript
const REGISTRY_URL = 'http://localhost:3000';
const TEST_USERNAME = 'thomasdavis'; // User with comprehensive resume data
const SCREENSHOTS_DIR = path.join(
  REPO_ROOT,
  'apps/homepage2/public/img/themes'
);
```

**Screenshot settings:**

- Viewport: 1280x1024 (desktop size)
- Format: PNG
- Type: Full-page screenshot (captures entire resume)
- Wait strategy: `networkidle` (waits for network requests to finish)

**Example usage:**

```bash
# Terminal 1: Start dev server
cd apps/registry && pnpm dev

# Terminal 2: Generate all missing screenshots
node apps/registry/scripts/generate-theme-screenshots-auto.js

# Review generated screenshots
open apps/homepage2/public/img/themes/
```

**Error handling:**

- Skips themes that already have screenshots
- Logs errors but continues processing other themes
- Uses temporary directory to avoid partial writes
- Validates URL accessibility before screenshot

**Output:**

```
✓ Checking dev server at http://localhost:3000...
✓ Dev server is running

Processing themes...
  ✓ modern-classic (screenshot exists, skipping)
  → executive-slate (missing, generating...)
  ✓ Screenshot saved: executive-slate.png
  → product-manager-canvas (missing, generating...)
  ✓ Screenshot saved: product-manager-canvas.png

Summary: Generated 2 new screenshots, skipped 15 existing
```

### Integration with pnpm Scripts

The automated screenshot generation is available as a package script:

```json
// Root package.json
{
  "scripts": {
    "generate:screenshots": "node apps/registry/scripts/generate-theme-screenshots-auto.js"
  }
}
```

**Usage:**

```bash
pnpm generate:screenshots
```

This is the recommended way to run screenshot generation in the workflow.

---

## Common Mistakes to Avoid

❌ **Forgetting to add to ALL_THEMES array** → Theme won't appear on homepage
❌ **Not committing screenshot files** → Homepage shows broken images
❌ **Using fs.readFileSync** → Theme breaks in serverless environment
❌ **Not testing print preview** → Users can't print resume
❌ **Themes look too similar** → Users can't differentiate themes
❌ **Skipping screenshot review** → Visual issues missed
❌ **Ignoring spec colors** → Theme doesn't match intended design
❌ **Missing sections** → Theme incomplete, users frustrated
❌ **Not updating @repo/theme-config** → Metadata out of sync
❌ **Running screenshot script without dev server** → Scripts fail silently

---

## AI Agent Checklist

Before marking theme complete:

- [ ] Read spec from `/packages/themes/ideas.md`
- [ ] Created theme package in `/packages/themes/jsonresume-theme-YOUR-THEME/`
- [ ] Implemented all 12 JSON Resume schema sections
- [ ] Used exact colors from spec
- [ ] Typography matches spec (serif vs sans-serif)
- [ ] Layout matches spec (spacing, structure)
- [ ] Theme has distinct visual identity
- [ ] Added to `themeConfig.js` THEMES object
- [ ] Added to `generate-theme-screenshots.mjs` ALL_THEMES array
- [ ] Generated screenshot with `pnpm generate:screenshots`
- [ ] Reviewed screenshot for visual issues
- [ ] Fixed any issues and re-generated screenshot
- [ ] Tested print preview (Cmd/Ctrl + P)
- [ ] Committed all files (theme, config, screenshot, themes.json)
- [ ] Pushed to master
- [ ] Verified theme appears on homepage after deployment

---

## Conclusion

Building JSON Resume themes requires:

1. Careful spec analysis
2. Precise color and typography implementation
3. Registration in TWO places (themeConfig.js + ALL_THEMES)
4. Screenshot generation and review
5. Iterative refinement based on screenshots
6. Distinct visual personalities
7. Complete commit (theme + config + screenshot)

**The most critical step:** Adding your theme to the `ALL_THEMES` array in `scripts/generate-theme-screenshots.mjs`. Without this, your theme will NOT appear on the homepage, even if everything else is correct.

Follow this guide exactly, and your themes will be production-ready with minimal revisions.
