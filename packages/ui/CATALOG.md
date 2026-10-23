# Component catalog: what the registry needs that @jsonresume/ui lacks

A list of the component types the registry uses that the design system
doesn't provide yet. Entries describe what each component does, not how it
looks today: each one will be designed fresh in the jsonresume.org style.

- **Uses:** where that job appears in `apps/registry/app` today, as
  `[username]/…` routes, other routes, and `components/`.
- **Have:** the closest current `@jsonresume/ui` piece, if any.
- **Priority:** P1 is needed on many registry pages, P2 by a few features,
  P3 by one specialised surface.

## Overlays and notices

| Component          | What it does                                                                                               | Uses                                                                      | Have                   | Priority |
| ------------------ | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------- | -------- |
| **Toast**          | Brief, non-blocking confirmation or error after an action ("Saved", "Upload failed")                       | Pathways: chat persistence, upload, embedding, voice, speech (via sonner) | –                      | P1       |
| **Dropdown menu**  | A button that opens a list of actions or options                                                           | Job panel footer; mobile site menu                                        | –                      | P1       |
| **Sheet / drawer** | A panel that slides over the page from the side or bottom, for details without leaving the view            | Pathways swipe detail sheet; job panel                                    | Dialog (centered only) | P1       |
| **Popover**        | A small anchored panel of rich content (details, quick filters) that's more than a tooltip                 | Graph node details                                                        | Tooltip (text only)    | P2       |
| **Banner**         | A dismissible, page-wide notice above content (e.g. "You're viewing a public dashboard. Sign in for more") | Public dashboard, jobs, timeline, JSON, ATS pages                         | Callout (inline only)  | P1       |

## Navigation

| Component                  | What it does                                                                          | Uses                                                  | Have                                           | Priority |
| -------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------- | -------- |
| **Tab navigation (links)** | Horizontal navigation between sibling pages of one area, showing the current one      | Profile area: dashboard, jobs, timeline, ATS, letter… | NavList (vertical); Tabs (in-page panels only) | P1       |
| **Account menu**           | Signed-in user's avatar or name in the header, opening profile, settings and sign out | Site header auth links                                | SiteHeader `actions` slot                      | P1       |
| **Pagination / load more** | Move through long result sets, or append the next page                                | Job board, explore, activity log, chat history        | –                                              | P1       |
| **Back link**              | Return to the parent list from a detail page                                          | Job detail                                            | Link                                           | P3       |

## Inputs

| Component                  | What it does                                                               | Uses                                                                 | Have                              | Priority |
| -------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------- | -------- |
| **Search field**           | Text search with icon, clear button and debounced change                   | Job board, explore resumes, both graph control bars                  | Input (plain)                     | P1       |
| **Filter bar**             | Several facet filters together, with active-filter chips and reset         | Job board filters (type, experience, location, salary, company)      | Select                            | P1       |
| **Segmented control**      | Pick one of a few modes in place (Form / JSON / AI)                        | Resume editor toolbar mode selector                                  | Tabs (switches panels, not modes) | P1       |
| **Tag input**              | Add and remove short values as chips (skills, keywords, highlights)        | Resume editor skill and keyword fields                               | Badge (display only)              | P1       |
| **Range slider**           | Choose a value or a min–max range, optionally over a distribution          | Salary histogram slider; graph thresholds; decision criteria weights | –                                 | P2       |
| **Combobox**               | A select you can type into, with filtering, for long option lists          | Editor and letter form selects                                       | Select (native)                   | P2       |
| **File drop zone**         | Drag-and-drop or browse to upload, with progress and errors                | Pathways resume upload                                               | –                                 | P2       |
| **Repeatable field group** | Add, remove and reorder entries of one shape (work, education, profiles)   | Resume editor sections                                               | Field (single control)            | P2       |
| **Chat composer**          | Multi-line message input with send, Enter-to-send and optional voice input | AI editor chat; Pathways copilot                                     | Textarea                          | P2       |
| **Code editor**            | JSON editing with schema validation, errors and formatting                 | Resume editor JSON mode; JSON page; Pathways editor tab              | CodeBlock (read-only)             | P3       |

## Feedback and status

| Component                                  | What it does                                                         | Uses                                                                     | Have                                    | Priority |
| ------------------------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------- | -------- |
| **Page states: loading, error, not found** | Whole-page or panel-level states, with retry and a way back          | Loading screens, error states and fallbacks, not-found states throughout | Spinner, Skeleton, EmptyState (partial) | P1       |
| **Error boundary fallback**                | Catches a crashed region and offers retry without losing the page    | Pathways and other client modules                                        | –                                       | P1       |
| **Sign-in gate**                           | Explains that a feature needs sign-in and offers sign in with GitHub | Auth-required pages, login buttons, GitHub button                        | –                                       | P1       |
| **Score meter**                            | A 0–100 score with rating bands (circular or bar)                    | ATS score; readiness and insights in job reports                         | Progress (linear, unlabelled)           | P1       |
| **Item status toggles**                    | Mark an item read, interested or hidden, with quick undo             | Job lists (job states sync)                                              | –                                       | P2       |

## Data display

| Component                | What it does                                                                       | Uses                                                                   | Have                          | Priority |
| ------------------------ | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------- | -------- |
| **Stat tile**            | A key number with label and optional trend or comparison                           | Dashboard, job report insights, info cards                             | –                             | P1       |
| **Job card**             | A job summary: title, company, location, salary, match score, state and actions    | Job board, job lists, matches, graph panels                            | Card (generic)                | P1       |
| **Resume / person card** | A person summary: avatar, name, label, location, link to resume                    | Explore, matching candidates, profile cards                            | Card, Avatar                  | P1       |
| **Description list**     | Labelled facts in pairs (Location: Remote, Salary: $150k)                          | Job detail sections, resume panes, API responses                       | –                             | P1       |
| **Markdown content**     | Render (and stream) Markdown safely in the brand's prose style                     | Chat messages, cover letter preview, suggestions                       | Prose (styles only)           | P1       |
| **Copy button**          | Copy a value or link with confirmation                                             | Job panel header, API keys                                             | Inside CodeBlock only         | P1       |
| **Chat message list**    | Conversation turns by role, streaming text, tool-call parts, auto-scroll           | AI editor chat; Pathways copilot                                       | –                             | P2       |
| **Activity feed**        | Time-stamped events in order, with relative times                                  | Pathways activity log, recent activity                                 | –                             | P2       |
| **Timeline**             | Vertical career or activity timeline with dated entries                            | Timeline page; report activity timeline                                | – (legacy `@repo/ui` has one) | P2       |
| **Charts**               | Bar, line, radar and histogram charts on brand tokens, with accessible data tables | Job report: salary, pipeline, readiness radar, activity (via recharts) | –                             | P2       |
| **Checklist results**    | A list of checks with pass, warn or fail and an explanation each                   | ATS ratings and scoring table                                          | Table, Badge                  | P2       |
| **Secret field**         | A masked API key with reveal, copy, rotate and revoke                              | API keys page                                                          | –                             | P3       |
| **Calendar heatmap**     | Activity per day over weeks                                                        | Job report activity heatmap                                            | –                             | P3       |
| **Resume preview frame** | Sandboxed live preview of a rendered theme, with sizing                            | Resume editor preview; letter preview                                  | –                             | P3       |

## Layout and interaction

| Component              | What it does                                                                          | Uses                                                                  | Have  | Priority |
| ---------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ----- | -------- |
| **Panel**              | A bounded work area with sticky header, scrolling body and footer actions             | Job panels, graph panels, editor panels                               | Card  | P1       |
| **Toolbar**            | A row of grouped actions and controls for an editor or view                           | Resume editor toolbar; graph controls                                 | Stack | P2       |
| **Split view**         | Two or three resizable panes side by side (editor and preview; resume, jobs and tree) | Resume editor; decisions page                                         | –     | P2       |
| **Virtualized list**   | Render very long lists efficiently                                                    | Chat history, activity log, feedback history (via react-virtuoso)     | –     | P2       |
| **Keyboard shortcuts** | Register shortcuts and show them (with Kbd) in a help overlay                         | Jobs graph navigation                                                 | Kbd   | P3       |
| **Swipe deck**         | Accept or reject cards by swiping or with keys                                        | Pathways swipe                                                        | –     | P3       |
| **Graph canvas kit**   | Controls, legend and node details around a network visualisation                      | Jobs graph, job similarity, similarity, Pathways graph, decision tree | –     | P3       |

## Already covered

These registry needs map directly to existing components, so their migration
is a swap:

Button, Badge, Card, Input, Textarea, Select (native), Checkbox, Switch,
Tabs (in-page panels), Accordion, Avatar, Progress (linear), Separator →
Divider, Dialog, Tooltip, Table, Callout, EmptyState, Spinner, Skeleton,
CodeBlock, Breadcrumbs, the site chrome (SiteHeader, PageHeader, SiteFooter),
and the layout primitives.

## Suggested order

1. **Foundations for most pages:** Toast, Dropdown menu, Sheet, Banner, Tab
   navigation, Account menu, Page states with error boundary, Sign-in gate.
2. **Lists and results:** Search field, Filter bar, Pagination, Job card,
   Resume card, Stat tile, Description list, Score meter, Copy button,
   Markdown.
3. **Editing:** Segmented control, Tag input, Repeatable field group,
   Combobox, Range slider, File drop zone, Panel, Toolbar.
4. **Specialised:** Chat, Activity feed, Timeline, Charts, Split view,
   Virtualized list, Code editor, Graph kit, Swipe deck, Heatmap, Preview
   frame, Secret field.
