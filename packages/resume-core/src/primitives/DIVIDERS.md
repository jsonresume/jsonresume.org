# Divider and Separator Components

This document describes the five divider and separator components available in @resume/core.

## Overview

All divider components are optimized for:

- **ATS parsing compatibility** - Semantic HTML and proper positioning
- **Print quality** - Minimum stroke weights and color preservation
- **PDF generation** - Fixed dimensions to prevent moiré patterns
- **Accessibility** - Proper ARIA roles and semantic markup

---

## 1. KeylineDivider

Low-contrast horizontal rule with adjustable inset for visual hierarchy.

### Props

| Prop        | Type     | Default            | Description                              |
| ----------- | -------- | ------------------ | ---------------------------------------- |
| `inset`     | `string` | `'0'`              | Horizontal inset from edges (CSS length) |
| `color`     | `string` | Theme border color | Border color                             |
| `className` | `string` | -                  | Additional CSS class                     |

### Design Constraints

- Stroke weight: ≥0.3pt (prevents disappearing in print)
- Uses semantic `<hr>` element
- Print-safe color rendering

### Examples

```tsx
import { KeylineDivider } from '@resume/core';

// Full-width keyline
<KeylineDivider />

// Inset keyline for nested sections
<KeylineDivider inset="1rem" />

// Custom color
<KeylineDivider color="#e5e7eb" />
```

---

## 2. DottedDivider

Dotted horizontal rule for visual rhythm and section separation.

### Props

| Prop        | Type     | Default            | Description          |
| ----------- | -------- | ------------------ | -------------------- |
| `color`     | `string` | Theme border color | Dot color            |
| `spacing`   | `string` | `'4px'`            | Spacing between dots |
| `dotSize`   | `string` | `'2px'`            | Dot size             |
| `className` | `string` | -                  | Additional CSS class |

### Design Constraints

- Fixed dot size (2px) - prevents rendering artifacts
- Fixed spacing (4px) - prevents moiré in PDFs
- Uses semantic `<hr>` element

### Examples

```tsx
import { DottedDivider } from '@resume/core';

// Standard dotted divider
<DottedDivider />

// Custom color
<DottedDivider color="#94a3b8" />

// Sparse dotted divider
<DottedDivider spacing="8px" />
```

---

## 3. AccentSidebarStripe

Narrow decorative accent stripe along the far left or right edge.

### Props

| Prop        | Type                | Default            | Description            |
| ----------- | ------------------- | ------------------ | ---------------------- |
| `width`     | `string`            | `'4mm'`            | Stripe width (max 6mm) |
| `color`     | `string`            | Theme accent color | Stripe color           |
| `position`  | `'left' \| 'right'` | `'left'`           | Edge position          |
| `height`    | `string`            | `'100%'`           | Stripe height          |
| `top`       | `string`            | `'0'`              | Top offset             |
| `className` | `string`            | -                  | Additional CSS class   |

### Design Constraints

- Maximum width: 6mm (≈22.68px) - stays within safe margins
- No text content allowed (decorative only)
- Absolute positioning - doesn't disrupt layout
- ATS-safe: parsers ignore positioned elements

### Examples

```tsx
import { AccentSidebarStripe } from '@resume/core';

// Left accent stripe (needs relative positioned container)
<div style={{ position: 'relative' }}>
  <AccentSidebarStripe />
  <section>Content here</section>
</div>

// Right-aligned stripe
<AccentSidebarStripe position="right" />

// Custom width and color
<AccentSidebarStripe width="6mm" color="#2563eb" />

// Partial height stripe
<AccentSidebarStripe height="150px" top="1rem" />
```

---

## 4. AccentTopRule

Short accent rule positioned above sections for visual hierarchy.

### Props

| Prop        | Type                            | Default            | Description          |
| ----------- | ------------------------------- | ------------------ | -------------------- |
| `width`     | `string`                        | `'30%'`            | Rule width (25-40%)  |
| `align`     | `'left' \| 'center' \| 'right'` | `'left'`           | Alignment            |
| `thickness` | `string`                        | `'2.5pt'`          | Rule thickness       |
| `color`     | `string`                        | Theme accent color | Rule color           |
| `className` | `string`                        | -                  | Additional CSS class |

### Design Constraints

- Length: 25-40% of text width (optimal visual balance)
- Thickness: 2-3pt (prominence without overwhelming)
- Proper spacing via margin-bottom

### Examples

```tsx
import { AccentTopRule } from '@resume/core';

// Standard top rule above section
<AccentTopRule />
<h2>Work Experience</h2>

// Centered rule
<AccentTopRule align="center" />

// Custom width and color
<AccentTopRule width="40%" color="#8b5cf6" />

// Thicker rule
<AccentTopRule thickness="3pt" />
```

---

## 5. RulesetStack

Alternating rule + gap stack for visual grouping and rhythm.

### Props

| Prop            | Type     | Default            | Description                         |
| --------------- | -------- | ------------------ | ----------------------------------- |
| `count`         | `number` | `3`                | Number of rules (2-5)               |
| `gapMultiplier` | `number` | `1`                | Gap multiplier (0.5x, 1x, 1.5x, 2x) |
| `thickness`     | `string` | `'0.4pt'`          | Rule thickness                      |
| `color`         | `string` | Theme border color | Rule color                          |
| `className`     | `string` | -                  | Additional CSS class                |

### Design Constraints

- Gap spacing: multiples of body leading (line-height)
- Rule thickness: 0.3-0.5pt (consistent with keylines)
- Stack count: 2-5 rules (optimal visual balance)

### Examples

```tsx
import { RulesetStack } from '@resume/core';

// Standard 3-rule stack
<RulesetStack count={3} />

// Tight spacing
<RulesetStack count={4} gapMultiplier={0.5} />

// Wide spacing
<RulesetStack count={2} gapMultiplier={2} />

// Custom color and thickness
<RulesetStack count={3} color="#94a3b8" thickness="0.5pt" />
```

---

## Print Optimization

All components include `@media print` rules that:

1. **Preserve colors**: `-webkit-print-color-adjust: exact; print-color-adjust: exact;`
2. **Prevent page breaks**: `page-break-inside: avoid;`
3. **Enforce minimum weights**: Minimum stroke weights for visibility
4. **Fixed dimensions**: Prevent moiré patterns and rendering artifacts

---

## Accessibility

All components follow accessibility best practices:

- Semantic HTML (`<hr>` for horizontal rules)
- ARIA roles (`role="separator"`, `role="presentation"`)
- Proper orientation (`aria-orientation="horizontal"`)
- Hidden decorative elements (`aria-hidden="true"`)

---

## Theme Integration

All components integrate with the @resume/core theme system:

```tsx
import { ThemeProvider } from '@resume/core';

const customTheme = {
  colors: {
    border: '#e5e7eb',
    accent: '#2563eb',
  },
  spacing: {
    tight: '0.5rem',
  },
};

<ThemeProvider theme={customTheme}>
  <KeylineDivider />
  <AccentTopRule />
  {/* Components automatically use theme values */}
</ThemeProvider>;
```

---

## Storybook

All components have Storybook stories for interactive testing:

```bash
pnpm --filter @resume/core storybook
```

Stories available:

- `Primitives/Dividers/KeylineDivider`
- `Primitives/Dividers/DottedDivider`
- `Primitives/Dividers/AccentSidebarStripe`
- `Primitives/Dividers/AccentTopRule`
- `Primitives/Dividers/RulesetStack`

---

## File Locations

```
packages/resume-core/src/primitives/
├── KeylineDivider.tsx
├── KeylineDivider.stories.tsx
├── DottedDivider.tsx
├── DottedDivider.stories.tsx
├── AccentSidebarStripe.tsx
├── AccentSidebarStripe.stories.tsx
├── AccentTopRule.tsx
├── AccentTopRule.stories.tsx
├── RulesetStack.tsx
├── RulesetStack.stories.tsx
└── index.jsx (exports all components)
```

---

## Usage Example: Complete Resume Section

```tsx
import {
  Section,
  SectionTitle,
  AccentTopRule,
  KeylineDivider,
  AccentSidebarStripe,
  RulesetStack,
} from '@resume/core';

function WorkExperience() {
  return (
    <Section id="work">
      {/* Accent stripe along left edge */}
      <AccentSidebarStripe />

      {/* Accent rule above section */}
      <AccentTopRule width="35%" />

      <SectionTitle>Work Experience</SectionTitle>

      {/* Job entries... */}

      {/* Keyline divider between jobs */}
      <KeylineDivider inset="1rem" />

      {/* More job entries... */}

      {/* Ruleset stack at end of section */}
      <RulesetStack count={3} gapMultiplier={0.5} />
    </Section>
  );
}
```
