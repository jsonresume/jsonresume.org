# JSON Resume Reference Theme

**Reference implementation demonstrating @resume/core best practices**

This theme serves as a complete example of how to build ATS-friendly, framework-agnostic resume themes using the `@resume/core` component library. It's designed to be a template for AI agents and developers to rapidly create new themes.

## Features

- **Framework-Agnostic**: Pure functions, no React/Vue/framework lock-in
- **ATS-Friendly**: Single-column layout, standard fonts, semantic HTML
- **Fully Tested**: 17 comprehensive tests covering all sections
- **Print-Optimized**: Ready for PDF generation and printing
- **Composable**: Uses all @resume/core primitives (Section, SectionTitle, ListItem, DateRange, Badge)
- **Themeable**: CSS variables for easy customization
- **Complete**: Supports all JSON Resume schema sections

## Installation

```bash
npm install jsonresume-theme-reference @resume/core
```

## Usage

```javascript
import { render } from 'jsonresume-theme-reference';

const resume = {
  basics: {
    name: 'Jane Doe',
    label: 'Software Engineer',
    email: 'jane@example.com',
    // ... rest of JSON Resume data
  },
  work: [/* ... */],
  education: [/* ... */],
  // ...
};

const html = render(resume);
```

## What This Theme Demonstrates

### 1. Using @resume/core Primitives

```javascript
import { Section, SectionTitle, ListItem, DateRange, Badge, BadgeList } from '@resume/core';

// Create structured sections
const workSection = Section({
  id: 'work',
  content: `
    ${SectionTitle({ title: 'Work Experience' })}
    ${ListItem({
      title: 'Senior Engineer',
      subtitle: 'TechCorp',
      dateRange: DateRange({ startDate: '2020-01', endDate: null }),
      highlights: ['Led team of 5', 'Reduced costs by 30%'],
    })}
  `,
});
```

### 2. ATS-Friendly Structure

- Single-column layout (no sidebars)
- Semantic HTML (`<header>`, `<section>`, `<h1>`-`<h6>`)
- Standard fonts (Helvetica, Arial)
- No tables or complex layouts
- Proper heading hierarchy

### 3. Comprehensive Section Coverage

Supports all JSON Resume sections:
- ✅ Basics (name, contact, summary)
- ✅ Work Experience
- ✅ Education
- ✅ Skills (with badge lists)
- ✅ Projects
- ✅ Volunteer
- ✅ Awards
- ✅ Publications
- ✅ Languages
- ✅ Interests
- ✅ References

### 4. Graceful Handling of Missing Data

```javascript
// Works with minimal data
const minimalResume = {
  basics: { name: 'John Doe' }
};
const html = render(minimalResume); // No errors, renders what's available
```

### 5. Print Optimization

- Uses CSS variables for consistent spacing
- Respects `@media print` rules from @resume/core
- Single-page optimized (660px max width)

## For AI Agents: How to Build New Themes

This theme is your blueprint. Follow these steps:

### Step 1: Copy the Structure

```bash
cp -r packages/jsonresume-theme-reference packages/jsonresume-theme-yourtheme
```

### Step 2: Customize Design Tokens

```css
/* Override CSS variables */
:root {
  --resume-color-accent: #8b5cf6; /* Your brand color */
  --resume-font-sans: 'Inter', sans-serif; /* Your font */
}
```

### Step 3: Modify Section Layouts

```javascript
// Example: Two-column skills layout
function renderSkills(skills) {
  return Section({
    id: 'skills',
    className: 'two-column-grid', // Add custom class
    content: /* ... */
  });
}
```

### Step 4: Add Custom Styles

Keep inline styles in the `<style>` tag or extract to separate CSS file.

### Step 5: Test Everything

```bash
pnpm --filter jsonresume-theme-yourtheme test
```

## Architecture Patterns

### Pure Functions
All render functions are pure - same input always produces same output:

```javascript
function renderWork(work) {
  // No side effects, no external dependencies
  return work.map(job => ListItem({ /* ... */ })).join('\n');
}
```

### Composition Over Configuration
Build complex layouts by composing primitives:

```javascript
Section({
  content: `
    ${SectionTitle({ title: 'Skills' })}
    ${skills.map(group => `
      <div>
        ${group.name}
        ${BadgeList({ items: group.keywords })}
      </div>
    `).join('')}
  `
})
```

### Single Responsibility
Each function does one thing:
- `renderHero()` - Hero section only
- `renderWork()` - Work section only
- `renderSkills()` - Skills section only

## Testing Strategy

See `tests/theme.test.js` for comprehensive examples:

```javascript
it('renders work experience section', () => {
  const html = render(completeResume);
  expect(html).toContain('Work Experience');
  expect(html).toContain('TechCorp Inc');
  expect(html).toContain('Present'); // DateRange component
});

it('uses all @resume/core primitives', () => {
  const html = render(completeResume);
  expect(html).toContain('resume-section'); // Section
  expect(html).toContain('resume-badge'); // Badge
  expect(html).toContain('resume-item'); // ListItem
});
```

## Performance

- **Bundle Size**: ~8KB minified (no dependencies except @resume/core)
- **Render Time**: <10ms for typical resume
- **Framework**: None (pure functions)

## Browser Support

Works in all modern browsers and generates static HTML for:
- Web viewing
- PDF generation
- Email clients
- Static site generation

## Contributing

This is a **reference implementation** - feel free to fork and customize for your needs. If you find bugs or have suggestions for better patterns, please open an issue.

## License

MIT

---

**Built with [@resume/core](../resume-core)** - Framework-agnostic resume component library
