# JSON Resume Modern Theme

**Clean, minimal design with purple accent and subtle shadows**

A modern take on resume design with card-based layout, hover effects, and a beautiful purple color scheme. Built with [@resume/core](../resume-core) primitives.

## Preview

- **Style**: Modern, minimal, card-based
- **Color**: Purple accent (#8b5cf6)
- **Layout**: Single-column, centered content
- **Features**: Rounded corners, box shadows, hover animations
- **Typography**: System fonts (-apple-system, Inter)

## Installation

```bash
npm install jsonresume-theme-modern
```

## Usage

```javascript
import { render } from 'jsonresume-theme-modern';

const html = render(resumeData);
```

## What Makes This Theme Modern

### Visual Design
- **Card Container**: White background with rounded corners (16px) and subtle shadow
- **Purple Accent**: Modern purple (#8b5cf6) for links, badges, and highlights
- **Hover Effects**: Smooth transitions on interactive elements
- **Typography**: System font stack for native feel

### Unique Features

**1. Border Accent on Items**
```css
.resume-item {
  border-left: 3px solid #f3f4f6;
}
.resume-item:hover {
  border-left-color: var(--resume-color-accent-light);
}
```

**2. Animated Badges**
```css
.resume-badge:hover {
  transform: translateY(-1px);
  background: var(--resume-color-accent);
  color: white;
}
```

**3. Arrow Highlights**
```css
.resume-highlights li::before {
  content: "→";
  color: var(--resume-color-accent);
}
```

## Customization

### Change Accent Color

```css
:root {
  --resume-color-accent: #3b82f6; /* Blue instead of purple */
  --resume-color-accent-light: #dbeafe;
}
```

### Adjust Card Style

```css
.resume-container {
  border-radius: 8px; /* Less rounded */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Stronger shadow */
}
```

### Typography

```css
body {
  font-family: 'Poppins', sans-serif; /* Custom font */
}
```

## Built With @resume/core

This theme demonstrates advanced usage of @resume/core primitives:

- ✅ `Section` - Semantic section wrappers
- ✅ `SectionTitle` - Styled headings with underline
- ✅ `ListItem` - Experience/education items with full metadata
- ✅ `DateRange` - Date formatting with "Present" support
- ✅ `BadgeList` - Skills display with hover effects

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires CSS custom properties and modern flexbox support.

## Print Optimization

Print styles automatically:
- Remove box shadow
- Disable hover effects
- Ensure readable contrast
- Optimize spacing

## Comparison with Reference Theme

| Feature | Reference | Modern |
|---------|-----------|--------|
| Layout | Simple, flat | Card-based, elevated |
| Colors | Blue accent | Purple accent |
| Effects | None | Hover animations |
| Borders | Bottom borders | Left accent borders |
| Typography | Helvetica | System fonts |
| Feel | Professional | Contemporary |

## License

MIT

---

**Part of the [JSON Resume](https://jsonresume.org) ecosystem**
