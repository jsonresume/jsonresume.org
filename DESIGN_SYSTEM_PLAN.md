# Design System Initiative Plan

## Vision

- Establish `@repo/ui` as the single source of truth for design tokens, primitives, complex components, and patterns used across every application and theme in the monorepo.
- Deliver an interactive "Design Components" experience that documents, demonstrates, and validates every asset while meeting modern accessibility and industry standards.

## Phase 1 – Discovery & Alignment

- **Stakeholders**: Interview Homepage, Registry, theme maintainers, and brand/design owners to capture requirements, pain points, and success criteria.
- **Inventory**: Audit existing UI usage across apps/themes, catalog overlapping components, and identify gaps versus `@repo/ui`.
- **Brand Baseline**: Confirm color palette (`#FFF18F`), typography, spacing, iconography, motion guidelines, accessibility targets (WCAG 2.2 AA), light/dark behaviour, and future theming needs.
- **Tooling Audit**: Assess Tailwind sharing, lint rules, Storybook absence, testing coverage, release tooling (Changesets) and CI gaps.
- **Success Metrics**: Define adoption KPIs (component usage, visual diffs, a11y scores, release cadence, doc engagement) to track progress.

## Phase 2 – Foundation Hardening (`@repo/ui`)

- **Structure**: Organize `/src` into `design-tokens`, `foundations`, `components`, `patterns`, `primitives`, and `hooks`. Centralize exports via `src/index.ts` while keeping per-component entry points for tree-shaking.
- **TypeScript**: Tighten compiler settings (enable `strict` family, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`), publish clean type definitions, standardize path aliases.
- **Styling**: Migrate `tailwind.config` to TypeScript, split base tokens vs. component scales, ensure global CSS variables and fonts are consistent.
- **Utilities**: Expand helpers (variant typing, focus-visible helpers, RTL utilities, responsive container utilities) to reduce duplication.

## Phase 3 – Design Tokens & Theming

- **Token Model**: Define core tokens (color, typography, spacing, radii, shadows, motion, z-index, opacity) with JSON + TS + CSS variable outputs.
- **Multi-theme Support**: Create light, dark, and high-contrast theme maps with clear override strategy for consuming apps.
- **Design Tool Sync**: Export tokens via Style Dictionary/Figma Tokens for design parity and set up automated sync pipelines.
- **Typography System**: Codify heading/body scales and ship `Text`, `Heading`, `Prose` components with clear usage guidance.

## Phase 4 – Component Architecture

- **Radix/Primitive Audit**: Update to latest Radix primitives, ensure slot-based composition, controlled/uncontrolled options, and consistent variant APIs.
- **Coverage Expansion**: Deliver missing components (modal, tooltip, toast provider, tabs, table, tag, avatar stack, breadcrumbs, pagination, layout primitives) and ensure form patterns align with actual product scenarios.
- **Patterns**: Build higher-level compositions (auth forms, resume cards, hero sections) while keeping them opt-in and well-documented.
- **Accessibility**: Integrate Axe/Testing Library checks, enforce keyboard support, focus management, and aria attributes as part of component definitions.
- **Internationalization**: Guarantee RTL readiness and locale-friendly formatting (e.g., dates, numbers) in relevant components.
- **Motion**: Centralize animation tokens (duration, easing) and standardize Tailwind animation utilities.

## Phase 5 – Tooling & Quality Gates

- **Storybook**: Introduce Storybook 8 with Next.js framework, MDX docs, controls, interactions, a11y, viewport, and measure addons; re-use Tailwind config and fonts.
- **Playground App**: Stand up an `apps/design-system` Next.js app or dedicated route for live previews, prototypes, and marketing-friendly docs.
- **Testing**:
  - Unit/integration with React Testing Library + Vitest/Jest for behaviour and a11y assertions.
  - Visual regression via Chromatic or Storybook Test Runner in CI.
  - Automated accessibility checks (Storybook addon, axe, pa11y) on every PR.
- **Lint/Format**: Extend shared ESLint (React, Hooks, Testing Library, Storybook) and add Stylelint + Tailwind class sorting rules.
- **Build Verification**: Ensure `pnpm build --filter @repo/ui` emits ESM + DTS bundles; consider Rollup bundling for external publishing readiness.

## Phase 6 – Documentation & Design Components Experience

- **Docs Site**: Create an interactive documentation site (new app or Registry route) with sections for overview, tokens, foundations, components, patterns, theming, migration guides, and changelog.
- **Live Examples**: Embed Storybook stories or live sandboxes with code previews, prop tables, anatomy diagrams, accessibility notes, and Figma links.
- **Contribution Guide**: Document component proposal process, review checklist, testing expectations, and release workflow.

## Phase 7 – Adoption Across Apps

- **Shared Foundations**: Guarantee every app imports `@repo/ui/globals.css` and extends `@repo/ui/tailwind.config`; remove redundant Tailwind configs.
- **Migration Playbooks**: Provide step-by-step guides for replacing legacy components (e.g., bootstrap buttons) with design-system equivalents; track progress with dashboards.
- **App Theming**: Allow app-level token overrides via CSS variables; provide context/provider for runtime theme changes (light/dark/user preference).
- **Deprecation Strategy**: Flag legacy components, enforce lint rules to prevent new usage, and define removal timelines.

## Phase 8 – Governance & Delivery

- **Versioning**: Adopt Changesets for semver releases of `@repo/ui`; define stable vs. alpha channels.
- **CI/CD**: Add pipelines for lint/test/build/storybook previews (Vercel/Chromatic) and fail builds on a11y or visual regressions.
- **Design Reviews**: Create issue templates requiring Figma references, acceptance criteria, and accessibility sign-off.
- **Support Model**: Establish maintainer rotation, triage schedule, Discord support channel, and FAQ/troubleshooting doc.
- **Feedback & Analytics**: Instrument docs for usage analytics, collect component adoption telemetry, and feed data back into roadmap planning.

## Phase 9 – Future Enhancements

- **Theme Packs**: Offer optional brand presets for resume themes (colors, typography bundles).
- **Cross-Framework**: Explore web component wrappers or adapters for non-React consumers.
- **CLI Scaffolding**: Evolve `pnpm ui:add` to scaffold patterns/stories/tests automatically.
- **Design Integration**: Automate two-way token sync with Figma APIs.
- **Advanced Accessibility**: Add automated contrast checks, inclusive language linting, and AI-assisted guidance.

## Immediate Next Steps

1. Schedule discovery workshops with key stakeholders and run the UI inventory audit.
2. Harden `@repo/ui` foundations (structure, TypeScript, Tailwind) and introduce Storybook.
3. Blueprint the documentation experience and decide hosting (new app or shared route).
4. Pilot migrating a focused feature (e.g., Registry onboarding) to validate patterns before scaling repo-wide.
