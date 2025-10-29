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

### Basic Example

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

### Complete Example (All Features)

```javascript
import { render } from 'jsonresume-theme-reference';
import { validateATS } from '@resume/ats-validator';
import fs from 'fs';

// Complete JSON Resume with all 11 sections
const resume = {
  basics: {
    name: 'Jane Doe',
    label: 'Senior Software Engineer',
    image: '',  // Leave empty for ATS compatibility
    email: 'jane.doe@example.com',
    phone: '(555) 123-4567',
    url: 'https://janedoe.dev',
    summary: 'Full-stack engineer with 8 years of experience building scalable web applications.',
    location: {
      address: '',
      postalCode: '',
      city: 'San Francisco',
      countryCode: 'US',
      region: 'CA'
    },
    profiles: [
      {
        network: 'LinkedIn',
        username: 'janedoe',
        url: 'https://linkedin.com/in/janedoe'
      },
      {
        network: 'GitHub',
        username: 'janedoe',
        url: 'https://github.com/janedoe'
      }
    ]
  },
  work: [
    {
      name: 'TechCorp Inc',
      position: 'Senior Software Engineer',
      url: 'https://techcorp.com',
      startDate: '2020-01',
      endDate: null,  // null = "Present"
      summary: 'Led development of microservices architecture serving 10M+ users.',
      highlights: [
        'Reduced API latency by 60% through caching optimization',
        'Mentored team of 5 junior engineers',
        'Implemented CI/CD pipeline reducing deployment time by 80%'
      ],
      location: 'San Francisco, CA'
    },
    {
      name: 'StartupXYZ',
      position: 'Full Stack Developer',
      startDate: '2017-06',
      endDate: '2019-12',
      summary: 'Built customer-facing web application from scratch.',
      highlights: [
        'Launched MVP in 3 months with React and Node.js',
        'Grew user base from 0 to 50,000'
      ]
    }
  ],
  education: [
    {
      institution: 'Stanford University',
      area: 'Computer Science',
      studyType: 'Bachelor of Science',
      startDate: '2013-09',
      endDate: '2017-06',
      score: '3.8',
      courses: [
        'CS106: Programming Abstractions',
        'CS107: Computer Organization',
        'CS161: Design and Analysis of Algorithms'
      ]
    }
  ],
  skills: [
    {
      name: 'Languages',
      keywords: ['JavaScript', 'TypeScript', 'Python', 'Go']
    },
    {
      name: 'Frameworks',
      keywords: ['React', 'Node.js', 'Next.js', 'Express']
    },
    {
      name: 'Tools',
      keywords: ['Docker', 'Kubernetes', 'AWS', 'PostgreSQL']
    }
  ],
  projects: [
    {
      name: 'Open Source Library',
      description: 'TypeScript library for data validation with 10k+ weekly downloads',
      highlights: [
        'Published to npm',
        'Featured in JavaScript Weekly'
      ],
      keywords: ['TypeScript', 'Open Source'],
      startDate: '2021-03',
      url: 'https://github.com/janedoe/awesome-lib'
    }
  ],
  awards: [
    {
      title: 'Hackathon Winner',
      date: '2019-11',
      awarder: 'TechConf 2019',
      summary: 'First place for AI-powered code review tool'
    }
  ],
  publications: [
    {
      name: 'Building Scalable APIs',
      publisher: 'Tech Blog',
      releaseDate: '2022-03',
      url: 'https://blog.example.com/scalable-apis',
      summary: 'Guide to designing high-performance REST APIs'
    }
  ],
  volunteer: [
    {
      organization: 'Code for Good',
      position: 'Mentor',
      url: 'https://codeforgood.org',
      startDate: '2020-01',
      endDate: null,
      summary: 'Mentoring underrepresented groups in tech',
      highlights: ['Coached 20+ students']
    }
  ],
  languages: [
    {
      language: 'English',
      fluency: 'Native speaker'
    },
    {
      language: 'Spanish',
      fluency: 'Professional working proficiency'
    }
  ],
  interests: [
    {
      name: 'Technology',
      keywords: ['AI/ML', 'Web3', 'DevOps']
    },
    {
      name: 'Hobbies',
      keywords: ['Hiking', 'Photography', 'Reading']
    }
  ],
  references: [
    {
      name: 'John Smith',
      reference: 'Jane is an exceptional engineer with strong leadership skills.'
    }
  ]
};

// Render the resume
const html = render(resume);

// Validate ATS compatibility
const validation = validateATS(html);
console.log(`ATS Score: ${validation.score}/100`);

// Save to file
fs.writeFileSync('resume.html', html);

// Generate PDF (if using puppeteer)
// const browser = await puppeteer.launch();
// const page = await browser.newPage();
// await page.setContent(html);
// await page.pdf({ path: 'resume.pdf', format: 'A4' });
// await browser.close();
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

## ATS Validation Integration

This theme is built following ATS-friendly guidelines. You can validate any theme output using `@resume/ats-validator`:

```javascript
import { render } from 'jsonresume-theme-reference';
import { validateATS } from '@resume/ats-validator';

const resume = { /* your resume data */ };
const html = render(resume);

// Validate ATS compatibility
const validation = validateATS(html);

console.log(`ATS Score: ${validation.score}/100`);
console.log(`Passes: ${validation.passes ? 'Yes' : 'No'}`);

if (!validation.passes) {
  console.log('Issues found:');
  validation.issues.forEach(issue => {
    console.log(`- ${issue.message}`);
  });
}
```

**Reference Theme ATS Compliance:**
- ✅ Single-column layout
- ✅ Semantic HTML structure
- ✅ Standard fonts (Helvetica, Arial)
- ✅ No tables for layout
- ✅ No images or charts
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ Print-optimized (660px max width)

**Typical ATS Score: 95+/100**

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
