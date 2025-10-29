# Creative Studio - JSON Resume Theme

**Artistic yet professional** resume theme inspired by Behance portfolios. Features clean typography, soft gradient section headers, and creative energy restrained just enough for corporate use while maintaining ATS compatibility.

## Features

- **Rounded Sans-Serif Typography**: Uses Nunito and Poppins for a friendly, modern look
- **Warm Coral Accent**: Signature #ff6363 color for headers, links, and highlights
- **Soft Background Blocks**: Light #fff5f5 sections create subtle visual hierarchy
- **Generous Line Height**: 1.9 line-height for excellent readability
- **Gradient Hero Section**: Soft gradient background in the header for visual interest
- **Tag-Style Keywords**: Rounded pill-shaped tags for skills, projects, and interests
- **Professional Layout**: Single column, 800px max-width, optimized for printing

## Design Philosophy

Creative Studio strikes the perfect balance between artistic flair and professional presentation. It's designed for creative professionals who want to showcase their personality without sacrificing ATS compatibility or corporate acceptance.

## Color Palette

- **Accent**: #ff6363 (warm coral) - headers, links, tags
- **Background**: #fff5f5 (soft pink) - section backgrounds
- **Text**: #333 (dark gray) - primary text
- **Secondary**: #555, #666, #999 - hierarchical text levels

## Typography

- **Headings**: Poppins (weights: 400, 600, 700)
- **Body**: Nunito (weights: 400, 600, 700)
- **Line Height**: 1.9 for exceptional readability

## Installation

```bash
npm install @jsonresume/jsonresume-theme-creative-studio
```

## Usage

### With resume-cli

```bash
resume export resume.html --theme creative-studio
```

### Programmatically

```javascript
const { render } = require('@jsonresume/jsonresume-theme-creative-studio');
const resume = require('./resume.json');

const html = render(resume);
```

## Sections Supported

- ✅ Basics (name, label, contact, profiles)
- ✅ Summary
- ✅ Work Experience
- ✅ Projects (with keyword tags)
- ✅ Education
- ✅ Certificates
- ✅ Publications
- ✅ Awards
- ✅ Volunteer
- ✅ Languages
- ✅ Skills (with keyword tags)
- ✅ Interests (with keyword tags)
- ✅ References

## License

MIT
