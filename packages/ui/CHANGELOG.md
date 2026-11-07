# @jsonresume/ui

## 0.3.0

### Minor Changes

- b66c2bb: Honest waits: `ProgressSteps` says what a long wait is doing (each step done, under way or still to come, in words and a live region), and `TreeMapSkeleton` holds a `TreeMap`'s shape while its data loads, with that progress laid over it.
- d389459: `SheetContent side="full"`: the whole screen on phones and a large centred panel from md up, for previews that need the room (the theme gallery's preview uses it).

### Patch Changes

- 61c8da2: The app shell on phones: the menu button and account menu are 44px targets and never squeezed, the account menu shows the avatar alone below 600px (the name stays its accessible name), and `AppPage` actions move under the title, sharing a row at 44px tall (ghost actions take an outline there). `DropdownMenuItem asChild` no longer throws when rendering a link (Radix Slot needs a `Slottable`); links in menus drop the underline, and menu rows are 44px on touch screens. Desktop is unchanged.

## 0.2.0

### Minor Changes

- 3d8ae9e: Dashboard components: `TimeSeriesChart`, `BarList`, `Sparkline`, `AppShell`, `AppNav`, `AppPage`, `AuthCard` and `GithubIcon`; `StatTile` gains `delta` and `trend`, `Divider` a `label`. Chart colour tokens (`vars.color.chart`), validated for colour-blind separation and contrast in both themes. Base link colour now applies to plain links only, so links styled as buttons keep their colours on hover.
- 157fdb3: Pieces for editors: `AppPage` `fill` (the content takes the rest of the screen from lg up), `PreviewFrame` `height="fill"` and `busy`, `Select` `inline`, and a `useSettledValue` hook. `AppPage` content no longer widens past the screen when it holds long lines of code.
- d9ed74a: A full-screen SiteHeader menu that grows down from the band, with a burger that turns into a cross, Escape, a Tab loop and a held page. SiteFooter takes `groups`, `brand` and `legal` for a columned footer. New RouteProgress for slow page loads, and page-transition styles in `base` for apps that turn on view transitions. Dialogs, sheets, menus and popovers animate out as well as in; buttons give under a press; link and interactive cards lift under a mouse. The app navigation sheet is narrower and aligned, with larger touch rows. Table becomes a focusable, named region while it scrolls sideways. PreviewFrame drops scripts its sandbox would block. Long links and inline code wrap in Prose; long account names truncate.
- ebfab66: TreeLegend: a TreeMap's key, each tone drawn as the map draws it. TreeMap labels move to a free place (clipped to their column, or above the square) instead of disappearing when crowded. CodeEditor follows the dark theme and colours JSON from the tokens. Pagination fits narrow columns. ChatToolCall wraps on small screens and only looks expandable when it has details.
- 7b1bf0b: `Text` gains `success`, `warning` and `danger` tones for status words beside a field, and `Card` a `danger` tone for irreversible actions. `PageHeader` actions now wrap on narrow screens instead of overflowing.

### Patch Changes

- 77a952e: `AppPage` actions centre vertically, so status text lines up with the buttons beside it.
