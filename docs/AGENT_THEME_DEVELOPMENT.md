# AI Agent Guide: JSON Resume Theme Development

## Critical Rules

1. **Read the spec from `/packages/themes/ideas.md` BEFORE writing any code**
2. **Design layout structure FIRST, then style** - Wireframe the grid/columns/structure before adding colors/typography
3. **Each theme MUST have a visually distinct layout** - NEVER reuse the same layout pattern as the previous theme
4. **Take screenshots after EACH iteration** to verify visual correctness
5. **Use the automated screenshot script** at `apps/registry/scripts/generate-theme-screenshots-auto.js`
6. **Be hyper-critical when reviewing screenshots** - Fix ALL design issues immediately, iterate until polished
7. **Test ALL 12 schema sections** render correctly before considering theme complete

## Layout-First Design Process (NEW October 2025)

**CRITICAL**: Design the LAYOUT STRUCTURE first, THEN add styling. This prevents themes from looking identical.

### Step 1: Wireframe the Layout (BEFORE any CSS)

**Think about structure, NOT colors:**

1. **Grid Pattern**: Single column? Two columns? Sidebar? Three-column sections?
2. **Header Layout**: Centered name? Split header? Stacked? Inline?
3. **Content Flow**: Vertical stack? Grid? Cards? Timeline?
4. **Section Structure**: Borders? Backgrounds? Whitespace dividers?
5. **Date Positioning**: Left column? Inline? Separate metadata row?

**Example wireframe thinking:**

```
GOOD (specific structure):
- Split header: name LEFT (black bg) | contact RIGHT (white bg)
- Two-column main: sidebar (280px gray) | content (fluid white)
- Work items: date column (160px) | content column
- Thick borders (2px) throughout

BAD (vague):
- "Professional layout"
- "Clean design"
- "Modern feel"
```

### Step 2: Identify What Makes This Layout DIFFERENT

**Compare to most recent theme screenshot:**

- Previous theme: Single column, centered header, stacked sections
- NEW theme: Two columns, split header, sidebar layout
- DISTINCT because: Fundamentally different grid structure

### Layout Variation Patterns

**Column Structures:**

- **Single Column**: All content in one vertical flow (680-900px wide)
- **Two-Column Sidebar**: Fixed sidebar (280px) + fluid content
- **Two-Column Split**: Equal 50/50 split
- **Three-Column Grid**: Skills | Work | Education side by side
- **Asymmetric**: 40/60 or 30/70 column splits

**Header Patterns:**

- **Centered**: Name centered, contact below
- **Left-aligned**: Name top-left, contact inline or below
- **Split**: Name left side, contact right side (different backgrounds)
- **Full-width banner**: Name spans full width with background
- **Minimal**: Name only, contact in sidebar or footer

**Work Item Layouts:**

- **Cards**: Background colors, rounded corners, shadows
- **Timeline**: Left border accent, dots, vertical flow
- **Table-like**: Date column + content column with borders
- **Flat list**: No backgrounds, whitespace dividers only
- **Grid**: Work items in 2-column grid

**Section Dividers:**

- **Thick borders**: 2-3px solid lines between sections
- **Backgrounds**: Alternate section backgrounds
- **Whitespace only**: No visible dividers
- **Accent lines**: Thin colored underlines
- **Headers**: Black bars with white text

**Visual Structures:**

1. **Brutalist** (like Urban Techno): Thick borders, two-column sidebar, table-like layouts, monochrome
2. **Editorial** (like New York Editorial): Narrow column, wide margins, serif, whitespace
3. **Timeline** (like French Atelier): Left border accents, vertical flow, timeline dots
4. **Grid** (like Berlin Grid): Modular sections, precise alignment, geometric
5. **Cards** (like Californian Warm): Work items as cards with backgrounds
6. **Minimalist** (like Nordic Minimal): Maximum whitespace, minimal borders, clean

### Step 3: Build Structure First, Style Second

**DO THIS:**

```javascript
// 1. Define grid structure
const Layout = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr; // STRUCTURE
`;

// 2. Define section positioning
const Header = styled.header`
  display: grid;
  grid-template-columns: 1fr 1fr; // STRUCTURE
`;

// 3. THEN add colors/fonts
const Name = styled.h1`
  background: #111; // STYLE
  color: white; // STYLE
`;
```

**NOT THIS:**

```javascript
// Starting with colors without structure
const Layout = styled.div`
  background: #fef8e7; // ❌ Started with style
  color: #2a2a2a; // ❌ No structure defined
`;
```

### Before Starting Any New Theme

**CHECKLIST:**

1. [ ] Read spec from ideas.md for this theme
2. [ ] Look at screenshot of MOST RECENT theme
3. [ ] Identify previous theme's layout pattern
4. [ ] Choose DIFFERENT layout structure for new theme
5. [ ] Wireframe grid/columns/sections on paper or in comments
6. [ ] Build structure CSS FIRST (grid, flexbox, positioning)
7. [ ] THEN add styling CSS (colors, fonts, spacing)
8. [ ] Take screenshot and verify layout is VISUALLY DISTINCT

## Development Workflow

### Step 1: Read Theme Specification

```bash
# Read spec for your theme
cat packages/themes/ideas.md
```

Extract:

- **Exact hex colors** (e.g., `#0066cc` not "blue")
- **Font families** (serif vs sans-serif, specific names)
- **Background colors** (white, off-white, cream, etc.)
- **Layout style** (single column, spacing, margins)
- **Visual personality** (professional, creative, technical, executive)

### Step 2: Start Dev Server

```bash
cd apps/registry && pnpm dev
```

Keep this running in a terminal. All testing happens against `http://localhost:3000`.

### Step 3: Create Theme Package

```bash
# Create theme directory
mkdir -p packages/themes/jsonresume-theme-YOUR-THEME/src

# Create package.json
cat > packages/themes/jsonresume-theme-YOUR-THEME/package.json <<EOF
{
  "name": "jsonresume-theme-YOUR-THEME",
  "version": "0.1.0",
  "type": "module",
  "main": "index.js",
  "dependencies": {
    "styled-components": "workspace:*",
    "react": "workspace:*",
    "react-dom": "workspace:*",
    "@resume/core": "workspace:*"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
EOF

# Create SSR-compatible index.js
cat > packages/themes/jsonresume-theme-YOUR-THEME/index.js <<'EOF'
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import Resume from './src/Resume.jsx';

export function render(resume) {
  const sheet = new ServerStyleSheet();
  const html = renderToString(sheet.collectStyles(<Resume resume={resume} />));
  const styles = sheet.getStyleTags();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${resume.basics?.name || 'Resume'}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${styles}
</head>
<body>${html}</body>
</html>`;
}
EOF
```

### Step 4: Implement Resume.jsx

**CRITICAL: Use Google Fonts CDN for typography**

```javascript
import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, DateRange, ContactInfo } from '@resume/core';

const Layout = styled.div`
  max-width: 850px;
  margin: 0 auto;
  padding: 60px 40px;
  background: #ffffff; /* EXACT spec color */
  font-family: 'Inter', -apple-system, sans-serif;
  color: #1f2937;

  @media print {
    padding: 40px;
    background: white;
  }
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
      {/* Header with name, label, contact */}
      <Header>
        <Name>{basics.name}</Name>
        {basics.label && <Label>{basics.label}</Label>}
        <StyledContactInfo basics={basics} />
        {basics.summary && <Summary>{basics.summary}</Summary>}
      </Header>

      {/* ALL 12 sections with conditional rendering */}
      {work?.length > 0 && <WorkSection work={work} />}
      {skills?.length > 0 && <SkillsSection skills={skills} />}
      {education?.length > 0 && <EducationSection education={education} />}
      {projects?.length > 0 && <ProjectsSection projects={projects} />}
      {volunteer?.length > 0 && <VolunteerSection volunteer={volunteer} />}
      {awards?.length > 0 && <AwardsSection awards={awards} />}
      {publications?.length > 0 && (
        <PublicationsSection publications={publications} />
      )}
      {languages?.length > 0 && <LanguagesSection languages={languages} />}
      {interests?.length > 0 && <InterestsSection interests={interests} />}
      {references?.length > 0 && <ReferencesSection references={references} />}
    </Layout>
  );
}

export default Resume;
```

**Include Google Fonts in the HTML head** (in index.js render function):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

### Step 5: Register Theme in themeConfig.js

**Location:** `apps/registry/lib/formatters/template/themeConfig.js`

```javascript
// Add import
import * as yourtheme from 'jsonresume-theme-YOUR-THEME';

// Add to THEMES object
export const THEMES = {
  // ... existing themes
  'your-theme': yourtheme,
};
```

### Step 6: Test Theme Locally

```bash
# Open in browser
open http://localhost:3000/thomasdavis?theme=your-theme

# Verify:
# - All sections render when data present
# - Colors match spec exactly
# - Typography is readable (minimum 15px body text)
# - Layout matches spec description

# Test print preview
# Press Cmd/Ctrl + P
# Verify theme is print-friendly
```

### Step 7: Take Screenshot and Be HYPER-CRITICAL

**CRITICAL: Use the automated script**

```bash
# Run automated screenshot generation with --force flag
node apps/registry/scripts/generate-theme-screenshots-auto.js --force
```

**What this script does:**

- Launches Playwright browser (headless Chromium)
- Navigates to `http://localhost:3000/thomasdavis?theme=YOUR-THEME`
- Captures full-page screenshot (1280x1024 viewport)
- Saves to `apps/homepage2/public/img/themes/YOUR-THEME.png`
- Processes all themes automatically

**Review the screenshot:**

```bash
open apps/homepage2/public/img/themes/your-theme.png
```

### HYPER-CRITICAL Review Checklist

**Be ruthless. Look for EVERY design flaw:**

**Layout & Structure:**

- [ ] Does layout look VISUALLY DIFFERENT from previous theme?
- [ ] Is grid structure clear and intentional?
- [ ] Are columns balanced (not too wide/narrow)?
- [ ] Do borders look deliberate (not too heavy/light)?
- [ ] Is vertical spacing consistent throughout?
- [ ] Does header layout feel purposeful?

**Typography:**

- [ ] Name has good kerning (not too tight: letter-spacing > 0)?
- [ ] Section headers are readable (not too cramped)?
- [ ] Body text is legible (15px+ font size)?
- [ ] Line heights feel comfortable (1.5-1.7 for body)?
- [ ] Font weights create clear hierarchy (900 for headers, 400 for body)?

**Colors & Contrast:**

- [ ] Background color matches spec EXACTLY (check hex)?
- [ ] Accent color matches spec EXACTLY?
- [ ] Text has sufficient contrast (4.5:1 minimum)?
- [ ] Borders are visible (not too subtle)?
- [ ] Backgrounds don't look washed out or too bright?

**Spacing & Padding:**

- [ ] Sections have breathing room (not cramped)?
- [ ] Work items don't overlap or touch?
- [ ] Padding feels intentional (not arbitrary)?
- [ ] Whitespace serves a purpose?
- [ ] Margins are balanced?

**Common Issues to Catch:**

- [ ] Date column wide enough (no text cutoff)?
- [ ] Contact info not cramped in header?
- [ ] Skills badges wrap properly?
- [ ] Bullet points align correctly?
- [ ] Section dividers consistent throughout?
- [ ] No random blue accent lines (unless spec requires)?

**Polish Details:**

- [ ] Borders are consistent weight?
- [ ] Corners don't have weird alignment?
- [ ] Text doesn't overflow containers?
- [ ] Icons/decorative elements visible (opacity > 0.4)?
- [ ] Theme has a cohesive visual identity?

### If You Find ANY Issues

**DO NOT SKIP FIXES. Fix immediately:**

1. Note the specific issue (e.g., "date column cuts off MAY 2021")
2. Edit the Resume.jsx file to fix it
3. Regenerate screenshot: `node apps/registry/scripts/generate-theme-screenshots-auto.js --theme=your-theme --force`
4. Review again
5. Repeat until ZERO issues remain

**Examples of issues to fix immediately:**

- Border too heavy (3px → 2px)
- Name kerning too tight (-1px → +0.5px)
- Sidebar color too subtle (#f5f5f5 → #e8e8e8)
- Date column too narrow (140px → 160px)
- Section header padding excessive (12px → 10px)
- Bullet points wrong style (square → custom ■)

### Step 8: Fix Issues Found in Screenshot

**Common fixes from October 2025 theme review:**

1. **Background too bright** (e.g., `#fef3c7` → `#fef8e7`)
2. **Decorative elements too subtle** (opacity 0.3 → 0.5)
3. **Section title lines overlap text** (add padding, adjust positioning)
4. **Text justification creates awkward spacing** (change to `text-align: left`)
5. **Skills grid too narrow** (increase minmax from 220px to 250px)
6. **Contact info too small** (increase from 14px to 15-16px)
7. **Borders too thin** (increase from 1-2px to 3-4px)

**Example fix pattern:**

```javascript
// BEFORE (too subtle)
const DecorativeCircle = styled.div`
  opacity: 0.3; // TOO SUBTLE
`;

// AFTER (visible)
const DecorativeCircle = styled.div`
  opacity: 0.5; // VISIBLE
`;
```

### Step 9: Re-screenshot After Fixes

```bash
# Regenerate screenshot with fixes
node apps/registry/scripts/generate-theme-screenshots-auto.js --force

# Review again
open apps/homepage2/public/img/themes/your-theme.png

# Iterate until theme matches spec perfectly
```

### Step 10: Commit and Push

```bash
# Stage all changes
git add packages/themes/jsonresume-theme-YOUR-THEME/
git add apps/registry/lib/formatters/template/themeConfig.js
git add apps/homepage2/public/img/themes/your-theme.png

# Commit with descriptive message
git commit -m "$(cat <<'EOF'
fix(themes): improve design quality of your-theme

Fixed critical design issues:
- [List specific fixes, e.g., "softened background color"]
- [List specific fixes, e.g., "increased decorative element opacity"]
- [List specific fixes, e.g., "fixed section title line overlap"]

Regenerated screenshot to reflect design improvements.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# Push to master
git push origin master
```

## Critical Design Issues and Solutions

### Issue: Mid-Century Resume (Oct 2025)

**Problems found in screenshot:**

1. Background color `#fef3c7` too bright yellow
2. Decorative circle opacity 0.3 too subtle
3. Decorative rectangle opacity 0.15 invisible
4. Section title decorative lines overlapped short titles
5. Text justification created awkward spacing
6. Skills grid too narrow at 220px

**Fixes applied:**

1. Background: `#fef3c7` → `#fef8e7` (softer, more neutral)
2. Circle opacity: `0.3` → `0.5` (visible but not overwhelming)
3. Rectangle opacity: `0.15` → `0.25` (serves visual purpose)
4. Section title: Added `padding: 0 100px`, adjusted line positioning (`left: 0` → `left: 20px`)
5. Summary: `text-align: justify` → `text-align: left` (better readability)
6. Skills grid: `minmax(220px)` → `minmax(250px)`, gap `20px` → `24px`

**Lesson:** Small visual adjustments compound. Test with screenshots, not just browser inspection.

### Issue: Diagonal Accent Bar (Oct 2025)

**Problems found:**

- Diagonal bar position relative to viewport, not fixed
- Bar too thin (4px)
- Content needed explicit z-index layering

**Fixes applied:**

- Bar position: `position: relative` → `position: fixed`
- Bar width: `4px` → `6px`
- Content wrapper: Added `position: relative; z-index: 2`

**Lesson:** Decorative elements must be visible but not distracting. Test in different viewport sizes.

### Issue: Typewriter Modern (Oct 2025)

**Problems found:**

- Font size hierarchy weak
- Date positioning on mobile broke layout
- Skills border too subtle

**Fixes applied:**

- Increased section title size
- Added mobile breakpoint for date positioning
- Increased skills border from 1px to 2px

**Lesson:** Always include mobile responsive breakpoints (@media max-width: 640px).

## Contrast Requirements (WCAG AA)

**CRITICAL: All text must meet contrast ratios**

- **Normal text** (<18pt or <14pt bold): Minimum **4.5:1** contrast ratio
- **Large text** (≥18pt or ≥14pt bold): Minimum **3:1** contrast ratio

**Safe color combinations:**

- Dark text on light background: `#111827` on `#ffffff` (15.8:1) ✓
- Light text on dark background: `#f9fafb` on `#111827` (15.3:1) ✓
- Accent on white: `#0066cc` on `#ffffff` (4.8:1) ✓

**Test colors:** Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Screenshot Script Details

### Automated Script: `generate-theme-screenshots-auto.js`

**Location:** `apps/registry/scripts/generate-theme-screenshots-auto.js`

**Usage:**

```bash
# Generate screenshots for all themes
node apps/registry/scripts/generate-theme-screenshots-auto.js

# Force regenerate all screenshots (even if they exist)
node apps/registry/scripts/generate-theme-screenshots-auto.js --force

# Generate screenshot for specific theme only
node apps/registry/scripts/generate-theme-screenshots-auto.js --theme=your-theme

# Specify custom port (if dev server not on 3000)
node apps/registry/scripts/generate-theme-screenshots-auto.js --port=3001

# Specify custom username (default: thomasdavis)
node apps/registry/scripts/generate-theme-screenshots-auto.js --username=testuser
```

**How it works:**

1. Reads theme list from `packages/theme-config/src/metadata.js`
2. Checks if dev server running on http://localhost:3000
3. Launches headless Chromium browser via Playwright
4. For each theme:
   - Navigates to `http://localhost:3000/thomasdavis?theme=THEME_NAME`
   - Waits for network idle
   - Takes full-page screenshot (1280x1024 viewport)
   - Saves to temp directory first
   - Moves to `apps/homepage2/public/img/themes/THEME_NAME.png`
5. Reports success/failure for each theme

**Prerequisites:**

- Dev server running: `cd apps/registry && pnpm dev`
- Playwright installed: `npx playwright install chromium`

**Output example:**

```
🎨 Automated Theme Screenshot Generator

Configuration:
  Dev Server: http://localhost:3000
  Test User: thomasdavis
  Screenshots: /apps/homepage2/public/img/themes
  Force Regenerate: true

🔍 Checking dev server...
✅ Dev server is running

📋 Found 29 theme(s) needing screenshots

🌐 Launching browser...

[1/29] modern-classic
📸 Generating screenshot for 'modern-classic'...
   URL: http://localhost:3000/thomasdavis?theme=modern-classic
   ✅ Saved: /apps/homepage2/public/img/themes/modern-classic.png

============================================================
✅ Successfully generated: 29 screenshot(s)
============================================================
```

## Theme Metadata Configuration

### Single Source of Truth: `packages/theme-config/src/metadata.js`

**CRITICAL: All theme metadata lives in this shared package**

```javascript
// packages/theme-config/src/metadata.js
export const THEME_METADATA = {
  'your-theme': {
    name: 'Your Theme Name',
    description: 'Brief description matching spec vibe',
    vibe: 'professional', // matches spec
    colors: {
      accent: '#0066cc',
      background: '#ffffff',
    },
    typography: {
      primary: 'Inter, sans-serif',
      style: 'modern sans-serif',
    },
  },
  // ... other themes
};

// Auto-generate theme name list
export const THEME_NAMES = Object.keys(THEME_METADATA);

// Utility: Get random theme for demos
export function getRandomTheme() {
  return THEME_NAMES[Math.floor(Math.random() * THEME_NAMES.length)];
}
```

**Why this package exists:**

- Both `apps/registry` and `apps/homepage2` need theme metadata
- Shared workspace package with `workspace:*` protocol
- Prevents duplication and keeps metadata in sync
- Single edit updates all consumers

**Usage in registry:**

```javascript
// apps/registry/lib/formatters/template/themeConfig.js
export { THEME_METADATA, THEME_NAMES } from '@repo/theme-config';
```

**Usage in homepage:**

```javascript
// apps/homepage2/app/themes/page.tsx
import { THEME_METADATA } from '@repo/theme-config';
```

## Theme File Structure

**Theme Resume.jsx files can be any length - no line limit**

Keep all theme code in a single Resume.jsx file. The system currently requires all styled-components and component logic to be in one file for proper rendering.

**Note:** This is a temporary architectural decision. Future refactoring will support modular theme components, but for now, prioritize functionality over file size.

## Checklist: Theme Completion

Before marking theme complete:

- [ ] Read spec from `/packages/themes/ideas.md`
- [ ] Implemented all 12 JSON Resume schema sections
- [ ] Used exact colors from spec (verified hex codes)
- [ ] Typography matches spec (serif vs sans-serif, sizes)
- [ ] Background color matches spec
- [ ] Layout matches spec (spacing, structure)
- [ ] Theme has distinct visual identity (different from other themes)
- [ ] Registered in `apps/registry/lib/formatters/template/themeConfig.js`
- [ ] Added metadata to `packages/theme-config/src/metadata.js`
- [ ] Generated screenshot with automated script
- [ ] Reviewed screenshot for visual issues
- [ ] Fixed all issues found in screenshot
- [ ] Re-generated screenshot to verify fixes
- [ ] Tested print preview (Cmd/Ctrl + P)
- [ ] Verified contrast ratios (WCAG AA compliance)
- [ ] Committed all changes (theme, config, metadata, screenshot)
- [ ] Pushed to master
- [ ] Verified theme works after deployment

## Common Mistakes to Avoid

❌ **Not reading spec before coding** → Build wrong theme entirely
❌ **Skipping screenshot review** → Ship themes with visual issues
❌ **Not fixing issues immediately** → Accumulate technical debt
❌ **Using similar colors across themes** → Themes look identical
❌ **Forgetting Google Fonts CDN** → Theme has no typography
❌ **Text too small** (< 15px body) → Unreadable on print
❌ **Borders too thin** (< 3px dividers) → Invisible in screenshots
❌ **Decorative elements too subtle** (opacity < 0.4) → Pointless
❌ **Text justification on body text** → Awkward spacing
❌ **Not testing print preview** → Users can't print resume
❌ **Missing sections** → Theme incomplete
❌ **Not committing screenshots** → Broken images on homepage

## Key Learnings (October 2025)

1. **Design layout structure FIRST, style SECOND** - Prevents themes from looking identical
2. **Be hyper-critical of screenshots** - Fix ALL issues immediately, iterate until polished
3. **Screenshots catch what code review misses** - Visual issues obvious in screenshots
4. **Layout variety is essential** - Single-column layouts all look the same, vary grid structure
5. **Exact colors matter** - `#fef3c7` vs `#fef8e7` is significant difference
6. **Small adjustments compound** - Opacity 0.3 → 0.5, border 3px → 2px transforms theme
7. **Typography details critical** - Letter-spacing, font-weight, line-height affect readability
8. **Text justification creates problems** - Use `text-align: left` for body text
9. **Decorative elements must be visible** - Opacity < 0.4 is too subtle
10. **Border thickness matters** - 2-3px for dividers, consistency throughout
11. **Date columns need space** - 160px minimum to prevent truncation
12. **Sidebar contrast matters** - #f5f5f5 too subtle, use #e8e8e8 or darker
13. **Automated script is essential** - Manual screenshots inconsistent
14. **Iterate until perfect** - One pass never enough, fix every flaw

## Quick Reference

**Start dev server:**

```bash
cd apps/registry && pnpm dev
```

**Generate all screenshots:**

```bash
node apps/registry/scripts/generate-theme-screenshots-auto.js --force
```

**View theme:**

```bash
open http://localhost:3000/thomasdavis?theme=your-theme
```

**Review screenshot:**

```bash
open apps/homepage2/public/img/themes/your-theme.png
```

**Commit and push:**

```bash
git add packages/themes/ apps/registry/lib/formatters/template/themeConfig.js apps/homepage2/public/img/themes/
git commit -m "fix(themes): improve design quality"
git push origin master
```
