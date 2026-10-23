/**
 * Component documentation. Props tables come from the component types
 * (generated/props.json) and live examples from examples/<slug>/<id>.tsx,
 * so this file only holds the guidance that code can't express.
 */

export type ComponentGroup =
  | 'Actions'
  | 'Typography'
  | 'Layout'
  | 'Site'
  | 'Forms'
  | 'Feedback'
  | 'Data display'
  | 'Overlays'
  | 'Navigation';

export interface ExampleRef {
  id: string;
  title: string;
  description?: string;
  /** Render the preview edge to edge (for full-width bands). */
  bleed?: boolean;
  /** Stack the preview's children instead of laying them out in a row. */
  block?: boolean;
}

export interface ComponentDoc {
  slug: string;
  name: string;
  group: ComponentGroup;
  summary: string;
  /** Exported components whose props are documented on the page. */
  components: string[];
  /** Variant defaults, which the generated props can't read. */
  defaults?: Record<string, string>;
  examples: ExampleRef[];
  guidelines?: { do: string[]; dont: string[] };
  accessibility: string[];
}

export const componentDocs: ComponentDoc[] = [
  {
    slug: 'button',
    name: 'Button',
    group: 'Actions',
    summary:
      'Uppercase, letter-spaced labels on a 2px border, as on jsonresume.org. Buttons do things; links go places.',
    components: ['Button'],
    defaults: { variant: 'secondary', size: 'md' },
    examples: [
      {
        id: 'variants',
        title: 'Variants',
        description:
          'primary (red) is the single main action on a page. secondary is the everyday button. ink is a solid dark alternative for app chrome.',
      },
      {
        id: 'sizes',
        title: 'Sizes',
        description: 'lg matches the home page call to action.',
      },
      {
        id: 'states',
        title: 'Loading, disabled and icon-only',
        description:
          'Loading keeps the label for screen readers and the width for layout.',
      },
      {
        id: 'as-link',
        title: 'As a link',
        description:
          'Use asChild when the action is navigation, so it stays a real link.',
      },
    ],
    guidelines: {
      do: [
        'Use one primary button per view, for the action most people came to take.',
        'Write labels as short verbs: "Publish", "View themes".',
        'Use asChild with a link for navigation.',
      ],
      dont: [
        'Put two primary buttons side by side.',
        'Use the danger variant for anything that is not destructive.',
        'Disable a button without explaining what is missing nearby.',
      ],
    },
    accessibility: [
      'Renders a native <button type="button"> by default, so forms are not submitted by accident.',
      'Icon-only buttons need an aria-label.',
      'loading sets aria-busy and disabled while keeping the accessible name.',
      'Focus shows a 2px ring in the focus token, never removed.',
    ],
  },
  {
    slug: 'heading',
    name: 'Heading',
    group: 'Typography',
    summary:
      'Large headings are light (300), the signature of jsonresume.org; smaller ones step up in weight to stay legible. Level and size are independent.',
    components: ['Heading'],
    examples: [{ id: 'scale', title: 'Scale', block: true }],
    guidelines: {
      do: [
        'Pick level for the document outline and size for the look.',
        'Use one level-1 heading per page.',
      ],
      dont: [
        'Skip levels to get a smaller heading: use size instead.',
        'Bold large headings.',
      ],
    },
    accessibility: [
      'Levels produce real h1–h6 elements, so headings form a navigable outline.',
      'Headings wrap with balanced lines and never truncate.',
    ],
  },
  {
    slug: 'text',
    name: 'Text',
    group: 'Typography',
    summary:
      'Body copy at 14px with generous line height, plus muted, strong and uppercase overline styles.',
    components: ['Text'],
    defaults: { size: 'sm', tone: 'default', weight: 'regular' },
    examples: [{ id: 'tones', title: 'Sizes and tones', block: true }],
    accessibility: [
      'Muted text still meets 4.5:1 on every surface; see Color.',
      'caps is for short labels only: long uppercase text is hard to read.',
    ],
  },
  {
    slug: 'link',
    name: 'Link',
    group: 'Typography',
    summary:
      'Brand-red underlined links for running text; neutral links for navigation lists and footers.',
    components: ['Link'],
    defaults: { tone: 'brand' },
    examples: [{ id: 'tones', title: 'Tones and external links', block: true }],
    guidelines: {
      do: [
        'Link the words that describe the destination.',
        'Use asChild to style a Next.js <Link>.',
      ],
      dont: [
        'Write "click here".',
        'Remove the underline from links inside paragraphs.',
      ],
    },
    accessibility: [
      'Links in text are underlined, so color is not the only cue.',
      'external adds "(opens in a new tab)" for screen readers and a visible icon.',
    ],
  },
  {
    slug: 'code',
    name: 'Code and Kbd',
    group: 'Typography',
    summary: 'Inline code for commands, fields and file names; Kbd for keys.',
    components: ['Code', 'Kbd'],
    examples: [{ id: 'inline', title: 'Inline' }],
    accessibility: [
      'Long identifiers wrap anywhere instead of overflowing the line.',
    ],
  },
  {
    slug: 'prose',
    name: 'Prose',
    group: 'Typography',
    summary:
      'Styles rendered Markdown and other long-form HTML: docs, posts and guides.',
    components: ['Prose'],
    examples: [{ id: 'article', title: 'Article', block: true }],
    accessibility: ['Keeps a 72ch measure so lines stay readable.'],
  },
  {
    slug: 'container',
    name: 'Container',
    group: 'Layout',
    summary:
      'Centers content in the 970px site column with 30px gutters (16px on small screens).',
    components: ['Container'],
    defaults: { size: 'default' },
    examples: [{ id: 'sizes', title: 'Sizes', bleed: true }],
    accessibility: [
      'Reflows to a single column at 320px without horizontal scrolling.',
    ],
  },
  {
    slug: 'section',
    name: 'Section',
    group: 'Layout',
    summary:
      'Full-width bands in the three jsonresume.org surfaces: white, light gray and brand yellow.',
    components: ['Section'],
    defaults: { tone: 'page', spacing: 'md' },
    examples: [{ id: 'tones', title: 'Tones', bleed: true }],
    guidelines: {
      do: [
        'Alternate page and subtle bands to group content.',
        'Keep brand yellow for the top of the page.',
      ],
      dont: ['Stack two yellow bands.', 'Use inverse bands for long text.'],
    },
    accessibility: [
      'Renders a <section>; give it an accessible name with aria-labelledby when it has a heading.',
    ],
  },
  {
    slug: 'stack',
    name: 'Stack',
    group: 'Layout',
    summary: 'One-dimensional layout with gaps from the spacing scale.',
    components: ['Stack'],
    defaults: { direction: 'column', gap: '4' },
    examples: [{ id: 'rows', title: 'Rows and alignment', block: true }],
    accessibility: [
      'Visual order matches source order; avoid reversing it with CSS.',
    ],
  },
  {
    slug: 'grid',
    name: 'Grid',
    group: 'Layout',
    summary:
      'A responsive grid without breakpoints: as many columns as fit the minimum width.',
    components: ['Grid'],
    defaults: { gap: '6' },
    examples: [{ id: 'auto', title: 'Auto-fit columns', block: true }],
    accessibility: ['Items flow in reading order at every width.'],
  },
  {
    slug: 'divider',
    name: 'Divider',
    group: 'Layout',
    summary: 'A 1px rule in the default border color.',
    components: ['Divider'],
    examples: [{ id: 'orientations', title: 'Orientations', block: true }],
    accessibility: [
      'Decorative by default (aria-hidden). Set decorative={false} for a semantic separator.',
    ],
  },
  {
    slug: 'logo',
    name: 'Logo',
    group: 'Site',
    summary:
      'The "JSON Resume" wordmark in Ubuntu Bold, optionally with the document mark.',
    components: ['Logo'],
    defaults: { size: 'md' },
    examples: [{ id: 'sizes', title: 'Sizes and mark' }],
    guidelines: {
      do: [
        'Keep the wordmark black on yellow or white.',
        'Link it to the home page.',
      ],
      dont: [
        'Recolor, stretch or outline the wordmark.',
        'Set it in another typeface.',
      ],
    },
    accessibility: [
      'The mark is decorative; the link name is the wordmark text.',
    ],
  },
  {
    slug: 'site-header',
    name: 'Site header',
    group: 'Site',
    summary:
      'The yellow navigation band. Links collapse behind a menu button on small screens.',
    components: ['SiteHeader', 'SiteHeaderLink'],
    examples: [{ id: 'default', title: 'Header', bleed: true }],
    guidelines: {
      do: [
        'Keep it to five to seven top-level links.',
        'Mark the current section with active.',
      ],
      dont: ['Add a second navigation band below it.'],
    },
    accessibility: [
      'Renders a <header> with a named <nav> landmark.',
      'The menu button exposes aria-expanded and aria-controls.',
      'active sets aria-current="page".',
    ],
  },
  {
    slug: 'page-header',
    name: 'Page header',
    group: 'Site',
    summary:
      'The title band at the top of inner pages: a light 40px title on light gray.',
    components: ['PageHeader'],
    examples: [{ id: 'default', title: 'Page header', bleed: true }],
    accessibility: ['Renders the page’s single h1.'],
  },
  {
    slug: 'hero',
    name: 'Hero',
    group: 'Site',
    summary:
      'The centered yellow promo band from the jsonresume.org home page.',
    components: ['Hero'],
    examples: [{ id: 'promo', title: 'Promo', bleed: true }],
    guidelines: {
      do: [
        'Use it once, on landing pages.',
        'Keep the lede to two short sentences.',
      ],
      dont: ['Put more than two buttons in it.'],
    },
    accessibility: ['The title is the page’s h1; do not add another.'],
  },
  {
    slug: 'feature',
    name: 'Feature',
    group: 'Site',
    summary:
      'A centered teaser column: light title, one or two sentences, one action.',
    components: ['Feature'],
    examples: [{ id: 'row', title: 'Feature row', bleed: true }],
    accessibility: ['Set level to fit the page outline (2 by default).'],
  },
  {
    slug: 'site-footer',
    name: 'Site footer',
    group: 'Site',
    summary: 'Small, centered, uppercase links.',
    components: ['SiteFooter'],
    examples: [{ id: 'default', title: 'Footer', bleed: true }],
    accessibility: ['Renders a <footer> landmark with a list of links.'],
  },
  {
    slug: 'field',
    name: 'Field',
    group: 'Forms',
    summary:
      'Label, hint and error for one control. The control inside picks up its id, aria-describedby, aria-invalid and required automatically.',
    components: ['Field'],
    examples: [{ id: 'basic', title: 'Label, hint and error', block: true }],
    guidelines: {
      do: [
        'Always show a visible label.',
        'Write errors that say how to fix the problem.',
        'Put hints before the control so they are read first.',
      ],
      dont: [
        'Use placeholder text as the label.',
        'Show errors before someone has finished typing.',
      ],
    },
    accessibility: [
      'The label is a real <label for>.',
      'Hint and error are linked with aria-describedby; errors set aria-invalid.',
      'Required fields set the required attribute; the asterisk is hidden from screen readers.',
    ],
  },
  {
    slug: 'input',
    name: 'Input',
    group: 'Forms',
    summary: 'Text inputs in three sizes; lg is the large docs search field.',
    components: ['Input'],
    examples: [{ id: 'sizes', title: 'Sizes', block: true }],
    accessibility: [
      'Give inputs outside a Field an aria-label.',
      'Focus thickens the border in the focus color.',
    ],
  },
  {
    slug: 'textarea',
    name: 'Textarea',
    group: 'Forms',
    summary: 'Multi-line text that resizes vertically.',
    components: ['Textarea'],
    examples: [{ id: 'basic', title: 'Basic', block: true }],
    accessibility: ['Works with Field like Input does.'],
  },
  {
    slug: 'select',
    name: 'Select',
    group: 'Forms',
    summary:
      'A styled native select: keyboard, mobile and screen-reader friendly with no extra code.',
    components: ['Select'],
    examples: [{ id: 'basic', title: 'Basic', block: true }],
    accessibility: [
      'Native semantics; use it instead of a custom listbox whenever options are plain text.',
    ],
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    group: 'Forms',
    summary:
      'A square check in ink, with optional indeterminate state and built-in label.',
    components: ['Checkbox'],
    examples: [{ id: 'basic', title: 'States', block: true }],
    accessibility: [
      'Clicking the label toggles the box.',
      'Space toggles it from the keyboard.',
    ],
  },
  {
    slug: 'switch',
    name: 'Switch',
    group: 'Forms',
    summary: 'An on/off setting that takes effect immediately.',
    components: ['Switch'],
    examples: [{ id: 'basic', title: 'Basic', block: true }],
    guidelines: {
      do: ['Use for settings that apply instantly.'],
      dont: ['Use inside a form that needs a Save button: use Checkbox.'],
    },
    accessibility: ['Exposes role="switch" with its checked state.'],
  },
  {
    slug: 'callout',
    name: 'Callout',
    group: 'Feedback',
    summary:
      'A highlighted note inside content: tips, changes, warnings and errors.',
    components: ['Callout'],
    examples: [{ id: 'tones', title: 'Tones', block: true }],
    guidelines: {
      do: [
        'Lead with the most important words.',
        'Use brand for announcements.',
      ],
      dont: [
        'Use more than one or two per page.',
        'Rely on the color alone: say what happened.',
      ],
    },
    accessibility: [
      'Static callouts are plain content. For messages that appear after an action, wrap them in a live region.',
    ],
  },
  {
    slug: 'badge',
    name: 'Badge',
    group: 'Feedback',
    summary: 'Short status and category labels.',
    components: ['Badge'],
    defaults: { tone: 'neutral' },
    examples: [{ id: 'tones', title: 'Tones' }],
    accessibility: ['Every tone meets 4.5:1 text contrast.'],
  },
  {
    slug: 'progress',
    name: 'Progress',
    group: 'Feedback',
    summary: 'Determinate progress for uploads, imports and completeness.',
    components: ['Progress'],
    examples: [{ id: 'basic', title: 'Basic', block: true }],
    accessibility: [
      'role="progressbar" with a required label and aria-valuenow.',
    ],
  },
  {
    slug: 'spinner',
    name: 'Spinner and Skeleton',
    group: 'Feedback',
    summary:
      'Spinners for short waits; skeletons to hold the shape of loading content.',
    components: ['Spinner', 'Skeleton'],
    examples: [{ id: 'loading', title: 'Loading' }],
    accessibility: [
      'Spinner is a status region with a spoken label.',
      'Skeletons are decorative: mark the loading region aria-busy.',
      'Animations stop when reduced motion is requested.',
    ],
  },
  {
    slug: 'empty-state',
    name: 'Empty state',
    group: 'Feedback',
    summary:
      'What to show when there is nothing yet, and the next step to take.',
    components: ['EmptyState'],
    examples: [{ id: 'basic', title: 'Basic', block: true }],
    accessibility: ['Keep the action a real button or link.'],
  },
  {
    slug: 'card',
    name: 'Card',
    group: 'Data display',
    summary:
      'Bordered tiles with a 2px radius, as in the jsonresume.org theme gallery.',
    components: [
      'Card',
      'CardHeader',
      'CardTitle',
      'CardDescription',
      'CardContent',
      'CardFooter',
      'CardMedia',
    ],
    defaults: { tone: 'outline' },
    examples: [
      { id: 'tones', title: 'Tones', block: true },
      {
        id: 'theme',
        title: 'Theme card',
        description: 'The gallery tile: preview, name, author, action.',
      },
    ],
    accessibility: [
      'CardTitle renders a real heading; set level for the outline (3 by default).',
    ],
  },
  {
    slug: 'table',
    name: 'Table',
    group: 'Data display',
    summary:
      'Data tables with uppercase column labels; scrolls horizontally on narrow screens.',
    components: ['Table', 'Th', 'Td'],
    examples: [{ id: 'basic', title: 'Basic', block: true }],
    accessibility: [
      'Th sets scope="col" by default.',
      'Use caption to name the table.',
    ],
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    group: 'Data display',
    summary: 'A person’s picture, or their initials when there is none.',
    components: ['Avatar'],
    defaults: { size: 'md', shape: 'square' },
    examples: [{ id: 'basic', title: 'Sizes and fallback' }],
    accessibility: [
      'name is required: it is the alt text and the fallback’s accessible name.',
    ],
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    group: 'Overlays',
    summary: 'A modal for confirmations and short tasks.',
    components: [
      'DialogContent',
      'DialogTitle',
      'DialogDescription',
      'DialogFooter',
    ],
    examples: [{ id: 'confirm', title: 'Confirm a destructive action' }],
    guidelines: {
      do: [
        'Title the dialog with the question being asked.',
        'Name buttons after their result.',
      ],
      dont: ['Open a dialog on page load.', 'Nest dialogs.'],
    },
    accessibility: [
      'Focus moves into the dialog and is trapped there; Escape closes it and returns focus.',
      'Title and description are wired to aria-labelledby and aria-describedby.',
    ],
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    group: 'Overlays',
    summary: 'A short hint on hover and keyboard focus.',
    components: ['Tooltip'],
    examples: [{ id: 'basic', title: 'Basic' }],
    guidelines: {
      do: ['Use for supplementary hints only.'],
      dont: ['Put essential information or links in a tooltip.'],
    },
    accessibility: [
      'Shows on focus as well as hover, and dismisses with Escape.',
    ],
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    group: 'Navigation',
    summary:
      'Switch between views of the same content, with a red underline on the active tab.',
    components: ['TabsList', 'TabsTrigger', 'TabsContent'],
    examples: [{ id: 'formats', title: 'Formats', block: true }],
    accessibility: [
      'Arrow keys move between tabs; the list needs an aria-label.',
    ],
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    group: 'Navigation',
    summary: 'Collapsible sections for FAQs and long settings.',
    components: ['AccordionItem', 'AccordionTrigger', 'AccordionContent'],
    examples: [{ id: 'faq', title: 'FAQ', block: true }],
    accessibility: ['Triggers are buttons inside headings with aria-expanded.'],
  },
  {
    slug: 'breadcrumbs',
    name: 'Breadcrumbs',
    group: 'Navigation',
    summary: 'Where a page sits in the hierarchy.',
    components: ['Breadcrumbs', 'BreadcrumbItem'],
    examples: [{ id: 'basic', title: 'Basic' }],
    accessibility: [
      'A named <nav> with an ordered list; the current page sets aria-current.',
    ],
  },
  {
    slug: 'nav-list',
    name: 'Nav list',
    group: 'Navigation',
    summary:
      'Vertical navigation for docs and settings, in the jsonresume.org sidebar style.',
    components: ['NavList', 'NavListItem'],
    examples: [{ id: 'docs', title: 'Docs navigation' }],
    accessibility: ['A named <nav>; active sets aria-current="page".'],
  },
  {
    slug: 'code-block',
    name: 'Code block',
    group: 'Data display',
    summary:
      'The labelled code panel from the schema page, with a copy button.',
    components: ['CodeBlock'],
    examples: [{ id: 'basic', title: 'Basic', block: true }],
    accessibility: [
      'The code region is focusable so keyboard users can scroll it.',
      '"Copied" is announced through a polite live region.',
    ],
  },
];

export const componentGroups: ComponentGroup[] = [
  'Actions',
  'Typography',
  'Layout',
  'Site',
  'Forms',
  'Feedback',
  'Data display',
  'Overlays',
  'Navigation',
];

export const getComponentDoc = (slug: string) =>
  componentDocs.find((d) => d.slug === slug);
