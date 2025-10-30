# Tokyo Modernist Resume Theme

A minimal futuristic JSON Resume theme combining geometric precision with expressive typography. Built on an 8pt grid system with clean lines, strong hierarchies, and restrained asymmetry.

## Design Philosophy

Tokyo Modernist balances creative tech sensibility with cultural precision. It looks at home in design studios and modern engineering firms alike, featuring:

- **Typography**: Outfit variable-width geometric sans serif
- **Color**: Deep magenta (#c71585) accents with subtle gray subheaders
- **Layout**: Vertical rhythm built on 8pt grid with tighter line spacing
- **Style**: Minimal futurism meets typographic focus

## Key Features

- **Geometric Precision**: 8px grid-based spacing for perfect alignment
- **Bold Typography**: Strong uppercase headings with negative letter-spacing
- **Asymmetric Elements**: Strategic use of geometric shapes and gradients
- **Minimal Color**: Restrained use of deep magenta for maximum impact
- **Clean Hierarchy**: Clear visual distinction between heading levels
- **Print-Optimized**: Designed to look great on screen and paper

## Design Details

### Typography Scale
- **Name**: 56px, 800 weight, uppercase, -2px letter-spacing
- **Section Titles**: 32px, 800 weight, uppercase, -1px letter-spacing
- **Position**: 22px, 700 weight
- **Company**: 18px, 600 weight, magenta color
- **Body**: 16-17px, 1.7 line height

### Color Palette
- **Primary Text**: #1a1d23 (near-black)
- **Accent**: #c71585 (deep magenta)
- **Subheader**: #6b7280 (gray)
- **Body Text**: #4b5563 (medium gray)
- **Meta Text**: #9ca3af (light gray)
- **Background**: #fafbfc (off-white)

### Geometric Elements
- **8pt Grid**: All spacing in multiples of 8px (8, 16, 24, 32, 40, 48, 56)
- **Triangular Accents**: Clipped diagonal gradients in corners
- **Diamond Bullets**: Custom bullet points using clip-path
- **Gradient Bars**: Vertical gradient stripes in skill cards
- **Hover Effects**: Subtle color transitions and shadow reveals

## Usage

Install the theme:

```bash
npm install @jsonresume/jsonresume-theme-tokyo-modernist
```

Use with JSON Resume CLI:

```bash
resume export resume.html --theme tokyo-modernist
```

Or specify in your resume.json:

```json
{
  "meta": {
    "theme": "tokyo-modernist"
  }
}
```

## Components Used

This theme leverages the @resume/core component library:

- **Section**: Semantic section wrapper
- **SectionTitle**: Heading component
- **DateRange**: Formatted date ranges with localization
- **ContactInfo**: Email, phone, location, profiles

## Browser Support

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Print-optimized for PDF generation
- Responsive design for mobile viewing

## License

MIT

## Credits

Created for jsonresume.org - the open source initiative to create a JSON-based standard for resumes.
