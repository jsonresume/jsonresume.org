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
      'Body copy at 14px with generous line height, plus muted, strong and uppercase overline styles, and success, warning and danger tones for status words beside a field.',
    components: ['Text'],
    defaults: { size: 'sm', tone: 'default', weight: 'regular' },
    examples: [{ id: 'tones', title: 'Sizes and tones', block: true }],
    accessibility: [
      'Muted text still meets 4.5:1 on every surface; see Color.',
      'caps is for short labels only: long uppercase text is hard to read.',
      'Status tones colour the words that already say the status ("Taken"); never rely on the colour alone.',
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
    examples: [
      { id: 'auto', title: 'Auto-fit columns', block: true },
      { id: 'stretch', title: 'Stretch to fill', block: true },
    ],
    accessibility: ['Items flow in reading order at every width.'],
  },
  {
    slug: 'divider',
    name: 'Divider',
    group: 'Layout',
    summary: 'A 1px rule in the default border color.',
    components: ['Divider'],
    examples: [
      { id: 'orientations', title: 'Orientations', block: true },
      {
        id: 'label',
        title: 'With a label',
        description:
          'A word between options, such as "or" between sign-in methods.',
        block: true,
      },
    ],
    accessibility: [
      'Decorative by default (aria-hidden). Set decorative={false} for a semantic separator.',
      'A label is read as plain text; the rules either side are hidden.',
    ],
  },
  {
    slug: 'app-shell',
    name: 'App shell',
    group: 'Layout',
    summary:
      'The signed-in, full-screen layout: a sidebar from lg up, a top bar with the account menu, and the same navigation in a sheet on small screens.',
    components: ['AppShell', 'AppNav', 'AppPage'],
    examples: [
      { id: 'dashboard', title: 'Dashboard', bleed: true, block: true },
    ],
    guidelines: {
      do: [
        'Use one AppPage per screen: its title is the only h1.',
        'Put filters in the AppPage toolbar, above everything they scope.',
        'Pass renderLink to AppNav so links use your router.',
      ],
      dont: ['Use it for marketing pages; they use SiteHeader and SiteFooter.'],
    },
    accessibility: [
      'A skip link jumps to main. The navigation is a named landmark and marks the current page with aria-current.',
      'The small-screen menu is a dialog titled "Navigation" and closes when a link is followed.',
    ],
  },
  {
    slug: 'auth-card',
    name: 'Auth card',
    group: 'Layout',
    summary:
      'A centred card for sign-in, sign-up and other one-task account pages.',
    components: ['AuthCard', 'GithubIcon'],
    examples: [{ id: 'sign-in', title: 'Sign in', block: true }],
    guidelines: {
      do: ['Offer GitHub first, then email, separated by a labelled Divider.'],
      dont: ['Put site navigation inside the card.'],
    },
    accessibility: [
      'The title is the page h1 and names the card.',
      'GithubIcon is decorative; the button text names the action.',
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
    examples: [
      { id: 'default', title: 'Page header', bleed: true },
      { id: 'brand', title: 'Brand tone', bleed: true },
    ],
    accessibility: ['Renders the page’s single h1.'],
  },
  {
    slug: 'hero',
    name: 'Hero',
    group: 'Site',
    summary:
      'The yellow promo band from the jsonresume.org home page: centered, or split with media beside the copy.',
    components: ['Hero'],
    examples: [
      { id: 'promo', title: 'Promo', bleed: true },
      {
        id: 'split',
        title: 'Split with media',
        description:
          'Pass media (a code sample or screenshot) to put it beside the copy from the lg breakpoint. Below it, the media stacks under the copy.',
        bleed: true,
      },
      {
        id: 'compact',
        title: 'Compact, start-aligned',
        description:
          'size="compact" and align="start" for inner pages: the same band with less height.',
        bleed: true,
      },
    ],
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
    slug: 'steps',
    name: 'Steps',
    group: 'Site',
    summary:
      'A numbered "how it works" sequence for landing pages: a short title and a sentence per step.',
    components: ['Steps', 'Step'],
    examples: [
      { id: 'default', title: 'Three steps', block: true },
      {
        id: 'vertical',
        title: 'Vertical',
        description:
          'layout="vertical" for half-width columns: numbers beside the copy, code inside steps scrolls.',
        block: true,
      },
    ],
    guidelines: {
      do: ['Keep it to three or four steps.', 'Start each title with a verb.'],
      dont: ['Use it for navigation or progress through a form.'],
    },
    accessibility: [
      'Renders an <ol>, so the numbers are announced by the list itself.',
      'Set level on each Step to fit the page outline (3 by default).',
    ],
  },
  {
    slug: 'stats',
    name: 'Stats',
    group: 'Site',
    summary:
      'A row of headline figures for landing pages. For dashboards, use Stat tile.',
    components: ['Stats', 'Stat'],
    examples: [{ id: 'default', title: 'Figures', block: true }],
    guidelines: {
      do: ['Use real, current numbers and round them for reading.'],
      dont: ['Show more than four or five figures in a row.'],
    },
    accessibility: [
      'Renders a <dl>; each label is the term and its figure the description.',
    ],
  },
  {
    slug: 'section-intro',
    name: 'Section intro',
    group: 'Site',
    summary:
      'The opening of a page section: overline, light title and a one-line lede.',
    components: ['SectionIntro'],
    examples: [{ id: 'default', title: 'Section intro', block: true }],
    accessibility: [
      'Set level to fit the page outline (2 by default); pass headingId to label a <section> with it.',
    ],
  },
  {
    slug: 'link-card',
    name: 'Link card',
    group: 'Navigation',
    summary:
      'A whole card that links somewhere: title with an arrow, description and optional details.',
    components: ['LinkCard'],
    examples: [{ id: 'grid', title: 'Choices in a grid', block: true }],
    guidelines: {
      do: ['Use for a small set of destinations a reader chooses between.'],
      dont: ['Put other links or buttons inside; the whole card is one link.'],
    },
    accessibility: [
      'The card is a single <a>, named by its text. Use asChild to render through a router link.',
    ],
  },
  {
    slug: 'code-tabs',
    name: 'Code tabs',
    group: 'Data display',
    summary:
      'The same step written several ways (npm, pnpm, npx), one tab each, each copyable.',
    components: ['CodeTabs'],
    examples: [{ id: 'install', title: 'Install command', block: true }],
    accessibility: [
      'Radix tabs: arrow keys move between tabs; label names the tab list.',
    ],
  },
  {
    slug: 'on-this-page',
    name: 'On this page',
    group: 'Navigation',
    summary:
      'In-page navigation for long pages, sticky from lg up, marking the section in view.',
    components: ['OnThisPage'],
    examples: [{ id: 'default', title: 'Sections', block: true }],
    accessibility: [
      'A <nav> landmark named "On this page"; the current link has aria-current.',
    ],
  },
  {
    slug: 'chip-group',
    name: 'Chip group',
    group: 'Forms',
    summary:
      'Pick one of many short options, or none, as a row of toggle chips.',
    components: ['ChipGroup'],
    examples: [{ id: 'filter', title: 'Category filter', block: true }],
    guidelines: {
      do: ['Use for filters with up to a dozen or so options.'],
      dont: ['Use for choices that need more than a word or two; use Select.'],
    },
    accessibility: [
      'Each chip is a toggle button with aria-pressed, in a group named by label.',
    ],
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
    examples: [
      { id: 'basic', title: 'Label, hint and error', block: true },
      { id: 'form', title: 'A complete form', block: true },
    ],
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
    examples: [
      { id: 'basic', title: 'States', block: true },
      {
        id: 'group',
        title: 'Group',
        description: 'A fieldset and legend name the group for screen readers.',
        block: true,
      },
    ],
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
    examples: [
      { id: 'tones', title: 'Tones' },
      { id: 'in-context', title: 'In context', block: true },
    ],
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
    ],
  },
  {
    slug: 'empty-state',
    name: 'Empty state',
    group: 'Feedback',
    summary:
      'What to show when there is nothing yet, and the next step to take.',
    components: ['EmptyState'],
    examples: [
      { id: 'basic', title: 'Basic', block: true },
      { id: 'with-icon', title: 'With an icon', block: true },
    ],
    accessibility: [
      'Keep the action a real button or link.',
      'The icon is decorative; the title carries the meaning.',
    ],
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
      'tone="danger" frames irreversible actions; its heading and button must say what happens, not the border alone.',
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
    examples: [
      { id: 'basic', title: 'Sizes and fallback' },
      { id: 'team', title: 'Team list', block: true },
    ],
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
    examples: [
      { id: 'confirm', title: 'Confirm a destructive action' },
      {
        id: 'form',
        title: 'A short form',
        description: 'Keep dialog forms to one or two fields.',
      },
    ],
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
  {
    slug: 'dropdown-menu',
    name: 'Dropdown menu',
    group: 'Overlays',
    summary: 'A button that opens a short list of actions or options.',
    components: [
      'DropdownMenuContent',
      'DropdownMenuItem',
      'DropdownMenuCheckboxItem',
      'DropdownMenuLabel',
    ],
    examples: [
      {
        id: 'actions',
        title: 'Actions',
        description: 'Icons, a shortcut hint and a destructive item last.',
      },
      {
        id: 'checkboxes',
        title: 'Options',
        description: 'Checkbox items keep the menu open while toggling.',
      },
    ],
    guidelines: {
      do: [
        'Keep menus to about seven items.',
        'Put destructive actions last, after a separator, in the danger tone.',
      ],
      dont: [
        'Hide the only way to do something important in a menu.',
        'Nest menus.',
      ],
    },
    accessibility: [
      'Opens with Enter, Space or Arrow Down; arrows move, Enter selects, Escape closes and returns focus.',
      'Type-ahead jumps to items by their first letter.',
    ],
  },
  {
    slug: 'popover',
    name: 'Popover',
    group: 'Overlays',
    summary:
      'An anchored panel for rich content: details, small forms, quick filters.',
    components: ['PopoverContent'],
    examples: [{ id: 'details', title: 'Details on demand' }],
    guidelines: {
      do: [
        'Use for content richer than a sentence.',
        'Give the content an aria-label or a heading.',
      ],
      dont: [
        'Use for plain hints: use Tooltip.',
        'Put a whole form in one: use Dialog or Sheet.',
      ],
    },
    accessibility: [
      'A non-modal dialog: focus moves in, Escape or clicking outside closes it.',
    ],
  },
  {
    slug: 'sheet',
    name: 'Sheet',
    group: 'Overlays',
    summary:
      'A modal panel that slides over the page, for details or filters that keep the list behind in view.',
    components: [
      'SheetContent',
      'SheetHeader',
      'SheetBody',
      'SheetFooter',
      'SheetTitle',
      'SheetDescription',
    ],
    examples: [
      { id: 'job-details', title: 'Job details' },
      { id: 'sides', title: 'Sides' },
    ],
    accessibility: [
      'A modal dialog: focus is trapped inside and returns to the trigger on close.',
      'SheetTitle and SheetDescription name and describe it.',
    ],
  },
  {
    slug: 'toast',
    name: 'Toast',
    group: 'Feedback',
    summary:
      'A brief, non-blocking message after an action: saved, hidden, failed.',
    components: ['Toaster'],
    examples: [
      {
        id: 'tones',
        title: 'Tones and actions',
        description:
          'Success, an undo action, and an error that stays announced assertively.',
      },
    ],
    guidelines: {
      do: [
        'Confirm actions that happen out of view.',
        'Offer Undo instead of asking "Are you sure?".',
      ],
      dont: [
        'Put the only copy of important information in a toast.',
        'Show more than one at a time for one action.',
      ],
    },
    accessibility: [
      'Announced through a live region; errors use an assertive announcement.',
      'Timers pause on hover and focus; F8 moves focus to the notifications region.',
    ],
  },
  {
    slug: 'banner',
    name: 'Banner',
    group: 'Feedback',
    summary:
      'A page-wide notice above the content, optionally with an action and a dismiss button.',
    components: ['Banner'],
    defaults: { tone: 'brand' },
    examples: [
      { id: 'public-view', title: 'Public view', bleed: true },
      { id: 'tones', title: 'Tones', bleed: true },
    ],
    accessibility: [
      'A named region, so it is easy to find and skip.',
      'The dismiss button is labelled.',
    ],
  },
  {
    slug: 'tab-nav',
    name: 'Tab navigation',
    group: 'Navigation',
    summary: 'Tabs that are links: moving between sibling pages of one area.',
    components: ['TabNav', 'TabNavLink'],
    examples: [{ id: 'profile', title: 'Profile area', block: true }],
    guidelines: {
      do: ['Use when each tab has its own URL.'],
      dont: [
        'Use for panels inside one page: use Tabs, which manage focus between panels.',
      ],
    },
    accessibility: [
      'A named nav landmark; the current page sets aria-current="page".',
    ],
  },
  {
    slug: 'account-menu',
    name: 'Account menu',
    group: 'Navigation',
    summary:
      'The signed-in user’s avatar in the header, opening their links and sign out.',
    components: ['AccountMenu'],
    examples: [{ id: 'header', title: 'In the site header', bleed: true }],
    accessibility: [
      'The trigger is named "Account: <name>" when only the avatar shows.',
    ],
  },
  {
    slug: 'pagination',
    name: 'Pagination',
    group: 'Navigation',
    summary:
      'Move through long result sets by page, or append the next page with Load more.',
    components: ['Pagination', 'LoadMore'],
    examples: [
      {
        id: 'pages',
        title: 'Pages',
        description: 'First, last and the pages around the current one.',
      },
      { id: 'load-more', title: 'Load more', block: true },
    ],
    guidelines: {
      do: [
        'Use pages when people return to a position; Load more for browsing feeds.',
      ],
      dont: ['Combine both on one list.'],
    },
    accessibility: [
      'A named nav; the current page sets aria-current and every button is labelled ("Page 3", "Next").',
      'Load more announces the new count politely.',
    ],
  },
  {
    slug: 'back-link',
    name: 'Back link',
    group: 'Navigation',
    summary: 'Return to the parent list from a detail page.',
    components: ['BackLink'],
    examples: [{ id: 'basic', title: 'Basic' }],
    accessibility: [
      'Name it after the destination ("Back to jobs"); the arrow is decorative.',
    ],
  },
  {
    slug: 'search-field',
    name: 'Search field',
    group: 'Forms',
    summary:
      'Search input with an icon, a clear button and a debounced search callback.',
    components: ['SearchField'],
    defaults: { size: 'md' },
    examples: [
      { id: 'basic', title: 'Debounced search', block: true },
      { id: 'large', title: 'Large', block: true },
    ],
    accessibility: [
      'A real search input (role searchbox); label it with Field or aria-label.',
      'Escape clears; the clear button is labelled.',
    ],
  },
  {
    slug: 'filter-bar',
    name: 'Filter bar',
    group: 'Forms',
    summary:
      'Facet filters together, with active-filter chips, a result count and Clear all.',
    components: ['FilterBar', 'Chip'],
    examples: [{ id: 'jobs', title: 'Job board filters', block: true }],
    guidelines: {
      do: [
        'Apply filters as they change; show the result count.',
        'Name chips with the value, not the field ("Remote").',
      ],
      dont: ['Add an Apply button for instant filters.'],
    },
    accessibility: [
      'A named region; the result count is announced politely.',
      'Each chip has a "Remove <filter>" button.',
    ],
  },
  {
    slug: 'segmented-control',
    name: 'Segmented control',
    group: 'Forms',
    summary: 'Pick one of a few modes in place, such as Form, JSON or AI.',
    components: ['SegmentedControl'],
    examples: [{ id: 'modes', title: 'Editor modes' }],
    guidelines: {
      do: ['Use for two to five short, mutually exclusive modes.'],
      dont: [
        'Use to switch panels of content: use Tabs.',
        'Use for navigation: use TabNav.',
      ],
    },
    accessibility: [
      'A labelled radio group: Tab enters, arrow keys move and select.',
    ],
  },
  {
    slug: 'tag-input',
    name: 'Tag input',
    group: 'Forms',
    summary:
      'Add and remove short values as chips: skills, keywords, highlights.',
    components: ['TagInput'],
    examples: [{ id: 'skills', title: 'Skills' }],
    accessibility: [
      'Enter or comma adds; Backspace on an empty field removes the last tag.',
      'Every tag has a labelled remove button; works inside Field.',
    ],
  },
  {
    slug: 'range-slider',
    name: 'Range slider',
    group: 'Forms',
    summary:
      'Choose a value or a min–max range, optionally over a distribution.',
    components: ['RangeSlider'],
    examples: [
      {
        id: 'salary',
        title: 'Salary range over listings',
        description: 'Bars show how many jobs fall in each bucket.',
      },
      { id: 'single', title: 'Single value' },
    ],
    accessibility: [
      'Each thumb is a slider with a name and a formatted aria-valuetext ("$120k").',
      'Arrow keys step; Page Up/Down and Home/End jump.',
    ],
  },
  {
    slug: 'combobox',
    name: 'Combobox',
    group: 'Forms',
    summary: 'A select you can type into, for long option lists.',
    components: ['Combobox'],
    examples: [{ id: 'countries', title: 'Countries' }],
    guidelines: {
      do: ['Use when there are more than about 15 options.'],
      dont: ['Use for a handful of options: use Select or SegmentedControl.'],
    },
    accessibility: [
      'Follows the ARIA combobox pattern: arrow keys move through options (aria-activedescendant), Enter picks, Escape closes.',
    ],
  },
  {
    slug: 'file-dropzone',
    name: 'File drop zone',
    group: 'Forms',
    summary:
      'Drag files in or browse, with type and size checks and a list of chosen files.',
    components: ['FileDropzone', 'FileList'],
    examples: [{ id: 'resume', title: 'Resume upload', block: true }],
    accessibility: [
      'Browsing uses a real button, so the drop area is never the only way in.',
      'Rejected files are explained in an alert.',
    ],
  },
  {
    slug: 'repeater',
    name: 'Repeatable entries',
    group: 'Forms',
    summary:
      'Add, remove and reorder entries of one shape: work, education, profiles.',
    components: ['Repeater'],
    examples: [{ id: 'work', title: 'Work history' }],
    accessibility: [
      'Each entry is a region named by its title, with a heading.',
      'Move and remove buttons name the entry they act on; changes are announced.',
    ],
  },
  {
    slug: 'chat-composer',
    name: 'Chat composer',
    group: 'Forms',
    summary:
      'A multi-line message input that grows with the text: Enter sends, Shift+Enter adds a line.',
    components: ['ChatComposer'],
    examples: [
      { id: 'copilot', title: 'Copilot with voice input', block: true },
    ],
    accessibility: [
      'The textarea is labelled; the Send button shows progress while a reply streams.',
      'Enter does not send during IME composition.',
    ],
  },
  {
    slug: 'code-editor',
    name: 'Code editor',
    group: 'Forms',
    summary:
      'JSON editing with highlighting, live parse errors and your own validation (e.g. the schema).',
    components: ['CodeEditor'],
    examples: [
      { id: 'resume', title: 'resume.json with a schema check', block: true },
    ],
    accessibility: [
      'The editor is labelled; a status line announces the number of problems.',
      'Tab indents inside the editor; Escape then Tab moves focus out.',
    ],
  },
  {
    slug: 'page-state',
    name: 'Page states',
    group: 'Feedback',
    summary:
      'Loading, error, not found and empty, for a whole page or a panel.',
    components: ['PageState'],
    examples: [{ id: 'kinds', title: 'Kinds', block: true }],
    guidelines: {
      do: [
        'Say what happened and offer the next step.',
        'Use the panel size for regions inside a page.',
      ],
      dont: [
        'Show a blank page while loading.',
        'Show stack traces outside “Technical details”.',
      ],
    },
    accessibility: [
      'Errors are alerts; loading states are announced through a status region and set aria-busy.',
      'Set level so the title fits the page outline.',
    ],
  },
  {
    slug: 'error-boundary',
    name: 'Error boundary',
    group: 'Feedback',
    summary:
      'Catches a crashed region so the rest of the page keeps working, and offers Try again.',
    components: ['ErrorBoundary'],
    examples: [{ id: 'panel', title: 'A panel that breaks', block: true }],
    accessibility: [
      'The default fallback is an alert with a Try again button.',
    ],
  },
  {
    slug: 'sign-in-gate',
    name: 'Sign-in gate',
    group: 'Feedback',
    summary:
      'Explains what signing in unlocks, and offers Sign in with GitHub.',
    components: ['SignInGate'],
    examples: [{ id: 'jobs', title: 'Job tracking', block: true }],
    accessibility: [
      'The sign-in control is a real link (signInHref) or button (onSignIn).',
    ],
  },
  {
    slug: 'score-meter',
    name: 'Score meter',
    group: 'Feedback',
    summary: 'A 0–100 score with rating bands, as a ring or a bar.',
    components: ['ScoreMeter'],
    examples: [
      { id: 'ring', title: 'Ring', block: true },
      { id: 'bar', title: 'Bar' },
    ],
    guidelines: {
      do: ['Say what the score measures and what to do about it nearby.'],
      dont: ['Rely on the color: the band label is always shown.'],
    },
    accessibility: [
      'An ARIA meter whose value text includes the band ("84 out of 100, Strong").',
    ],
  },
  {
    slug: 'status-toggle',
    name: 'Status toggle',
    group: 'Feedback',
    summary: 'Mark an item interested, read or hidden; press again to clear.',
    components: ['StatusToggle'],
    examples: [{ id: 'job', title: 'Job status with Undo' }],
    accessibility: [
      'A labelled group of toggle buttons with aria-pressed.',
      'Icon-only toggles get their label as aria-label and a title.',
    ],
  },
  {
    slug: 'stat-tile',
    name: 'Stat tile',
    group: 'Data display',
    summary: 'A key number with its label and how it changed.',
    components: ['StatTile', 'Sparkline'],
    examples: [
      { id: 'dashboard', title: 'Dashboard', block: true },
      {
        id: 'delta-trend',
        title: 'Delta and trend',
        description:
          'delta is a fraction of the previous period, shown signed and named by its label. trend draws a sparkline: context in gray, the latest point in the accent.',
        block: true,
      },
    ],
    guidelines: {
      do: ['Pair every number with what it means and a comparison.'],
      dont: ['Show more than four or five tiles in a row.'],
    },
    accessibility: [
      'A labelled group; the trend arrow is decorative and the change is spoken as "Up 12%".',
      'lowerIsBetter flips which direction reads as good.',
    ],
  },
  {
    slug: 'description-list',
    name: 'Description list',
    group: 'Data display',
    summary: 'Labelled facts in pairs: location, salary, type.',
    components: ['DescriptionList'],
    examples: [{ id: 'job', title: 'Inline and columns', block: true }],
    accessibility: ['A real dl with dt and dd pairs.'],
  },
  {
    slug: 'job-card',
    name: 'Job card',
    group: 'Data display',
    summary: 'A job summary: role, company, essentials, match and actions.',
    components: ['JobCard'],
    examples: [{ id: 'list', title: 'Job list', block: true }],
    accessibility: [
      'An article whose title is the single link; the whole card is clickable through it.',
      'Footer controls stay separately focusable.',
    ],
  },
  {
    slug: 'resume-card',
    name: 'Resume card',
    group: 'Data display',
    summary:
      'A person summary from their resume: avatar, name, headline and skills.',
    components: ['ResumeCard'],
    examples: [{ id: 'explore', title: 'Explore', block: true }],
    accessibility: ['The name is the link; long skill lists collapse to "+n".'],
  },
  {
    slug: 'markdown',
    name: 'Markdown',
    group: 'Data display',
    summary:
      'Renders Markdown, including streamed model output, in the brand prose style.',
    components: ['Markdown'],
    examples: [{ id: 'suggestions', title: 'Suggestions', block: true }],
    accessibility: [
      'Raw HTML is ignored, so untrusted text is safe to render.',
      'Headings keep their levels; tables and task lists use real elements.',
    ],
  },
  {
    slug: 'copy-button',
    name: 'Copy button',
    group: 'Data display',
    summary: 'Copies a value, such as a link or an API key, and confirms it.',
    components: ['CopyButton'],
    examples: [{ id: 'link', title: 'Copy a link' }],
    accessibility: [
      'The confirmation is announced through a polite live region.',
    ],
  },
  {
    slug: 'checklist',
    name: 'Checklist',
    group: 'Data display',
    summary: 'Results of a set of checks, each passed, a warning or failed.',
    components: ['Checklist'],
    examples: [{ id: 'ats', title: 'ATS checks', block: true }],
    accessibility: [
      'Each result states its outcome in words ("Failed: …"), not only by icon color.',
    ],
  },
  {
    slug: 'secret-field',
    name: 'Secret field',
    group: 'Data display',
    summary: 'A masked secret with reveal, copy and room for rotate or revoke.',
    components: ['SecretField'],
    examples: [{ id: 'api-key', title: 'API key', block: true }],
    accessibility: [
      'Masked values are announced as "Hidden, ends in 1234"; Reveal is a toggle button.',
    ],
  },
  {
    slug: 'chat',
    name: 'Chat messages',
    group: 'Data display',
    summary:
      'The conversation log for copilots: attributed messages, streaming, tool calls.',
    components: ['ChatMessages', 'ChatMessage', 'ChatToolCall'],
    examples: [{ id: 'copilot', title: 'Resume copilot' }],
    accessibility: [
      'A labelled log region announcing new messages politely.',
      'Each message is an article named by its author; the typing state is spoken.',
      'The view follows new messages only while the reader is at the bottom.',
    ],
  },
  {
    slug: 'activity-feed',
    name: 'Activity feed',
    group: 'Data display',
    summary: 'Time-stamped events, newest first, with relative times.',
    components: ['ActivityFeed'],
    examples: [{ id: 'recent', title: 'Recent activity', block: true }],
    accessibility: [
      'Each time is a time element with the exact date in its title.',
    ],
  },
  {
    slug: 'timeline',
    name: 'Timeline',
    group: 'Data display',
    summary: 'A vertical career or project timeline.',
    components: ['Timeline'],
    examples: [{ id: 'career', title: 'Career', block: true }],
    accessibility: ['An ordered list; each entry has a heading.'],
  },
  {
    slug: 'charts',
    name: 'Charts',
    group: 'Data display',
    summary: 'Bar, line and radar charts on brand tokens, each with its data.',
    components: ['BarChart', 'LineChart', 'RadarChart'],
    examples: [
      { id: 'bar', title: 'Bar chart', block: true },
      { id: 'line', title: 'Line chart', block: true },
      { id: 'radar', title: 'Radar chart' },
    ],
    guidelines: {
      do: [
        'Write the summary as the conclusion the chart supports.',
        'Highlight the one bar that matters.',
      ],
      dont: [
        'Use more than four line series.',
        'Use a radar chart for fewer than three dimensions.',
      ],
    },
    accessibility: [
      'Each chart is a figure with a one-sentence summary (role img) and a "Show data" table.',
      'Points and bars carry titles for hover.',
    ],
  },
  {
    slug: 'time-series-chart',
    name: 'Time series chart',
    group: 'Data display',
    summary:
      'Change over time for one or two series: an area under the first, a line for the second, a crosshair and one tooltip for every series.',
    components: ['TimeSeriesChart'],
    examples: [
      { id: 'views', title: 'Two series', block: true },
      {
        id: 'single',
        title: 'One series',
        description: 'One series needs no legend: the title names it.',
        block: true,
      },
      { id: 'empty', title: 'No data', block: true },
    ],
    guidelines: {
      do: [
        'Write the summary as the conclusion the chart supports.',
        'Put the date range in the one filter row above the charts, and pass loading while it refetches so the old data stays.',
      ],
      dont: [
        'Plot two measures of different scale together: make two charts.',
        'Add a third series; fold it into another chart instead.',
      ],
    },
    accessibility: [
      'A focusable group named by the summary; arrow keys, Home and End step through the days and the readout is announced.',
      'The tooltip repeats what "Show data" lists, so no value is only on hover.',
      'Series colours are validated for colour vision deficiency, light and dark; two series also get a legend.',
    ],
  },
  {
    slug: 'bar-list',
    name: 'Bar list',
    group: 'Data display',
    summary:
      'Ranked categories as labelled thin bars: top sources, countries, devices.',
    components: ['BarList'],
    examples: [
      { id: 'breakdowns', title: 'Breakdowns', block: true },
      { id: 'empty', title: 'Empty', block: true },
    ],
    guidelines: {
      do: [
        'Keep the list short (limit, default 6); the rest folds into "Other".',
      ],
      dont: ['Use it for change over time; that is a time series chart.'],
    },
    accessibility: [
      'A list; each row speaks its label, value and share of the total.',
      'The share shows on hover and focus, and is always in the spoken text.',
    ],
  },
  {
    slug: 'calendar-heatmap',
    name: 'Calendar heatmap',
    group: 'Data display',
    summary: 'Activity per day over recent weeks, in the data scale.',
    components: ['CalendarHeatmap'],
    examples: [{ id: 'applications', title: 'Applications sent', block: true }],
    accessibility: [
      'Summarised as one image label; active days are listed in "Show data".',
    ],
  },
  {
    slug: 'preview-frame',
    name: 'Preview frame',
    group: 'Data display',
    summary: 'A sandboxed live preview of a rendered resume, scaled to fit.',
    components: ['PreviewFrame'],
    examples: [{ id: 'resume', title: 'Rendered resume', block: true }],
    accessibility: [
      'The iframe has a title; scripts are off unless allowScripts is set.',
    ],
  },
  {
    slug: 'panel',
    name: 'Panel',
    group: 'Layout',
    summary:
      'A bounded work area: header with actions, scrolling body, footer with actions.',
    components: ['Panel'],
    examples: [{ id: 'job', title: 'Job details panel' }],
    accessibility: [
      'A region named by its heading; set headingLevel to fit the outline.',
    ],
  },
  {
    slug: 'toolbar',
    name: 'Toolbar',
    group: 'Actions',
    summary: 'A row of grouped controls for an editor or view.',
    components: [
      'Toolbar',
      'ToolbarButton',
      'ToolbarToggleGroup',
      'ToolbarToggleItem',
    ],
    examples: [{ id: 'editor', title: 'Resume editor' }],
    accessibility: [
      'One Tab stop: arrow keys move between controls (roving focus).',
      'Icon-only buttons need aria-label.',
    ],
  },
  {
    slug: 'split-view',
    name: 'Split view',
    group: 'Layout',
    summary: 'Resizable panes side by side, stacked on small screens.',
    components: ['SplitView'],
    examples: [{ id: 'editor', title: 'Editor and preview', block: true }],
    accessibility: [
      'Separators follow the ARIA window-splitter pattern: focusable, with the size as aria-valuenow.',
      'Arrow keys resize (Shift for larger steps); Home and End go to the limits.',
    ],
  },
  {
    slug: 'virtual-list',
    name: 'Virtual list',
    group: 'Layout',
    summary: 'Renders only the rows in view, for very long lists.',
    components: ['VirtualList'],
    examples: [{ id: 'log', title: '5,000 rows', block: true }],
    accessibility: [
      'Rows keep aria-setsize and aria-posinset so their position in the full list is known.',
      'The scroll region is focusable and labelled.',
    ],
  },
  {
    slug: 'shortcuts',
    name: 'Keyboard shortcuts',
    group: 'Navigation',
    summary:
      'Register shortcuts with useShortcut and list them in a help dialog opened with ?.',
    components: ['ShortcutHelp'],
    examples: [
      { id: 'help', title: 'J / K navigation and ? help', block: true },
    ],
    guidelines: {
      do: [
        'Use single keys only where focus is not in a text field.',
        'List every shortcut in the help dialog.',
      ],
      dont: ['Override browser or screen-reader shortcuts.'],
    },
    accessibility: [
      'Single-key shortcuts are ignored while typing in a field.',
      'Keys are shown for the platform (⌘ on Mac, Ctrl elsewhere).',
    ],
  },
  {
    slug: 'swipe-deck',
    name: 'Swipe deck',
    group: 'Data display',
    summary: 'Decide on cards one at a time: drag, buttons or arrow keys.',
    components: ['SwipeDeck'],
    examples: [{ id: 'jobs', title: 'Job matches', block: true }],
    accessibility: [
      'Every decision has a button; dragging is never the only way.',
      'The deck is focusable, arrow keys decide, and decisions are announced.',
    ],
  },
  {
    slug: 'graph-kit',
    name: 'Graph kit',
    group: 'Data display',
    summary:
      'The frame around a graph engine: a labelled region, zoom controls, legend and node details.',
    components: [
      'GraphRegion',
      'GraphControls',
      'GraphLegend',
      'GraphNodeCard',
    ],
    examples: [{ id: 'similarity', title: 'Job similarity', block: true }],
    accessibility: [
      'The region is labelled and described; controls are labelled buttons.',
      'Node details update politely; make nodes focusable in the engine where possible.',
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
