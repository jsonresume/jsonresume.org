# @resume/core Component Expansion Proposal

## Current State

The `@resume/core` package currently has only 7 basic components:

- Section, SectionTitle, ListItem
- DateRange, Badge/BadgeList
- ContactInfo, Link

## Problem

All themes look similar because they have limited building blocks. Theme creators need more diverse, creative components to design unique resume layouts.

---

## Proposed Component Categories

### 1. Layout Components

**Purpose**: Control overall resume structure and section arrangements

#### `GridLayout`

- 2-column, 3-column layouts
- Configurable gap, column ratios
- Props: `columns={2}`, `gap="2rem"`, `ratio="2:1"`

```jsx
<GridLayout columns={2} gap="2rem">
  <LeftColumn>...</LeftColumn>
  <RightColumn>...</RightColumn>
</GridLayout>
```

#### `SidebarLayout`

- Fixed sidebar + main content area
- Props: `sidebarWidth`, `sidebarPosition="left|right"`

```jsx
<SidebarLayout sidebarWidth="30%" sidebarPosition="left">
  <Sidebar>...</Sidebar>
  <Main>...</Main>
</SidebarLayout>
```

#### `CardLayout`

- Sections displayed as cards/panels
- Props: `elevation`, `bordered`, `padding`

```jsx
<CardLayout elevation={2} bordered>
  <Section>...</Section>
</CardLayout>
```

#### `MasonryLayout`

- Pinterest-style flowing layout
- Props: `columns`, `gap`

#### `StackLayout`

- Vertical/horizontal stacking with spacing
- Props: `direction="vertical|horizontal"`, `gap`, `align`

---

### 2. Section Variants

**Purpose**: Different ways to display resume sections

#### `TimelineSection`

- Visual timeline with connector lines
- Props: `lineColor`, `dotSize`, `dotColor`

```jsx
<TimelineSection>
  <TimelineItem date="2020" title="Senior Dev">
    ...
  </TimelineItem>
</TimelineSection>
```

#### `AccordionSection`

- Collapsible sections (for print: always expanded)
- Props: `defaultExpanded`, `expandIcon`

#### `CardSection`

- Section displayed as a card with shadow/border
- Props: `elevation`, `hoverable`

#### `TabbedSection`

- Multiple sections in tabs (skills, languages, etc.)
- Props: `defaultTab`, `tabPosition="top|left"`

---

### 3. Experience/Work Display Components

**Purpose**: Different ways to display work experience, projects, education

#### `TimelineItem`

- Item for timeline display
- Left/right alternating or single-side
- Props: `position="left|right|alternate"`, `iconType`

```jsx
<TimelineItem
  date="2020-2023"
  title="Senior Developer"
  company="TechCorp"
  icon={<BriefcaseIcon />}
>
  <p>Description...</p>
  <ul>
    <li>Achievement 1</li>
  </ul>
</TimelineItem>
```

#### `CardItem`

- Experience as a card
- Props: `hoverable`, `bordered`, `compact`

```jsx
<CardItem
  title="Senior Developer"
  subtitle="TechCorp"
  date="2020-2023"
  tags={['React', 'Node.js']}
>
  <p>Description...</p>
</CardItem>
```

#### `ListItem` (enhanced)

- Bullet point style (current)
- Add props: `bulletStyle="disc|square|custom"`, `icon`

#### `GridItem`

- Experience displayed in grid format
- Compact, visual, great for many items

---

### 4. Skills Display Components

**Purpose**: Visualize skills, proficiency levels, technologies

#### `SkillBar`

- Progress bar showing proficiency
- Props: `level={80}`, `color`, `showLabel`

```jsx
<SkillBar skill="React" level={90} color="blue" />
```

#### `SkillRating`

- Star/dot rating display
- Props: `rating={4}`, `max={5}`, `icon="star|dot|circle"`

```jsx
<SkillRating skill="JavaScript" rating={5} max={5} icon="star" />
```

#### `SkillPill` / `SkillChip`

- Pill-shaped skill tags
- Props: `variant="filled|outlined"`, `color`, `size`

```jsx
<SkillPill>React</SkillPill>
<SkillPill color="blue" variant="outlined">TypeScript</SkillPill>
```

#### `SkillCloud`

- Word cloud style (larger = more proficient)
- Props: `skills={[{name, level}]}`

#### `SkillGrid`

- Grid of skill cards with icons
- Props: `columns`, `iconSize`

#### `SkillGrouped`

- Skills grouped by category
- Props: `categories={['Frontend', 'Backend']}`

```jsx
<SkillGrouped>
  <SkillCategory name="Frontend">
    <SkillPill>React</SkillPill>
    <SkillPill>Vue</SkillPill>
  </SkillCategory>
</SkillGrouped>
```

---

### 5. Contact/Profile Components

**Purpose**: Display profile, photo, contact information

#### `Avatar`

- Profile photo/image
- Props: `src`, `size`, `shape="circle|square"`, `border`

```jsx
<Avatar src={profileImage} size="large" shape="circle" />
```

#### `ProfileCard`

- Combined name, title, photo, contact
- Props: `layout="vertical|horizontal"`

```jsx
<ProfileCard
  name="John Doe"
  title="Senior Developer"
  image={photo}
  contacts={contactInfo}
  layout="horizontal"
/>
```

#### `ContactGrid`

- Grid layout for contact items
- Props: `columns`, `iconPosition="left|top"`

```jsx
<ContactGrid columns={2}>
  <ContactItem icon={<EmailIcon />} value="john@example.com" />
  <ContactItem icon={<PhoneIcon />} value="+1234567890" />
</ContactGrid>
```

#### `SocialLinks`

- Social media icons/links
- Props: `variant="icon|button|text"`, `size`

```jsx
<SocialLinks variant="icon" size="medium">
  <SocialLink platform="linkedin" url="..." />
  <SocialLink platform="github" url="..." />
</SocialLinks>
```

#### `QRCode`

- QR code for portfolio/website
- Props: `url`, `size`, `label`

---

### 6. Data Visualization Components

**Purpose**: Visual representation of data, achievements

#### `ProgressCircle`

- Circular progress indicator
- Props: `percentage`, `size`, `color`, `strokeWidth`

```jsx
<ProgressCircle percentage={85} size={100} label="TypeScript" />
```

#### `StatCard`

- Display key metrics/stats
- Props: `value`, `label`, `icon`, `trend`

```jsx
<StatCard value="15+" label="Years Experience" icon={<BriefcaseIcon />} />
```

#### `MetricBadge`

- Small badge showing metric
- Props: `value`, `unit`, `variant`

```jsx
<MetricBadge value={50} unit="Projects" />
```

#### `AchievementBadge`

- Award/achievement display
- Props: `icon`, `title`, `date`, `variant="badge|card"`

---

### 7. Typography Components

**Purpose**: Consistent text hierarchy and styling

#### `Heading`

- Hierarchical headings (h1-h6)
- Props: `level={1-6}`, `weight`, `color`, `align`

```jsx
<Heading level={1}>John Doe</Heading>
<Heading level={2} color="primary">Experience</Heading>
```

#### `Text`

- Body text with variants
- Props: `variant="body|caption|small"`, `weight`, `color`

#### `Label`

- Small labels/captions
- Props: `variant="default|muted|accent"`

#### `Quote`

- Styled blockquote
- Props: `bordered`, `icon`, `author`

#### `Emphasis`

- Highlighted/emphasized text
- Props: `variant="bold|italic|underline|highlight"`

---

### 8. Utility/Layout Components

**Purpose**: Spacing, alignment, containers

#### `Divider`

- Horizontal/vertical divider lines
- Props: `orientation="horizontal|vertical"`, `variant="solid|dashed|dotted"`

```jsx
<Divider />
<Divider orientation="vertical" />
```

#### `Spacer`

- Add spacing between elements
- Props: `size="small|medium|large"` or `height`

```jsx
<Spacer size="large" />
```

#### `Container`

- Content container with max-width
- Props: `maxWidth="sm|md|lg|xl"`, `padding`

```jsx
<Container maxWidth="lg">{/* Resume content */}</Container>
```

#### `Box`

- Generic box with padding/margin/border
- Props: `p`, `m`, `border`, `bg`, `radius`

#### `Flex`

- Flexbox wrapper
- Props: `direction`, `justify`, `align`, `gap`, `wrap`

```jsx
<Flex justify="space-between" align="center">
  <div>Left</div>
  <div>Right</div>
</Flex>
```

#### `Grid`

- CSS Grid wrapper
- Props: `columns`, `rows`, `gap`, `areas`

#### `Stack`

- Vertical/horizontal stack with spacing
- Props: `direction="row|column"`, `spacing`, `align`

---

### 9. Header/Footer Components

**Purpose**: Professional header and footer layouts

#### `HeaderCentered`

- Name and contact info centered
- Props: `size`, `divider`

```jsx
<HeaderCentered
  name="John Doe"
  title="Senior Developer"
  contacts={contactInfo}
/>
```

#### `HeaderSplit`

- Name on left, contact on right
- Props: `align`

```jsx
<HeaderSplit name="John Doe" title="Senior Developer" contacts={contactInfo} />
```

#### `HeaderCard`

- Header as a visual card/banner
- Props: `backgroundColor`, `textColor`

#### `HeaderMinimal`

- Compact header for more content space
- Props: `layout="inline|stacked"`

#### `Footer`

- Page footer with page numbers, date
- Props: `showPageNumbers`, `showDate`, `text`

```jsx
<Footer showPageNumbers text="References available upon request" />
```

---

### 10. Quote/Testimonial Components

**Purpose**: Display recommendations and testimonials

#### `PullQuote`

- Large pull quote with attribution
- Props: `author`, `position`, `bordered`

```jsx
<PullQuote author="Jane Smith" position="CTO at TechCorp">
  "Exceptional developer with great attention to detail"
</PullQuQuote>
```

#### `Testimonial`

- Reference/recommendation display
- Props: `layout="card|inline"`, `showPhoto`

```jsx
<Testimonial
  quote="Outstanding work ethic..."
  author="John Manager"
  position="Director of Engineering"
  company="BigCorp"
/>
```

#### `ReferenceCard`

- Contact reference display
- Props: `variant="compact|detailed"`

---

### 11. Certification/Award Components

**Purpose**: Visual display of achievements

#### `CertificationBadge`

- Visual certificate/credential badge
- Props: `icon`, `date`, `issuer`, `variant="badge|card"`

```jsx
<CertificationBadge
  title="AWS Certified Solutions Architect"
  issuer="Amazon Web Services"
  date="2023"
  variant="badge"
/>
```

#### `AwardRibbon`

- Award displayed as ribbon/medal
- Props: `color`, `icon`

#### `AccreditationCard`

- Professional accreditation display
- Props: `logo`, `date`, `expiryDate`

---

### 12. Language/Proficiency Components

**Purpose**: Display language skills and proficiency levels

#### `LanguageBar`

- Language proficiency as bar/scale
- Props: `language`, `level`, `description`

```jsx
<LanguageBar
  language="Spanish"
  level="Professional Working"
  description="Full professional proficiency"
/>
```

#### `LanguageGrid`

- Grid of languages with flags
- Props: `showFlags`, `columns`

#### `ProficiencyScale`

- Visual proficiency scale (CEFR, ILR)
- Props: `scale="CEFR|ILR|custom"`, `level`

---

### 13. Publication/Portfolio Components

**Purpose**: Showcase publications, articles, projects

#### `PublicationCard`

- Academic/professional publication
- Props: `variant="detailed|compact"`, `showAbstract`

```jsx
<PublicationCard
  title="Machine Learning in Production"
  journal="Tech Quarterly"
  date="2023"
  authors={['John Doe', 'Jane Smith']}
  doi="10.1234/example"
/>
```

#### `PortfolioItem`

- Project/work sample display
- Props: `showImage`, `layout="horizontal|vertical"`

```jsx
<PortfolioItem
  title="E-commerce Platform"
  description="Full-stack application..."
  technologies={['React', 'Node.js']}
  url="https://example.com"
/>
```

#### `PatentCard`

- Patent display
- Props: `patentNumber`, `status`

---

### 14. Matrix/Table Components

**Purpose**: Structured data display

#### `SkillMatrix`

- Skills in table/matrix format
- Props: `categories`, `showLevels`

```jsx
<SkillMatrix>
  <SkillRow category="Frontend" skills={['React', 'Vue', 'Angular']} />
  <SkillRow category="Backend" skills={['Node.js', 'Python']} />
</SkillMatrix>
```

#### `ComparisonTable`

- Compare items side-by-side
- Props: `columns`, `headers`

#### `TimelineTable`

- Chronological table view
- Props: `compact`, `bordered`

---

### 15. Callout/Highlight Components

**Purpose**: Draw attention to important information

#### `CalloutBox`

- Highlighted information box
- Props: `variant="info|warning|success"`, `icon`, `bordered`

```jsx
<CalloutBox variant="info" icon={<InfoIcon />}>
  Open to remote opportunities worldwide
</CalloutBox>
```

#### `HighlightBanner`

- Banner for key achievements
- Props: `backgroundColor`, `icon`

```jsx
<HighlightBanner icon={<StarIcon />}>Top 1% performer in 2023</HighlightBanner>
```

#### `FeatureBox`

- Featured information box
- Props: `title`, `bordered`, `shaded`

---

### 16. List Variations

**Purpose**: Different list styles beyond basic bullets

#### `CheckList`

- List with checkmarks
- Props: `checkmarkStyle="check|dot|custom"`

```jsx
<CheckList>
  <CheckListItem>Completed React certification</CheckListItem>
  <CheckListItem>Led team of 5 developers</CheckListItem>
</CheckList>
```

#### `NumberedList`

- Styled numbered list
- Props: `startNumber`, `numberStyle="1|a|i|roman"`

#### `IconList`

- List with custom icons
- Props: `icon`, `iconColor`

```jsx
<IconList icon={<CheckIcon />}>
  <IconListItem>Achievement 1</IconListItem>
  <IconListItem>Achievement 2</IconListItem>
</IconList>
```

#### `MultiColumnList`

- List in multiple columns
- Props: `columns={2}`, `gap`

#### `CompactList`

- Space-efficient list
- Props: `separator=",|•|/"`

---

### 17. Date/Time Components

**Purpose**: Different date formatting styles

#### `DateBadge`

- Date as a badge/pill
- Props: `format`, `color`

```jsx
<DateBadge date="2020-01-15" format="MMM YYYY" />
```

#### `DatePeriod`

- Date range with duration
- Props: `showDuration`, `format`

```jsx
<DatePeriod
  startDate="2020-01"
  endDate="2023-06"
  showDuration
  format="MMM YYYY"
/>
// Renders: "Jan 2020 - Jun 2023 (3.5 years)"
```

#### `Timeline`

- Visual timeline connector
- Props: `position="left|right|center"`, `color`, `dotStyle`

---

### 18. Background/Visual Elements

**Purpose**: Visual enhancements for design

#### `WatermarkText`

- Subtle background watermark
- Props: `text`, `opacity`, `rotation`

```jsx
<WatermarkText text="CONFIDENTIAL" opacity={0.05} />
```

#### `PatternBackground`

- Subtle background patterns
- Props: `pattern="dots|lines|grid"`, `opacity`

#### `ColorAccent`

- Colored accent bar/strip
- Props: `position="left|right|top|bottom"`, `width`, `color`

#### `DecorativeLine`

- Decorative separator lines
- Props: `style="wave|zigzag|dots"`, `color`

---

### 19. Layout Utilities

**Purpose**: Page and print layout helpers

#### `PageBreak`

- Force page break for printing
- Props: `avoid="avoid|auto"`

```jsx
<Section>
  {/* Content */}
</Section>
<PageBreak />
<Section>
  {/* Next page content */}
</Section>
```

#### `ColumnBreak`

- Break in multi-column layouts
- Props: `columns`

#### `KeepTogether`

- Prevent page break within content
- Props: `children`

```jsx
<KeepTogether>
  <WorkItem>{/* Ensures work item doesn't split across pages */}</WorkItem>
</KeepTogether>
```

---

### 20. Icon System

**Purpose**: Consistent iconography across themes

#### `Icon`

- Base icon component
- Props: `name`, `size`, `color`

```jsx
<Icon name="email" size="medium" />
<Icon name="phone" color="primary" />
```

#### Built-in icons:

- Contact: email, phone, location, website, linkedin, github, twitter
- Experience: briefcase, calendar, building, award, certificate
- Skills: code, design, language, tool
- Education: graduation-cap, book, school
- General: chevron, arrow, plus, minus, check, x

---

## Implementation Strategy

### Phase 1: Core Layouts (Priority 1)

- GridLayout, SidebarLayout, StackLayout
- Enhanced Section variants (Timeline, Card)
- **Impact**: Enables dramatically different layouts

### Phase 2: Visual Components (Priority 2)

- SkillBar, SkillPill, SkillRating
- Avatar, ProfileCard
- TimelineItem, CardItem
- **Impact**: Makes themes visually distinct

### Phase 3: Utility & Polish (Priority 3)

- Typography components (Heading, Text, Label)
- Utility components (Divider, Spacer, Flex, Grid)
- Icon system
- **Impact**: Consistency and refinement

### Phase 4: Advanced Features (Priority 4)

- Data visualization (ProgressCircle, StatCard)
- Interactive components (Tooltip, Modal)
- Advanced layouts (Masonry)
- **Impact**: Unique, standout themes

---

## Design Principles

1. **ATS-Friendly**: All components must render as clean HTML
2. **Print-Safe**: Must look good when printed
3. **Themeable**: Accept CSS custom properties for colors, fonts
4. **Composable**: Components should work together seamlessly
5. **Accessible**: Proper semantic HTML and ARIA attributes
6. **Responsive**: Work on mobile, tablet, desktop
7. **Framework-Agnostic**: Use minimal dependencies
8. **Styled-Components**: Use existing styled-components setup

---

## Component API Pattern

Each component should follow this pattern:

```jsx
import styled from 'styled-components';

// Styled component
const StyledComponent = styled.div`
  /* Base styles */
  /* Use CSS custom properties for theming */
`;

// React component
export function ComponentName({
  children,
  variant = 'default',
  size = 'medium',
  ...props
}) {
  return (
    <StyledComponent
      data-component="component-name"
      data-variant={variant}
      {...props}
    >
      {children}
    </StyledComponent>
  );
}

export default ComponentName;
```

---

## CSS Custom Properties for Theming

Components should use CSS custom properties to enable easy theming:

```css
:root {
  /* Colors */
  --resume-color-primary: #0066cc;
  --resume-color-secondary: #333;
  --resume-color-accent: #ff6363;
  --resume-color-text: #1a1a1a;
  --resume-color-muted: #666;
  --resume-color-border: #e0e0e0;
  --resume-color-background: #ffffff;

  /* Typography */
  --resume-font-heading: 'Georgia', serif;
  --resume-font-body: '-apple-system', sans-serif;
  --resume-size-heading: 16pt;
  --resume-size-body: 11pt;
  --resume-size-small: 10pt;

  /* Spacing */
  --resume-space-section: 2rem;
  --resume-space-item: 1rem;
  --resume-space-small: 0.5rem;

  /* Layout */
  --resume-max-width: 8.5in;
  --resume-padding: 1in;
}
```

---

## Example: Building a Creative Theme

With these components, a theme could be built like:

```jsx
<SidebarLayout sidebarWidth="35%">
  <Sidebar>
    <Avatar src={photo} size="xlarge" shape="circle" />
    <Heading level={1}>{name}</Heading>
    <Text variant="caption">{label}</Text>
    <Divider />

    <Section>
      <SectionTitle>Contact</SectionTitle>
      <ContactGrid columns={1}>{/* Contact items */}</ContactGrid>
    </Section>

    <Section>
      <SectionTitle>Skills</SectionTitle>
      <Stack spacing="medium">
        {skills.map((skill) => (
          <SkillBar key={skill.name} skill={skill.name} level={skill.level} />
        ))}
      </Stack>
    </Section>
  </Sidebar>

  <Main>
    <TimelineSection>
      {work.map((job) => (
        <TimelineItem
          key={job.company}
          date={`${job.startDate} - ${job.endDate}`}
          title={job.position}
          company={job.name}
        >
          <Text>{job.summary}</Text>
          <BadgeList>
            {job.keywords.map((k) => (
              <Badge key={k}>{k}</Badge>
            ))}
          </BadgeList>
        </TimelineItem>
      ))}
    </TimelineSection>
  </Main>
</SidebarLayout>
```

This creates a completely different look from traditional themes!

---

## Benefits

1. **Theme Diversity**: Enables 100s of unique theme designs
2. **Faster Development**: Theme creators can focus on design, not implementation
3. **Consistency**: Shared components ensure quality
4. **Maintainability**: Bug fixes benefit all themes
5. **Innovation**: Lowers barrier to creating creative themes
6. **Community**: Contributors can add individual components

---

## Next Steps

1. **Review & Approve**: Get feedback on proposed components
2. **Prioritize**: Decide which components to build first
3. **Build Phase 1**: Start with core layouts
4. **Document**: Create Storybook for component showcase
5. **Migrate**: Update existing themes to use new components
6. **Release**: Version bump and announce new components

---

## File Structure

```
packages/resume-core/
├── src/
│   ├── primitives/           # Existing basic components
│   │   ├── Section.jsx
│   │   ├── SectionTitle.jsx
│   │   ├── Badge.jsx
│   │   └── ...
│   ├── layouts/              # NEW: Layout components
│   │   ├── GridLayout.jsx
│   │   ├── SidebarLayout.jsx
│   │   ├── CardLayout.jsx
│   │   └── index.jsx
│   ├── sections/             # NEW: Section variants
│   │   ├── TimelineSection.jsx
│   │   ├── AccordionSection.jsx
│   │   ├── CardSection.jsx
│   │   └── index.jsx
│   ├── experience/           # NEW: Work/experience display
│   │   ├── TimelineItem.jsx
│   │   ├── CardItem.jsx
│   │   ├── GridItem.jsx
│   │   └── index.jsx
│   ├── skills/               # NEW: Skills display
│   │   ├── SkillBar.jsx
│   │   ├── SkillPill.jsx
│   │   ├── SkillRating.jsx
│   │   ├── SkillCloud.jsx
│   │   └── index.jsx
│   ├── profile/              # NEW: Profile/contact
│   │   ├── Avatar.jsx
│   │   ├── ProfileCard.jsx
│   │   ├── ContactGrid.jsx
│   │   ├── SocialLinks.jsx
│   │   └── index.jsx
│   ├── typography/           # NEW: Text components
│   │   ├── Heading.jsx
│   │   ├── Text.jsx
│   │   ├── Label.jsx
│   │   └── index.jsx
│   ├── data/                 # NEW: Data visualization
│   │   ├── ProgressCircle.jsx
│   │   ├── StatCard.jsx
│   │   ├── MetricBadge.jsx
│   │   └── index.jsx
│   ├── utils/                # NEW: Utility components
│   │   ├── Divider.jsx
│   │   ├── Spacer.jsx
│   │   ├── Container.jsx
│   │   ├── Flex.jsx
│   │   ├── Grid.jsx
│   │   ├── Stack.jsx
│   │   └── index.jsx
│   ├── icons/                # NEW: Icon system
│   │   ├── Icon.jsx
│   │   ├── icons.js
│   │   └── index.jsx
│   └── index.js              # Main export
└── package.json
```

---

**Total Proposed Components: 80+**
**Current Components: 7**
**Increase: ~11x more building blocks**

### New Categories Added:

- **Header/Footer Components** (5): Professional headers and footers
- **Quote/Testimonial Components** (3): References and recommendations
- **Certification/Award Components** (3): Visual achievement displays
- **Language/Proficiency Components** (3): Language skills display
- **Publication/Portfolio Components** (3): Academic and professional work
- **Matrix/Table Components** (3): Structured data display
- **Callout/Highlight Components** (3): Draw attention to key info
- **List Variations** (5): Different list styles
- **Date/Time Components** (3): Advanced date formatting
- **Background/Visual Elements** (4): Design enhancements
- **Layout Utilities** (3): Print layout helpers (PageBreak, KeepTogether)

### All Components Are Print-Friendly:

- No interactive elements (tooltips, modals, accordions)
- All components render properly on paper
- Optimized for ATS scanning
- Print-specific components (PageBreak, KeepTogether, Footer with page numbers)

This will transform theme creation from limited to unlimited creative possibilities!
